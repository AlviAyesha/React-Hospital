"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSolvedCases, getSkillMemory } from "@/lib/skillMemory";
import { dataService } from "@/lib/data";
import { BugCase } from "@/lib/types";
import { useAuth } from "@/lib/authContext";
import { canAccessCase } from "@/lib/accessControl";

const emergencyBadge = (diff: string) => {
  if (diff === "Easy") return { label: "Code Green (Easy)", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
  if (diff === "Medium") return { label: "Code Yellow (Medium)", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
  return { label: "Code Red (Hard)", color: "bg-red-500/10 text-red-400 border-red-500/30" };
};

export default function Dashboard() {
  const { user } = useAuth();
  const [userName, setUserName] = useState("Dev");
  const [solvedCases, setSolvedCases] = useState<string[]>([]);
  const [streakDays, setStreakDays] = useState(1);
  const [totalXp, setTotalXp] = useState(0);
  const [bugCases, setBugCases] = useState<BugCase[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [weakConcept, setWeakConcept] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUserName(user?.display_name || localStorage.getItem("rh_user_name") || "Dev");
      const solved = getSolvedCases();
      setSolvedCases(solved);
      setTotalXp(user?.total_xp ?? (parseInt(localStorage.getItem("rh_xp") ?? "0") || 0));

      const memory = getSkillMemory();
      const weak = memory.find((m) => m.status === "weak");
      if (weak) {
        setWeakConcept(weak.concept);
      }

      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem("rh_last_visit");
      const streak = user?.current_streak ?? (parseInt(localStorage.getItem("rh_streak") ?? "1") || 1);

      if (lastVisit !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const newStreak = lastVisit === yesterday.toDateString() ? streak + 1 : 1;
        localStorage.setItem("rh_streak", String(newStreak));
        localStorage.setItem("rh_last_visit", today);
        setStreakDays(newStreak);
      } else {
        setStreakDays(streak || 1);
      }
    }, 0);

    dataService.getBugCases().then((cases) => {
      setBugCases(cases);
      setLoadingCases(false);
    });

    return () => clearTimeout(timer);
  }, [user]);

  const freeCases = bugCases.filter((c) => c.access_level !== "pro");
  const proCases = bugCases.filter((c) => c.access_level === "pro");

  return (
    <div className="space-y-8">
      {/* Hospital Narrative Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-surface/60 via-surface/40 to-background border border-primary/20 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>React Hospital Emergency Ward — Shift Active</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome On Duty, <span className="text-primary">Dr. {userName}</span> 🩺
            </h1>
            <p className="text-sm text-muted-foreground">
              {streakDays > 1
                ? `🔥 ${streakDays}-Day Patient Survival Streak active. Don't let code crash!`
                : "Your medical shift has started. Attend to incoming broken app cases."}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-background/60 p-3 rounded-xl border border-border/40 shrink-0">
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-mono text-muted-foreground">Medical XP</div>
              <div className="text-xl font-mono font-bold text-primary">+{totalXp}</div>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-mono text-muted-foreground">Cases Solved</div>
              <div className="text-xl font-mono font-bold text-emerald-400">{solvedCases.length}/{bugCases.length}</div>
            </div>
          </div>
        </div>

        {/* Weak Concept Diagnostic Alert */}
        {weakConcept && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>🎯 <strong>Weak Concept Alert:</strong> Recent diagnostic data shows struggles with <code className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200">{weakConcept}</code>.</span>
            </span>
            <Link href="/dashboard/memory" className="font-semibold underline hover:text-amber-100 shrink-0 ml-2">
              Review Diagnosis →
            </Link>
          </div>
        )}
      </div>

      {/* Upgrade Banner for Free Users */}
      {user?.plan !== "pro" && user?.role !== "admin" && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-surface/40 to-surface/20 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-semibold text-foreground flex items-center justify-center sm:justify-start gap-2">
              <span>⭐ Upgrade to Pro Survivor Ward</span>
              <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                $19/mo
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Unlock Code Red hard missions, unlimited Dr. React mentor guidance, and deep skill memory analytics.
            </p>
          </div>
          <Link href="/pricing">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shrink-0">
              Upgrade Ward →
            </Button>
          </Link>
        </div>
      )}

      {/* Mission Hub Sections */}
      <div className="space-y-8">
        {/* Section 1: Level 1 Emergency Cases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h2 className="text-base font-semibold text-primary/90 uppercase tracking-wider font-mono flex items-center gap-2">
              <span>🩺 Ward 1: Fundamentals & Hydration Emergencies</span>
            </h2>
            <span className="text-xs text-muted-foreground font-mono">General Admission (Free)</span>
          </div>

          {loadingCases ? (
            <div className="text-sm text-muted-foreground py-6 text-center animate-pulse">
              Scanning hospital ward for incoming patient cases...
            </div>
          ) : freeCases.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border/50 rounded-xl text-muted-foreground text-sm space-y-2">
              <p>🏥 No active cases in Ward 1.</p>
              <p className="text-xs text-muted-foreground">All patients in this section have been successfully stabilized.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {freeCases.map((bug) => {
                const isSolved = solvedCases.includes(bug.id);
                const badge = emergencyBadge(bug.difficulty);

                return (
                  <Card
                    key={bug.id}
                    className="border-border/40 bg-surface/20 hover:bg-surface/40 hover:border-primary/30 transition-all duration-200 flex flex-col justify-between"
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-md shrink-0">
                          +{bug.xp_reward} XP
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold leading-snug">{bug.title}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          <strong>Symptoms:</strong> &quot;{bug.user_complaint}&quot;
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center pt-2 border-t border-border/30">
                      <span className="text-xs font-mono text-muted-foreground">
                        Treatment: <span className="text-foreground">{bug.description}</span>
                      </span>
                      {isSolved ? (
                        <Link href={`/hospital/case/id?caseId=${bug.id}`}>
                          <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                            ✓ Stabilized — Re-evaluate
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/hospital/case/id?caseId=${bug.id}`}>
                          <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-[0_0_8px_rgba(59,130,246,0.15)] font-semibold">
                            Start Treatment →
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Level 2 Pro ICU Cases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h2 className="text-base font-semibold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <span>⚡ Ward 2: Advanced State & Closure ICU</span>
            </h2>
            <span className="text-xs font-bold font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20 uppercase">
              PRO ICU Ward
            </span>
          </div>

          {loadingCases ? (
            <div className="text-sm text-muted-foreground py-6 text-center animate-pulse">
              Checking ICU patient monitoring data...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {proCases.map((bug) => {
                const canAccess = canAccessCase(user, bug);
                const isSolved = solvedCases.includes(bug.id);
                const badge = emergencyBadge(bug.difficulty);

                return (
                  <Card
                    key={bug.id}
                    className={`border-border/40 transition-all duration-200 flex flex-col justify-between ${
                      canAccess
                        ? "bg-surface/20 hover:bg-surface/40 hover:border-primary/30"
                        : "bg-surface/10 opacity-90 border-amber-500/20"
                    }`}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${badge.color}`}>
                            {badge.label}
                          </span>
                          {!canAccess && (
                            <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                              🔒 PRO ICU
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-md shrink-0">
                          +{bug.xp_reward} XP
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold leading-snug">{bug.title}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          <strong>Symptoms:</strong> &quot;{bug.user_complaint}&quot;
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center pt-2 border-t border-border/30">
                      <span className="text-xs font-mono text-muted-foreground">
                        Treatment: <span className="text-foreground">{bug.description}</span>
                      </span>

                      {!canAccess ? (
                        <Link href="/pricing">
                          <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 font-medium">
                            Unlock PRO ICU →
                          </Button>
                        </Link>
                      ) : isSolved ? (
                        <Link href={`/hospital/case/id?caseId=${bug.id}`}>
                          <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                            ✓ Stabilized — Re-evaluate
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/hospital/case/id?caseId=${bug.id}`}>
                          <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-[0_0_8px_rgba(59,130,246,0.15)] font-semibold">
                            Start Treatment →
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
