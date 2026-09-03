import { 
  BugCase, 
  CaseSubmission, 
  AiFeedback, 
  SkillMemory, 
  StudentProgress, 
  Lesson, 
  CodeChallenge, 
  XPEvent 
} from './types';
import { getSupabaseBrowserClient, isSupabaseConfigured } from './supabase/client';
import { getSupabaseServerClient } from './supabase/server';

// Baseline seed bug cases
const seedBugCases: BugCase[] = [
  {
    id: "c1",
    title: "The Hydration Trap",
    difficulty: "Easy",
    access_level: "free",
    xp_reward: 100,
    description: "A component renders different content on the server vs the client, causing a React hydration mismatch.",
    user_complaint: "The text flashes and changes right after the page loads. Sometimes the layout shifts and it looks broken for a second.",
    error_logs: `Warning: Text content did not match.\n  Server: "Server"\n  Client: "Client"\nat HydrationBox\nat main`,
    broken_code: `export default function HydrationBox() {\n  return (\n    <div>\n      {typeof window !== 'undefined' ? 'Client' : 'Server'}\n    </div>\n  );\n}`,
    expected_code: `import { useState, useEffect } from 'react';\n\nexport default function HydrationBox() {\n  const [isClient, setIsClient] = useState(false);\n\n  useEffect(() => {\n    setIsClient(true);\n  }, []);\n\n  return (\n    <div>\n      {isClient ? 'Client' : 'Server'}\n    </div>\n  );\n}`
  },
  {
    id: "c2",
    title: "Infinite Loop Chaos",
    difficulty: "Medium",
    access_level: "free",
    xp_reward: 150,
    description: "A rogue useEffect with a missing or incorrect dependency array is causing an infinite re-render loop.",
    user_complaint: "The page keeps reloading itself forever and the browser tab freezes. It was working yesterday!",
    error_logs: `Warning: Maximum update depth exceeded.\nThis can happen when a component calls setState inside useEffect,\nbut useEffect either doesn't have a dependency array, or one of\nthe dependencies changes on every render.\n    at Counter\n    at App`,
    broken_code: `import { useState, useEffect } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  const [data, setData] = useState([]);\n\n  useEffect(() => {\n    setData([...data, count]);\n    setCount(count + 1);\n  });\n\n  return <div>Count: {count}</div>;\n}`,
    expected_code: `import { useState, useEffect } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  const [data, setData] = useState<number[]>([]);\n\n  useEffect(() => {\n    setData((prev) => [...prev, count]);\n  }, [count]);\n\n  const increment = () => setCount((c) => c + 1);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={increment}>Increment</button>\n    </div>\n  );\n}`
  },
  {
    id: "c3",
    title: "Stale Closure Nightmare",
    difficulty: "Hard",
    access_level: "pro",
    xp_reward: 200,
    description: "A setInterval inside useEffect captures a stale value of state via closure, causing the counter to behave incorrectly.",
    user_complaint: "The auto-incrementing counter always resets to 1 instead of counting up properly. The manual button works fine though.",
    error_logs: `No runtime error — logic bug only.\nThe counter value displayed always resets to 1 after the first tick.\nState updates appear to be lost between intervals.\nHint: Check how the interval's callback references state.`,
    broken_code: `import { useState, useEffect } from 'react';\n\nexport default function StaleCounter() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    const interval = setInterval(() => {\n      setCount(count + 1);\n    }, 1000);\n    return () => clearInterval(interval);\n  }, []);\n\n  return (\n    <div>\n      <p>Auto Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Manual +1\n      </button>\n    </div>\n  );\n}`,
    expected_code: `import { useState, useEffect } from 'react';\n\nexport default function StaleCounter() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    const interval = setInterval(() => {\n      setCount((prev) => prev + 1);\n    }, 1000);\n    return () => clearInterval(interval);\n  }, []);\n\n  return (\n    <div>\n      <p>Auto Count: {count}</p>\n      <button onClick={() => setCount((prev) => prev + 1)}>\n        Manual +1\n      </button>\n    </div>\n  );\n}`
  },
  {
    id: "c4",
    title: "Form Input State Lock",
    difficulty: "Medium",
    access_level: "pro",
    xp_reward: 175,
    description: "A form input field is locked because it uses a controlled input pattern without an onChange handler.",
    user_complaint: "I cannot type anything into the patient registration input field. My keyboard presses are ignored!",
    error_logs: `Warning: You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field. If the field should be mutable use \`defaultValue\`.\n    at input\n    at PatientForm`,
    broken_code: `import { useState } from 'react';\n\nexport default function PatientForm() {\n  const [name, setName] = useState("John Doe");\n\n  return (\n    <form>\n      <label>Patient Name:</label>\n      <input type="text" value={name} />\n    </form>\n  );\n}`,
    expected_code: `import { useState } from 'react';\n\nexport default function PatientForm() {\n  const [name, setName] = useState("John Doe");\n\n  return (\n    <form>\n      <label>Patient Name:</label>\n      <input \n        type="text" \n        value={name} \n        onChange={(e) => setName(e.target.value)} \n      />\n    </form>\n  );\n}`
  },
  {
    id: "c5",
    title: "Server Action Fetch Clash",
    difficulty: "Hard",
    access_level: "pro",
    xp_reward: 225,
    description: "An unhandled promise rejection in an async fetch call causes Next.js App Router to crash on dynamic page load.",
    user_complaint: "When opening a patient report, the entire app crashes with a blank screen instead of showing an error boundary or loading state.",
    error_logs: `Unhandled Runtime Error: Unhandled Promise Rejection: TypeError: Failed to fetch\nat fetchPatientReport (Server Action)\nat ReportPage`,
    broken_code: `export default async function ReportPage() {\n  const res = await fetch('https://api.rh.internal/reports');\n  const data = await res.json();\n\n  return (\n    <div>\n      <h1>Report: {data.title}</h1>\n    </div>\n  );\n}`,
    expected_code: `export default async function ReportPage() {\n  try {\n    const res = await fetch('https://api.rh.internal/reports', { cache: 'no-store' });\n    if (!res.ok) throw new Error('Report fetch failed');\n    const data = await res.json();\n    return (\n      <div>\n        <h1>Report: {data.title}</h1>\n      </div>\n    );\n  } catch (error) {\n    return (\n      <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded">\n        <p>⚠️ Unable to load patient report. Please try again.</p>\n      </div>\n    );\n  }\n}`
  }
];

