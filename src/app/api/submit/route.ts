import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { getSubmissionEvaluationPrompt } from '@/lib/prompts/submission';
import { dataService } from '@/lib/data';

export async function POST(req: Request) {
  try {
    const { caseId, submittedCode, userId = 'test-user' } = await req.json();

    const bugCase = await dataService.getBugCaseById(caseId);
    if (!bugCase) {
      return new Response(JSON.stringify({ error: "Case not found" }), { status: 404 });
    }

    let evaluation;
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      try {
        const prompt = getSubmissionEvaluationPrompt(
          bugCase.user_complaint,
          bugCase.broken_code,
          bugCase.expected_code,
          submittedCode
        );

        const { text } = await generateText({
          model: google('gemini-2.0-flash'),
          prompt,
          temperature: 0.1,
        });

        evaluation = JSON.parse(text.replace(/```json|```/g, ''));
      } catch (aiError) {
        console.warn("AI generation failed, falling back to heuristic evaluation:", aiError);
        evaluation = fallbackEvaluate(submittedCode, bugCase.expected_code, bugCase.broken_code);
      }
    } else {
      evaluation = fallbackEvaluate(submittedCode, bugCase.expected_code, bugCase.broken_code);
    }

    // Save submission to data layer
    const submission = await dataService.submitSolution({
      user_id: userId,
      bug_case_id: caseId,
      submitted_code: submittedCode,
      is_passed: evaluation.is_passed,
      score: evaluation.score,
    });

    // Save feedback
    const feedback = await dataService.saveAiFeedback({
      submission_id: submission.id,
      feedback_text: evaluation.hint,
      score: evaluation.score,
      what_is_wrong: evaluation.what_is_wrong,
      what_is_correct: evaluation.what_is_correct,
      hint: evaluation.hint,
      fixed_concept: evaluation.fixed_concept,
      next_practice_task: evaluation.next_practice_task,
      weaknesses_detected: evaluation.weaknesses_detected || [],
    });

    // Update progress, XP, streak if passed
    if (evaluation.is_passed && bugCase.xp_reward) {
      await dataService.logXPEvent(userId, bugCase.xp_reward, 'case_submission');
      await dataService.updateStudentProgress(userId, caseId);
      await dataService.updateStreak(userId);
    }

    // Update Skill Memory
    if (evaluation.weaknesses_detected && evaluation.weaknesses_detected.length > 0) {
      await dataService.updateSkillMemory(userId, evaluation.weaknesses_detected, evaluation.score);
    }

    return new Response(JSON.stringify({ submission, feedback, evaluation }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Submission API Error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred during submission." }),
      { status: 500 }
    );
  }
}

function fallbackEvaluate(submitted: string, expected: string, broken: string) {
  const clean = (str: string) => str.replace(/\s+/g, ' ').trim();
  const normSub = clean(submitted);
  const normExp = clean(expected);
  const normBrok = clean(broken);

  const isExactMatch = normSub === normExp;
  const isFixed = isExactMatch || (normSub !== normBrok && normSub.length > 20);
  const score = isExactMatch ? 100 : isFixed ? 85 : 30;

  return {
    is_passed: isFixed,
    score,
    what_is_wrong: isFixed ? "No critical errors found." : "The code retains the broken behavior.",
    what_is_correct: isFixed ? "Code structure matches expected solution requirements." : "Partial changes detected.",
    hint: isFixed ? "Awesome work! You fixed the bug." : "Review dependency arrays and state updates.",
    fixed_concept: "React State Management",
    next_practice_task: "Proceed to the next mission on your dashboard.",
    weaknesses_detected: isFixed ? [] : ["useEffect", "state-mutation"],
  };
}
