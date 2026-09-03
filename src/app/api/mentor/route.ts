import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { getDrReactMentorPrompt, MentorContext } from '@/lib/ai/mentorPrompt';

export async function POST(req: Request) {
  try {
    const body: MentorContext = await req.json();
    const safeQuestion = (body.question || '').slice(0, 1000);
    const safeBody: MentorContext = {
      ...body,
      currentCode: (body.currentCode || '').slice(0, 10000),
      brokenCode: (body.brokenCode || '').slice(0, 10000),
      question: safeQuestion,
    };
    const hintLevel = safeBody.hintLevel || 1;

    let responseText = '';

    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      try {
        const systemPrompt = getDrReactMentorPrompt(safeBody);
        const userPrompt = safeQuestion.trim()
          ? `Student Question: "${safeQuestion}" (Hint Level ${hintLevel} requested)`
          : `Provide Hint Level ${hintLevel} for this mission.`;

        const { text } = await generateText({
          model: google('gemini-2.0-flash'),
          system: systemPrompt,
          prompt: userPrompt,
          temperature: 0.7,
        });

        responseText = text;
      } catch (aiError) {
        console.warn("[Dr. React API] AI generation error, using fallback hint:", aiError);
        responseText = getFallbackDrReactHint(body);
      }
    } else {
      responseText = getFallbackDrReactHint(body);
    }

    const nextMicroStep = hintLevel === 1
      ? "Check why server and client render outputs might differ."
      : hintLevel === 2
      ? "Look closely at the useEffect hook or component initial state."
      : hintLevel === 3
      ? "Inspect variable initialization before render return."
      : "Apply state setter pattern or isClient flag.";

    return new Response(
      JSON.stringify({
        message: responseText,
        hintLevel,
        nextAction: nextMicroStep,
        doctor: "Dr. React — Senior Debugging Mentor",
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("[Mentor API Error]:", error);
    return new Response(
      JSON.stringify({ error: "Dr. React is currently attending an emergency. Please try again." }),
      { status: 500 }
    );
  }
}

function getFallbackDrReactHint(ctx: MentorContext): string {
  const isHinglish = ctx.language === 'urdu_hindi' || ctx.language === 'hinglish';
  const level = ctx.hintLevel || 1;
  const title = ctx.title || 'Mission';

  if (isHinglish) {
    if (level === 1) {
      return `🩺 **Dr. React Hint #1 (Conceptual Clue):**\n\nHey survivor! "${title}" mission mein main issue state synchronization ka hai. Jab component pehli baar render hota hai, toh browser aur server ki values alag hoti hain. Pehle yeh check karo ki layout shift kyun ho raha hai.`;
    } else if (level === 2) {
      return `🩺 **Dr. React Hint #2 (Where to look):**\n\nComponent ke \`useEffect\` hook area ko dekho. Kya client-side initialization mount hone ke baad ho rahi hai ya directly render function ke andar?`;
    } else if (level === 3) {
      return `🩺 **Dr. React Hint #3 (Line Clue):**\n\nLine 3-7 check karo: \`typeof window !== 'undefined'\` ko direct return mein likhne se SSR hydration clash hoti hai. Isse ek \`isClient\` state variable waale \`useEffect\` se replace karo.`;
    } else {
      return `🩺 **Dr. React Hint #4 (Near Solution):**\n\n\n\`\`\`tsx\nconst [isClient, setIsClient] = useState(false);\nuseEffect(() => { setIsClient(true); }, []);\n\`\`\`\nYeh pattern use karke render mein \`isClient ? 'Client' : 'Server'\` check karo!`;
    }
  }

  if (level === 1) {
    return `🩺 **Dr. React Hint #1 (Conceptual Clue):**\n\nWelcome to the ward! In "${title}", the issue stems from state synchronization. The HTML generated on initial render doesn't match what the client sees. Think about when client-side state should activate.`;
  } else if (level === 2) {
    return `🩺 **Dr. React Hint #2 (Where to Look):**\n\nExamine the \`useEffect\` hook and state declarations. Are you computing browser-only state directly inside the render return?`;
  } else if (level === 3) {
    return `🩺 **Dr. React Hint #3 (Line Clue):**\n\nCheck lines 3-7: Inline ternary checks like \`typeof window !== 'undefined'\` trigger React hydration warnings. Use a mounted \`isClient\` state instead.`;
  } else {
    return `🩺 **Dr. React Hint #4 (Near Solution):**\n\nDeclare \`const [isClient, setIsClient] = useState(false);\` and set it to \`true\` inside a \`useEffect\`. Render condition based on \`isClient\`!`;
  }
}
