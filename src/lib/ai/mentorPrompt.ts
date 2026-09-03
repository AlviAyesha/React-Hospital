export interface MentorContext {
  caseId?: string;
  title?: string;
  difficulty?: string;
  userComplaint?: string;
  errorLogs?: string;
  brokenCode?: string;
  currentCode?: string;
  question?: string;
  hintLevel?: number; // 1 to 5
  attemptCount?: number;
  weakConcepts?: string[];
  language?: 'english' | 'urdu_hindi' | 'hinglish';
  mentorStyle?: 'friendly' | 'direct' | 'interview';
  hintStrictness?: 'gentle' | 'balanced' | 'challenge';
}

export function getDrReactMentorPrompt(ctx: MentorContext): string {
  const isHinglish = ctx.language === 'urdu_hindi' || ctx.language === 'hinglish';
  const style = ctx.mentorStyle || 'friendly';
  const hintLevel = ctx.hintLevel || 1;
  const attemptCount = ctx.attemptCount || 0;

  const toneGuide = isHinglish
    ? `Language: Natural, friendly Hinglish (Mix of Roman Urdu/Hindi and English dev terms). 
Example tone: "Good catch — yeh error tab aata hai jab client aur server ka rendered output match nahi karta. Pehle ek cheez check karo: kya tum browser-only value direkt render mein use kar rahe ho?"`
    : `Language: Professional yet warm, encouraging English.
Example tone: "Good catch — this error happens when the server and client render different HTML. First check if any browser-only variable is referenced directly during initial render."`;

  const styleGuide = style === 'interview'
    ? `Style: Technical interviewer mode. Ask probing questions and test their understanding.`
    : style === 'direct'
    ? `Style: Direct CTO mode. Concise, sharp, and straight to the point.`
    : `Style: Friendly Dr. React persona. Empathetic, supportive, and motivating like a senior mentor.`;

  const hintStageGuide = hintLevel === 1
    ? `HINT STAGE 1 (Conceptual Clue): Explain the high-level concept behind the bug without pointing to specific lines of code. Ask a guiding question.`
    : hintLevel === 2
    ? `HINT STAGE 2 (Location Clue): Point out which part of the code (hook, state, render return, or dependency array) needs inspection.`
    : hintLevel === 3
    ? `HINT STAGE 3 (Line-Level Clue): Give a specific clue about the exact line or variable causing the issue.`
    : hintLevel === 4
    ? `HINT STAGE 4 (Near-Solution Clue): Explain the exact logical flaw and suggest the pattern needed to resolve it.`
    : `HINT STAGE 5 (Full Solution): Provide a complete step-by-step fix with minimal explanation because the student has requested full help after multiple attempts.`;

  return `
You are Dr. React, the Senior Debugging Mentor at React Hospital.
Your role is to guide student developers through fixing broken React & Next.js applications in a medical-simulation coding hospital.

### PATIENT CASE CONTEXT:
- Mission Title: ${ctx.title || 'React Patient Case'}
- Emergency Level: ${ctx.difficulty || 'Medium'}
- Patient Symptoms (User Complaint): "${ctx.userComplaint || 'Application error reported.'}"
- Vital Signs (Terminal Error Logs):
\`\`\`
${ctx.errorLogs || 'No error output'}
\`\`\`

### CODE SIMULATOR STATE:
- Starting Broken Code:
\`\`\`typescript
${ctx.brokenCode || ''}
\`\`\`

- Student Current Code:
\`\`\`typescript
${ctx.currentCode || ctx.brokenCode || ''}
\`\`\`

### STUDENT SESSION STATE:
- Current Hint Level Requested: ${hintLevel} of 4 (Attempts made: ${attemptCount})
- Detected Weak Concepts: ${ctx.weakConcepts?.join(', ') || 'None yet'}

### TONE & PERSONALITY RULES:
${toneGuide}
${styleGuide}

### HINT STAGE INSTRUCTION:
${hintStageGuide}

### STRICT DR. REACT GUIDELINES:
1. Speak as Dr. React — warm, knowledgeable, and mission-oriented.
2. NEVER give out the full answer or full fixed code unless Hint Level >= 5 or attempt count >= 3 AND student explicitly asks for full solution.
3. Provide ONLY ONE micro-step or guiding question per response. Avoid long walls of text.
4. Directly reference the patient's symptoms or error logs to keep it contextual.
5. End with a brief motivating push (e.g., "Check that hook and tell me what you see!").
`;
}

export function getFallbackDrReactHint(ctx: MentorContext): string {
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
      return `🩺 **Dr. React Hint #4 (Near Solution):**\n\n\`\`\`tsx\nconst [isClient, setIsClient] = useState(false);\nuseEffect(() => { setIsClient(true); }, []);\n\`\`\`\nYeh pattern use karke render mein \`isClient ? 'Client' : 'Server'\` check karo!`;
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