const seedLessons: Lesson[] = [
  {
    id: "l1",
    title: "React State Master",
    content: "Review 5 core rules about useState, functional updates, and re-renders.",
    difficulty: "intermediate",
    xp_reward: 50,
  }
];

const seedChallenges: CodeChallenge[] = [
  {
    id: "c1",
    title: "Find the Infinite Loop",
    code_snippet: `function Counter() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    setInterval(() => setCount(count + 1), 1000);\n  }, []);\n  return <Text>{count}</Text>;\n}`,
    options: [
      "setInterval is missing import",
      "Stale closure: count remains 0 inside the interval",
      "useEffect needs count in its dependency array"
    ],
    correct_option_index: 1,
    explanation: "The interval closes over the initial count state (0). Using a functional state updater setCount(prev => prev + 1) fixes this.",
    xp_reward: 100,
  }
];

// In-memory cache for fallback mode
let memoryCases: BugCase[] = [...seedBugCases];
const memorySubmissions: CaseSubmission[] = [];
const memoryFeedback: AiFeedback[] = [];
const memoryXpEvents: XPEvent[] = [];

const CASES_STORAGE_KEY = "rh_custom_bug_cases";

function getStoredCases(): BugCase[] {
  if (typeof window === "undefined") return memoryCases;
  try {
    const raw = localStorage.getItem(CASES_STORAGE_KEY);
    if (!raw) return memoryCases;
    const parsed: BugCase[] = JSON.parse(raw);
    const map = new Map<string, BugCase>();
    seedBugCases.forEach((c) => map.set(c.id, c));
    parsed.forEach((c) => map.set(c.id, c));
    return Array.from(map.values());
  } catch {
    return memoryCases;
  }
}

