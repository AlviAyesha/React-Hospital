// Client-side skill memory store — persists to localStorage until Supabase is wired

export interface ConceptRecord {
  concept: string;
  attempts: number;
  failures: number;
  lastSeen: string;
  status: "weak" | "improving" | "strong";
}

const KEY = "rh_skill_memory";

export const CORE_REACT_CONCEPTS = [
  "hydration",
  "useEffect",
  "props/state",
  "server/client components",
  "forms",
  "API routes",
  "auth",
  "database",
  "performance",
  "SEO"
];

export function getSkillMemory(): ConceptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function updateSkillMemory(weaknesses: string[], passed: boolean): void {
  if (typeof window === "undefined") return;
  const memory = getSkillMemory();
  const now = new Date().toISOString();

  weaknesses.forEach((concept) => {
    const existing = memory.find((c) => c.concept.toLowerCase() === concept.toLowerCase());
    if (existing) {
      existing.attempts += 1;
      if (!passed) existing.failures += 1;
      existing.lastSeen = now;
      const failRate = existing.failures / existing.attempts;
      existing.status = failRate > 0.6 ? "weak" : failRate > 0.3 ? "improving" : "strong";
    } else {
      memory.push({
        concept,
        attempts: 1,
        failures: passed ? 0 : 1,
        lastSeen: now,
        status: passed ? "improving" : "weak",
      });
    }
  });

  localStorage.setItem(KEY, JSON.stringify(memory));
}

export function addXp(amount: number): number {
  if (typeof window === "undefined") return 0;
  const current = parseInt(localStorage.getItem("rh_xp") ?? "0") || 0;
  const newXp = current + amount;
  localStorage.setItem("rh_xp", String(newXp));
  return newXp;
}

export function markCaseSolved(caseId: string): void {
  if (typeof window === "undefined") return;
  const solved: string[] = JSON.parse(localStorage.getItem("rh_solved") ?? "[]");
  if (!solved.includes(caseId)) {
    solved.push(caseId);
    localStorage.setItem("rh_solved", JSON.stringify(solved));
  }
}

export function getSolvedCases(): string[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("rh_solved") ?? "[]");
}
