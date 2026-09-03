"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function CaseEditor({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const [caseId, setCaseId] = useState<string>("");
  const [bugCase, setBugCase] = useState<BugCase | null>(null);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    params.then(({ id }) => setCaseId(id));
  }, [params]);

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
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-center">
        <p className="text-muted-foreground text-lg">Patient file not found.</p>
        <Link href="/dashboard"><Button variant="outline">Return to Ward</Button></Link>
      </div>
    );
  }

  if (!bugCase) {
    return (
      <div className="p-10 text-center text-muted-foreground font-mono text-sm animate-pulse">
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
              <span className="font-semibold text-foreground">{bugCase.title}</span> requires a Pro Survivor subscription to access.
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

  const difficultyColor =
    bugCase.difficulty === "Easy"
      ? "text-green-400 border-green-400/30 bg-green-400/10"
      : bugCase.difficulty === "Medium"
      ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
      : "text-red-400 border-red-400/30 bg-red-400/10";

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border/40 flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
            ← Emergency Ward
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-semibold text-sm">{bugCase.title}</h1>
          <span className={`text-xs px-2 py-0.5 rounded border font-mono ${difficultyColor}`}>
            {bugCase.difficulty}
          </span>
          {bugCase.access_level === "pro" && (
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              PRO ICU
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Reward: <span className="text-primary font-bold">+{bugCase.xp_reward} XP</span>
          </span>
          <Button
            size="sm"
            onClick={handleFixSubmit}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          >
            {isSubmitting ? "Running Diagnosis..." : "Administer Treatment"}
          </Button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/3 border-r border-border/40 flex flex-col min-h-0">
          <Tabs defaultValue="briefing" className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-2 border-b border-border/40 bg-surface/30 shrink-0">
              <TabsList className="bg-transparent h-10 w-full justify-start gap-4">
                <TabsTrigger
                  value="briefing"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 font-mono text-xs"
                >
                  📋 Patient Chart
                </TabsTrigger>
                <TabsTrigger
                  value="tutor"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 flex items-center gap-1.5 font-mono text-xs"
                >
                  <span>🩺 Dr. React</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ({messages.length}/{user?.plan === "pro" || user?.role === "admin" ? "∞" : FREE_AI_TUTOR_LIMIT})
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="briefing" className="flex-1 overflow-y-auto p-6 m-0 border-none space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  🤒 Patient Symptoms
                </h3>
                <p className="text-sm leading-relaxed bg-background/50 p-3 rounded-lg border border-border/30 italic">
                  &quot;{bugCase.user_complaint}&quot;
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-2">
                  ⚡ Vital Signs (Terminal Error Logs)
                </h3>
                <pre className="text-xs bg-red-950/20 border border-red-500/20 text-red-300 p-4 rounded-md whitespace-pre-wrap font-mono leading-relaxed">
                  {bugCase.error_logs}
                </pre>
              </div>
              {bugCase.description && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    🎯 Treatment Objective
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{bugCase.description}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tutor" className="flex-1 flex flex-col min-h-0 m-0 border-none">
              <div className="px-4 py-2 bg-surface/40 border-b border-border/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🩺</span>
                  <span className="text-xs font-bold font-mono text-foreground">Dr. React</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  On Duty
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center mt-10 text-sm text-muted-foreground space-y-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-lg">👨‍⚕️</span>
                    </div>
                    <p className="font-medium text-foreground">Dr. React is on duty.</p>
                    <p className="text-xs">Ask a question or click a diagnostic action below.</p>
                  </div>
                )}
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-lg p-3 text-xs ${
                        m.role === "user"
                          ? "bg-surface border border-border"
                          : "bg-primary/10 border border-primary/20 text-foreground"
                      }`}
                    >
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
                ))}
              </div>

              {/* Quick Action Chips */}
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
              </div>

              {!canChat && (
                <div className="p-3 bg-amber-500/10 border-t border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                  <span>⚠️ Free AI mentor limit reached ({FREE_AI_TUTOR_LIMIT}/{FREE_AI_TUTOR_LIMIT}).</span>
                  <Link href="/pricing" className="font-semibold underline hover:text-amber-200">
                    Upgrade to Pro →
                  </Link>
                </div>
              )}

              <div className="p-4 border-t border-border/40 bg-surface/30 shrink-0">
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={!canChat}
                    placeholder={canChat ? "Ask Dr. React..." : "AI limit reached. Upgrade to Pro."}
                    className="flex-1 bg-background border border-border/50 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                  />
                  <Button type="submit" size="sm" variant="secondary" disabled={isLoading || !chatInput.trim() || !canChat}>
                    Consult
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="w-2/3 flex flex-col min-h-0">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-2 border-b border-border/40 bg-surface/30 shrink-0">
              <TabsList className="bg-transparent h-10 w-full justify-start gap-4">
                <TabsTrigger
                  value="editor"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 font-mono text-xs"
                >
                  {bugCase.title.toLowerCase().replace(/\s+/g, "-")}.tsx
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0"
                >
                  Preview Output
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="editor" className="flex-1 p-0 m-0 border-none min-h-0">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "var(--font-geist-mono), monospace",
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  renderLineHighlight: "line",
                }}
              />
            </TabsContent>

            <TabsContent value="preview" className="flex-1 p-8 m-0 border-none flex items-center justify-center bg-zinc-950">
              <div className="text-center text-muted-foreground border border-dashed border-border/50 p-8 rounded-xl bg-surface/30">
                <p className="font-medium">Preview Environment</p>
                <p className="text-xs mt-2">Live code execution simulator.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && feedback && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-lg border-border shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  feedback.score >= 70
                    ? "bg-green-500/10 border-2 border-green-500/30"
                    : "bg-yellow-500/10 border-2 border-yellow-500/30"
                }`}
              >
                <span className={`text-3xl font-bold ${feedback.score >= 70 ? "text-green-400" : "text-yellow-400"}`}>
                  {feedback.score}
                </span>
              </div>
              <CardTitle className="text-2xl">
                {feedback.score >= 70 ? "🎉 Patient Stabilized!" : "⚠️ Patient Condition Critical"}
              </CardTitle>
              <CardDescription>
                Concept Mastered:{" "}
                <span className="text-primary font-bold">{feedback.fixed_concept}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-background/50 p-4 rounded-lg border border-border/50">
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Feedback</h4>
                <p className="text-sm leading-relaxed">{feedback.what_is_wrong}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border border-border/50">
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Dr. React Mentorship Note</h4>
                <p className="text-sm leading-relaxed">{feedback.hint}</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="text-xs font-bold uppercase text-primary mb-1">Next Treatment Step</h4>
                <p className="text-sm leading-relaxed">{feedback.next_practice_task}</p>
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowFeedbackModal(false)}>
                Review Code
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground"
                onClick={() => router.push("/dashboard")}
              >
                Return to Ward →
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
