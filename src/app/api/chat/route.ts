import { google } from '@ai-sdk/google';
import { streamText, createTextStreamResponse } from 'ai';
import { getDrReactMentorPrompt, getFallbackDrReactHint } from '@/lib/ai/mentorPrompt';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    const {
      language = 'english',
      mentorStyle = 'friendly',
      bugDescription = '',
      currentCode = '',
      title = 'React Hospital Mission',
      difficulty = 'Medium',
      errorLogs = '',
      brokenCode = '',
    } = context || {};

    const hintLevel = Math.min(5, (messages?.length || 1));

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      const fallbackText = getFallbackDrReactHint({
        title,
        difficulty,
        userComplaint: bugDescription,
        errorLogs,
        brokenCode,
        currentCode,
        language: language as 'english' | 'urdu_hindi' | 'hinglish',
        hintLevel,
      });
      return new Response(fallbackText, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const safeCode = (currentCode || '').slice(0, 10000);
    const safeBrokenCode = (brokenCode || '').slice(0, 10000);

    const systemPrompt = getDrReactMentorPrompt({
      title,
      difficulty,
      userComplaint: bugDescription,
      errorLogs,
      brokenCode: safeBrokenCode,
      currentCode: safeCode,
      language: language as 'english' | 'urdu_hindi' | 'hinglish',
      mentorStyle: mentorStyle as 'friendly' | 'direct' | 'interview',
      hintLevel,
    });

    const coreMessages = (messages as Array<{ role: string; parts?: Array<{ type: string; text: string }>; content?: string }>)
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: typeof m.content === 'string' && m.content.length > 0
          ? m.content
          : m.parts
          ? m.parts.filter((p) => p.type === 'text').map((p) => (p as { text: string }).text).join('')
          : '',
      }))
      .filter((m) => m.content.length > 0);

    const result = streamText({
      model: google('gemini-2.0-flash'),
      system: systemPrompt,
      messages: coreMessages,
      temperature: 0.7,
      onError: (error) => {
        console.error('[Dr. React Stream Error]:', error);
      },
    });

    return createTextStreamResponse({ textStream: result.textStream });
  } catch (error) {
    console.error('Chat API Error:', error);
    const fallbackText = getFallbackDrReactHint({
      language: 'english',
      hintLevel: 1,
    });
    return new Response(fallbackText, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
