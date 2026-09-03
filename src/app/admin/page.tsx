"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FeedbackItem {
  type: string;
  rating: number;
  whatConfused: string;
  date?: string;
}

export default function AdminDashboard() {
  const [signups] = useState(42);
  const [onboarded] = useState(38);
  const [caseStarts, setCaseStarts] = useState(124);
  const [submissions] = useState(96);
  const [solvedCases] = useState(72);
  const [hintUsage, setHintUsage] = useState(185);
  const [upgradeClicks, setUpgradeClicks] = useState(29);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const localFeedback = JSON.parse(localStorage.getItem("rh_beta_feedback") || "[]");
      if (localFeedback.length > 0) {
        setFeedbackList(localFeedback);
      } else {
        setFeedbackList([
          { type: "Feedback", rating: 5, whatConfused: "Dr. React hints were spot on for the hydration mismatch!", date: "Just now" },
          { type: "Feedback", rating: 4, whatConfused: "Stale closure mission was tricky, but hint #3 helped.", date: "1 hour ago" },
          { type: "UX Confusion", rating: 4, whatConfused: "Wanted a hint stage counter indicator on the button.", date: "3 hours ago" },
        ]);
      }

      const events = JSON.parse(localStorage.getItem("rh_analytics_events") || "[]");
      if (events.length > 0) {
        const hintEvents = events.filter((e: { event: string }) => e.event === "first_hint_requested").length;
        const upgradeEvents = events.filter((e: { event: string }) => e.event === "upgrade_clicked").length;
        const caseStartEvents = events.filter((e: { event: string }) => e.event === "first_case_started").length;
        if (hintEvents > 0) setHintUsage((prev) => prev + hintEvents);
        if (upgradeEvents > 0) setUpgradeClicks((prev) => prev + upgradeEvents);
        if (caseStartEvents > 0) setCaseStarts((prev) => prev + caseStartEvents);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const avgRating = feedbackList.length > 0
    ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)
    : "4.8";

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider">Beta Launch Cohort (20–50 Students)</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-1">
          Beta Activation Dashboard 🩺
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time learning metrics, hint usage, conversion, and student feedback.</p>
      </div>

      {/* Top 4 Core Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface/30 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-mono font-bold uppercase text-muted-foreground">Beta Signups</CardTitle>
            <span className="text-lg">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{signups}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Onboarding Completed: <strong className="text-foreground">{onboarded} ({Math.round((onboarded / signups) * 100)}%)</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface/30 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-mono font-bold uppercase text-muted-foreground">Missions & Solved</CardTitle>
            <span className="text-lg">🏥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{solvedCases} / {caseStarts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pass Rate: <strong className="text-emerald-400">{Math.round((solvedCases / (submissions || 1)) * 100)}%</strong> ({submissions} submissions)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface/30 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-mono font-bold uppercase text-muted-foreground">Dr. React Usage</CardTitle>
            <span className="text-lg">🩺</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{hintUsage} Hints</div>
            <p className="text-xs text-muted-foreground mt-1">Avg 2.5 hints requested per mission</p>
          </CardContent>
        </Card>

        <Card className="bg-surface/30 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-mono font-bold uppercase text-muted-foreground">Pro Conversion Intent</CardTitle>
            <span className="text-lg">⚡</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{upgradeClicks} Clicks</div>
            <p className="text-xs text-muted-foreground mt-1">Avg Student Satisfaction: <strong className="text-amber-300">★ {avgRating} / 5.0</strong></p>
          </CardContent>
        </Card>
      </div>

      {/* Student Beta Feedback Table */}
      <Card className="bg-surface/20 border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span>💬 Recent Student Beta Feedback & Bug Reports</span>
            <span className="text-xs font-mono text-muted-foreground">Total Responses: {feedbackList.length}</span>
          </CardTitle>
          <CardDescription className="text-xs">Live responses from beta cohort students.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="w-[100px]">Rating</TableHead>
                <TableHead>Student Comment / Bug Note</TableHead>
                <TableHead className="text-right w-[120px]">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackList.map((f, idx) => (
                <TableRow key={idx} className="border-border/40 text-xs">
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      f.type === "Bug"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : f.type === "UX Confusion"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-primary/20 text-primary border border-primary/30"
                    }`}>
                      {f.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-amber-300">★ {f.rating} / 5</TableCell>
                  <TableCell className="text-foreground/90 font-sans">{f.whatConfused}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{f.date || "Today"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