function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  return typeof window !== "undefined"
    ? getSupabaseBrowserClient()
    : getSupabaseServerClient();
}

export const dataService = {
  async getBugCases(): Promise<BugCase[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from("bug_cases").select("*");
        if (!error && data && data.length > 0) {
          // Merge remote with seeds if needed
          const map = new Map<string, BugCase>();
          seedBugCases.forEach((c) => map.set(c.id, c));
          data.forEach((c: BugCase) => map.set(c.id, c));
          return Array.from(map.values());
        }
      } catch (err) {
        console.warn("[DataService] Failed to fetch bug_cases from Supabase, falling back to local:", err);
      }
    }
    return getStoredCases();
  },

  async getBugCaseById(id: string): Promise<BugCase | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from("bug_cases").select("*").eq("id", id).single();
        if (!error && data) return data as BugCase;
      } catch (err) {
        console.warn(`[DataService] Failed to fetch bug_case ${id} from Supabase:`, err);
      }
    }
    const cases = getStoredCases();
    return cases.find((c) => c.id === id) ?? null;
  },

  async createBugCase(bugCase: Omit<BugCase, 'id'>): Promise<BugCase> {
    const current = getStoredCases();
    const newId = `c${Date.now()}`;
    const newCase: BugCase = { 
      ...bugCase, 
      id: newId,
      created_at: new Date().toISOString()
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from("bug_cases").insert(newCase);
      } catch (err) {
        console.error("[DataService] Failed to insert bug_case to Supabase:", err);
      }
    }

    current.push(newCase);
    memoryCases = current;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(current));
      } catch (err) {
        console.error("Failed to save case to localStorage:", err);
      }
    }
    return newCase;
  },

  async submitSolution(submission: Omit<CaseSubmission, 'id' | 'created_at'>): Promise<CaseSubmission> {
    const newSubmission: CaseSubmission = {
      ...submission,
      id: `sub_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase && submission.user_id && submission.user_id !== 'test-user' && !submission.user_id.startsWith('local-')) {
      try {
        await supabase.from("case_submissions").insert(newSubmission);
      } catch (err) {
        console.warn("[DataService] Failed to insert submission to Supabase:", err);
      }
    }

    memorySubmissions.push(newSubmission);
    return newSubmission;
  },

  async saveAiFeedback(feedback: Omit<AiFeedback, 'id' | 'created_at'>): Promise<AiFeedback> {
    const newFeedback: AiFeedback = {
      ...feedback,
      id: `fb_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from("ai_feedback").insert(newFeedback);
      } catch (err) {
        console.warn("[DataService] Failed to insert ai_feedback to Supabase:", err);
      }
    }

    memoryFeedback.push(newFeedback);
    return newFeedback;
  },

  async updateSkillMemory(userId: string, concepts: string[], score: number): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && userId && userId !== 'test-user' && !userId.startsWith('local-')) {
      try {
        for (const concept of concepts) {
          const { data: existing } = await supabase
            .from("skill_memory")
            .select("*")
            .eq("user_id", userId)
            .eq("concept_name", concept)
            .single();

          const now = new Date().toISOString();
          const isPass = score >= 70;

          if (existing) {
            const newAttempts = existing.attempts + 1;
            const newFailures = existing.failures + (isPass ? 0 : 1);
            const failRate = newFailures / newAttempts;
            const newStatus = failRate > 0.6 ? 'weak' : failRate > 0.3 ? 'improving' : 'strong';
            const newMastery = Math.min(100, Math.max(0, isPass ? existing.mastery_score + 15 : existing.mastery_score - 10));

            await supabase
              .from("skill_memory")
              .update({
                attempts: newAttempts,
                failures: newFailures,
                status: newStatus,
                mastery_score: newMastery,
                last_tested_at: now,
              })
              .eq("id", existing.id);
          } else {
            await supabase.from("skill_memory").insert({
              id: `sm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              user_id: userId,
              concept_name: concept,
              mastery_score: isPass ? 60 : 30,
              attempts: 1,
              failures: isPass ? 0 : 1,
              last_tested_at: now,
              status: isPass ? 'improving' : 'weak',
            });
          }
        }
      } catch (err) {
        console.warn("[DataService] Failed to update skill_memory in Supabase:", err);
      }
    }
  },

  async getSkillMemory(userId: string): Promise<SkillMemory[]> {
    const supabase = getSupabaseClient();
    if (supabase && userId && userId !== 'test-user' && !userId.startsWith('local-')) {
      try {
        const { data } = await supabase.from("skill_memory").select("*").eq("user_id", userId);
        if (data) return data as SkillMemory[];
      } catch (err) {
        console.warn("[DataService] Failed to fetch skill_memory from Supabase:", err);
      }
    }
    return [];
  },

  async getStudentProgress(userId: string): Promise<StudentProgress> {
    const supabase = getSupabaseClient();
    if (supabase && userId && userId !== 'test-user' && !userId.startsWith('local-')) {
      try {
        const { data } = await supabase.from("student_progress").select("*").eq("user_id", userId).single();
        if (data) return data as StudentProgress;
      } catch (err) {
        console.warn("[DataService] Failed to fetch student_progress from Supabase:", err);
      }
    }
    return {
      user_id: userId,
      completed_cases: [],
      unlocked_modules: ["m1", "m2"],
      last_activity_at: new Date().toISOString(),
    };
  },

  async updateStudentProgress(userId: string, caseId: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && userId && userId !== 'test-user' && !userId.startsWith('local-')) {
      try {
        const { data: existing } = await supabase.from("student_progress").select("*").eq("user_id", userId).single();
        const completed: string[] = existing?.completed_cases || [];
        if (!completed.includes(caseId)) {
          completed.push(caseId);
          await supabase.from("student_progress").upsert({
            user_id: userId,
            completed_cases: completed,
            unlocked_modules: existing?.unlocked_modules || ["m1", "m2"],
            last_activity_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn("[DataService] Failed to update student_progress in Supabase:", err);
      }
    }
  },

  async getLessons(): Promise<Lesson[]> {
    return seedLessons;
  },

  async getCodeChallenges(): Promise<CodeChallenge[]> {
    return seedChallenges;
  },

  async logXPEvent(user_id: string, amount: number, source: XPEvent['source']): Promise<XPEvent> {
    const event: XPEvent = {
      id: `xp_${Date.now()}`,
      user_id,
      amount,
      source,
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase && user_id && user_id !== 'test-user' && !user_id.startsWith('local-')) {
      try {
        await supabase.from("xp_events").insert(event);
        // Increment profile total_xp
        const { data: profile } = await supabase.from("profiles").select("total_xp").eq("id", user_id).single();
        if (profile) {
          await supabase.from("profiles").update({ total_xp: (profile.total_xp || 0) + amount }).eq("id", user_id);
        }
      } catch (err) {
        console.warn("[DataService] Failed to log XP event in Supabase:", err);
      }
    }

    memoryXpEvents.push(event);
    return event;
  },

  async updateStreak(userId: string): Promise<number> {
    const todayStr = new Date().toISOString().split("T")[0];
    let newStreak = 1;

    const supabase = getSupabaseClient();
    if (supabase && userId && userId !== 'test-user' && !userId.startsWith('local-')) {
      try {
        const { data: streakRec } = await supabase.from("streaks").select("*").eq("user_id", userId).single();
        if (streakRec) {
          const lastDate = streakRec.last_active_date;
          if (lastDate !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];
            newStreak = lastDate === yesterdayStr ? streakRec.current_streak + 1 : 1;
            const longest = Math.max(newStreak, streakRec.longest_streak || 1);

            await supabase.from("streaks").update({
              current_streak: newStreak,
              longest_streak: longest,
              last_active_date: todayStr,
            }).eq("user_id", userId);

            await supabase.from("profiles").update({ current_streak: newStreak }).eq("id", userId);
          } else {
            newStreak = streakRec.current_streak;
          }
        } else {
          await supabase.from("streaks").insert({
            user_id: userId,
            current_streak: 1,
            longest_streak: 1,
            last_active_date: todayStr,
          });
        }
      } catch (err) {
        console.warn("[DataService] Failed to update streak in Supabase:", err);
      }
    }
    return newStreak;
  }
};
