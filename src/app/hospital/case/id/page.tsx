"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Editor } from "@monaco-editor/react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dataService } from "@/lib/data";
import { BugCase, AiFeedback } from "@/lib/types";
import { updateSkillMemory, addXp, markCaseSolved } from "@/lib/skillMemory";
import { useAuth } from "@/lib/authContext";
import { canAccessCase, canUseAITutor, FREE_AI_TUTOR_LIMIT } from "@/lib/accessControl";

function CaseEditorContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId") || "c1";
  const { user } = useAuth();

  const [bugCase, setBugCase] = useState<BugCase | null>(null);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [notFound, setNotFound] = useState(false);

  const mentorLanguage = user?.mentor_language || (typeof window !== "undefined" ? (localStorage.getItem("rh_language") ?? "english") : "english");
  const mentorStyle = user?.mentor_style || "friendly";

  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
      body: {
        context: {
          skillLevel: user?.skill_level || "intermediate",
          language: mentorLanguage,
          mentorStyle,
          bugDescription: bugCase?.user_complaint,
          currentCode: code,
          title: bugCase?.title,
          difficulty: bugCase?.difficulty,
          errorLogs: bugCase?.error_logs,
          brokenCode: bugCase?.broken_code,
        },
      },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const canChat = canUseAITutor(user, messages.length);

  useEffect(() => {
    if (!caseId) return;
    dataService.getBugCaseById(caseId).then((data) => {
      if (data) {
        setBugCase(data);
        setCode(data.broken_code);
      } else {
        setNotFound(true);
      }
    });
  }, [caseId]);

  const handleFixSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, submittedCode: code, userId: user?.id || "test-user" }),
      });
      const data = await res.json();
      if (data.feedback) {
        setFeedback(data.feedback);
        setShowFeedbackModal(true);
        if (data.evaluation?.weaknesses_detected?.length) {
          updateSkillMemory(data.evaluation.weaknesses_detected, data.evaluation.is_passed);
        }
        if (data.evaluation?.is_passed && bugCase) {
          addXp(bugCase.xp_reward);
          markCaseSolved(caseId);
        }
      }
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading || !canChat) return;
    sendMessage({ text: chatInput });
    setChatInput("");
  };

  const handleQuickChip = (chipPrompt: string) => {
    if (isLoading || !canChat) return;
    sendMessage({ text: chipPrompt });
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-3xl font-bold text-red-400 mb-2">Patient File Not Found</h1>
        <p className="text-muted-foreground mb-6">The requested patient mission does not exist in the hospital database.</p>
        <Link href="/dashboard">
          <Button className="bg-primary hover:bg-primary/90">Return to Ward</Button>
        </Link>
      </div>
    );
  }

  if (!bugCase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground font-mono text-sm animate-pulse">
        🩺 Preparing patient file & loading code simulator...
      </div>
    );
  }

  const isCaseAccessible = canAccessCase(user, bugCase);

  if (!isCaseAccessible) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <Card className="max-w-md border-amber-500/30 bg-surface/30 backdrop-blur-md p-6 space-y-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto border border-amber-500/30">
            🔒
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">PRO ICU Case Locked</h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{bugCase.title}</span> is an advanced Code Red emergency case reserved for Pro Survivor Subscribers.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link href="/pricing">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Upgrade to Pro ($19/mo) →
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-border/50">
                Back to Emergency Ward
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Header Navigation — Patient Profile Header */}
      <header className="h-14 border-b border-border/40 bg-surface/30 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs">
              ← Emergency Ward
            </Button>
          </Link>
          <span className="text-border">|</span>
          <div className="flex items-center gap-2">
            <span className="text-base">🏥</span>
            <span className="font-mono font-bold text-sm text-foreground">{bugCase.title}</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20">
              {bugCase.difficulty} (+{bugCase.xp_reward} XP)
            </span>
            {bugCase.access_level === "pro" && (
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                PRO ICU
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleFixSubmit}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          >
            {isSubmitting ? "Running Diagnosis..." : "Administer Treatment →"}
          </Button>
        </div>
      </header>

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Panel: Patient Briefing & Dr. React AI Mentor (5 Cols) */}
        <div className="lg:col-span-5 border-r border-border/40 flex flex-col h-full overflow-hidden bg-surface/10">
          <Tabs defaultValue="briefing" className="flex-1 flex flex-col h-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border/40 bg-surface/20 p-0 h-10">
              <TabsTrigger value="briefing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-surface font-mono text-xs">
                📋 Patient Chart
              </TabsTrigger>
              <TabsTrigger value="tutor" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-surface font-mono text-xs flex items-center gap-1.5">
                <span>🩺 Dr. React</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  ({messages.length}/{user?.plan === "pro" || user?.role === "admin" ? "∞" : FREE_AI_TUTOR_LIMIT})
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Patient Chart Briefing Tab Content */}
            <TabsContent value="briefing" className="flex-1 p-4 overflow-y-auto space-y-4 m-0">
              <Card className="bg-surface/30 border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <span>🤒 Patient Symptoms (User Complaint)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/90 leading-relaxed font-sans italic bg-background/50 p-3 rounded-lg border border-border/30">
                    &quot;{bugCase.user_complaint}&quot;
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-surface/30 border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <span>⚡ Vital Signs (Terminal Logs)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="p-3 bg-black/70 rounded-md text-xs font-mono text-red-400 overflow-x-auto border border-red-500/20 whitespace-pre-wrap leading-relaxed">
                    {bugCase.error_logs}
                  </pre>
                </CardContent>
              </Card>

              <Card className="bg-surface/30 border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    🎯 Treatment Objective
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {bugCase.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dr. React AI Mentor Tab */}
            <TabsContent value="tutor" className="flex-1 flex flex-col h-full m-0 p-0 overflow-hidden">
              {/* Doctor Character Persona Badge */}
              <div className="px-4 py-2 bg-surface/40 border-b border-border/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-sm">
                    🩺
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-foreground">Dr. React</div>
                    <div className="text-[10px] text-muted-foreground">Senior Debugging Mentor</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Active On Duty
                </span>
              </div>

              {/* Chat Message Scroll Window */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-2xl">
                      👨‍⚕️
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Dr. React is examining the patient code.</p>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Click a quick diagnostic action below or ask any question for guided hints!
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-sm max-w-[90%] ${
                        m.role === "user"
                          ? "bg-primary/20 text-foreground ml-auto border border-primary/30"
                          : "bg-surface border border-border/40 text-foreground"
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1 flex items-center justify-between">
                        <span>{m.role === "user" ? "You (Dr. " + (user?.display_name || "Dev") + ")" : "Dr. React"}</span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed text-xs">
                        {(() => {
                          const contentStr = (m as unknown as { content?: string }).content;
                          return typeof contentStr === "string" && contentStr.trim().length > 0
                            ? contentStr
                            : Array.isArray(m.parts)
                            ? m.parts
                                .map((p) => (typeof p === "string" ? p : p && typeof p === "object" && "text" in p ? (p as { text: string }).text : ""))
                                .join("")
                            : "";
                        })()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Diagnostic Action Chips */}
              <div className="px-3 py-2 border-t border-border/30 bg-surface/10 flex flex-wrap gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={!canChat || isLoading}
                  onClick={() => handleQuickChip("💡 Give me a small hint for this issue.")}
                  className="text-[11px] bg-surface hover:bg-surface/80 border border-border/50 text-foreground px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
                >
                  💡 Small Hint
                </button>
                <button
                  type="button"
                  disabled={!canChat || isLoading}
                  onClick={() => handleQuickChip("🔍 Explain what this terminal error log means.")}
                  className="text-[11px] bg-surface hover:bg-surface/80 border border-border/50 text-foreground px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
                >
                  🔍 Explain Error
                </button>
                <button
                  type="button"
                  disabled={!canChat || isLoading}
                  onClick={() => handleQuickChip("🎯 What code block should I check first?")}
                  className="text-[11px] bg-surface hover:bg-surface/80 border border-border/50 text-foreground px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
                >
                  🎯 What to Check
                </button>
                <button
                  type="button"
                  disabled={!canChat || isLoading}
                  onClick={() => handleQuickChip("🆘 I'm stuck. Point to the line clue.")}
                  className="text-[11px] bg-surface hover:bg-surface/80 border border-border/50 text-foreground px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
                >
                  🆘 Line Clue
                </button>
              </div>

              {/* Limit Warning */}
              {!canChat && (
                <div className="p-2.5 bg-amber-500/10 border-t border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                  <span>⚠️ Free AI mentor limit reached ({FREE_AI_TUTOR_LIMIT}/{FREE_AI_TUTOR_LIMIT}).</span>
                  <Link href="/pricing" className="font-semibold underline hover:text-amber-200">
                    Upgrade to Pro →
                  </Link>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleChatSubmit} className="p-3 border-t border-border/40 bg-surface/20 flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder={canChat ? "Ask Dr. React for guidance..." : "Free AI limit reached. Upgrade to Pro."}
                  value={chatInput}
                  disabled={!canChat}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-background border border-border/50 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50 disabled:opacity-50"
                />
                <Button type="submit" disabled={isLoading || !chatInput.trim() || !canChat} size="sm" className="bg-primary hover:bg-primary/90 text-xs h-8">
                  Consult
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel: Monaco Editor & Output (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
          <div className="h-10 bg-[#252526] border-b border-[#333] px-4 flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400">Page.tsx — Medical Code Simulator</span>
            <span className="text-[10px] text-zinc-500 font-mono">React 19 / Next.js App Router</span>
          </div>

          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value ?? "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>
        </div>
      </div>

      {/* Post-submission Feedback Dialog Modal */}
      {showFeedbackModal && feedback && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg border-primary/30 bg-background shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <span>{feedback.score >= 70 ? "🎉 Patient Stabilized!" : "⚠️ Patient Condition Critical"}</span>
                <span className="font-mono text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Diagnosis Score: {feedback.score}/100
                </span>
              </CardTitle>
              <CardDescription>Dr. React Post-Treatment Diagnostic Result</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase text-red-400">What Caused the Relapse</div>
                <p className="text-sm text-foreground/90 bg-red-500/10 p-2.5 rounded border border-red-500/20">
                  {feedback.what_is_wrong}
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase text-green-400">Correct Treatment Pattern</div>
                <p className="text-sm text-foreground/90 bg-green-500/10 p-2.5 rounded border border-green-500/20">
                  {feedback.what_is_correct}
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase text-primary">Dr. React Mentorship Note</div>
                <p className="text-sm text-muted-foreground bg-surface p-2.5 rounded border border-border/40">
                  {feedback.hint}
                </p>
              </div>
            </CardContent>
            <div className="p-4 border-t border-border/40 flex justify-between items-center bg-surface/20">
              <Link href="/dashboard">
                <Button variant="outline">Return to Ward</Button>
              </Link>
              <Button onClick={() => setShowFeedbackModal(false)} className="bg-primary hover:bg-primary/90">
                Continue Treatment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function HospitalCasePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-sm">🩺 Loading patient chart...</div>}>
      <CaseEditorContent />
    </Suspense>
  );
}
