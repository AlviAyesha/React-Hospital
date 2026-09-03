import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type = 'Feedback',
      rating = 5,
      whatConfused = '',
      drReactHelpful = 'Yes',
      hintQuality = 'Just right',
      difficultyRating = 'Medium',
      wouldPayPro = 'Maybe',
      userEmail = '',
      userId = '',
    } = body;

    const adminSupabase = getSupabaseAdminClient();
    if (adminSupabase) {
      await adminSupabase.from('beta_feedback').insert([
        {
          type,
          rating,
          what_confused: whatConfused,
          dr_react_helpful: drReactHelpful,
          hint_quality: hintQuality,
          difficulty_rating: difficultyRating,
          would_pay_pro: wouldPayPro,
          user_email: userEmail,
          user_id: userId || null,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Thank you for helping us polish React Hospital!" }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("[Feedback API Error]:", error);
    return new Response(JSON.stringify({ error: "Failed to save feedback" }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const eventData = await req.json();
    const adminSupabase = getSupabaseAdminClient();

    if (adminSupabase) {
      await adminSupabase.from('analytics_events').insert([
        {
          event_name: eventData.event,
          payload: eventData.payload || {},
          created_at: eventData.timestamp || new Date().toISOString(),
        },
      ]);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ success: false }), { status: 200 });
  }
}
