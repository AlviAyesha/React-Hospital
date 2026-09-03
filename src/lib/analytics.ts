export type BetaEventName =
  | 'signup_completed'
  | 'onboarding_completed'
  | 'first_case_started'
  | 'first_hint_requested'
  | 'first_submission_completed'
  | 'case_solved'
  | 'case_failed'
  | 'pro_case_clicked'
  | 'upgrade_clicked'
  | 'checkout_started';

export interface BetaEventPayload {
  userId?: string;
  caseId?: string;
  score?: number;
  plan?: string;
  metadata?: Record<string, unknown>;
}

export function trackBetaEvent(eventName: BetaEventName, payload: BetaEventPayload = {}) {
  const timestamp = new Date().toISOString();
  const eventData = {
    event: eventName,
    payload,
    timestamp,
  };

  if (typeof window !== 'undefined') {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('rh_analytics_events') || '[]');
      existingLogs.push(eventData);
      localStorage.setItem('rh_analytics_events', JSON.stringify(existingLogs.slice(-100)));
    } catch {
      // Ignore local storage quota error
    }
  }

  // Asynchronously send to server if API endpoint exists
  fetch('/api/feedback', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  }).catch(() => {
    // Fail silently in background
  });
}
