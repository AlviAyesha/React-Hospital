"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/authContext";

export function BetaFeedbackModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"Feedback" | "Bug" | "UX Confusion" | "AI Issue">("Feedback");
  const [rating, setRating] = useState(5);
  const [whatConfused, setWhatConfused] = useState("");
  const [drReactHelpful, setDrReactHelpful] = useState("Yes");
  const [wouldPayPro, setWouldPayPro] = useState("Maybe");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          rating,
          whatConfused,
          drReactHelpful,
          wouldPayPro,
          userEmail: user?.email || "",
          userId: user?.id || "",
        }),
      });

      // Save locally as fallback
      const localFeedback = JSON.parse(localStorage.getItem("rh_beta_feedback") || "[]");
      localFeedback.push({ type, rating, whatConfused, date: new Date().toISOString() });
      localStorage.setItem("rh_beta_feedback", JSON.stringify(localFeedback));

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setWhatConfused("");
      }, 1500);
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xl rounded-full px-4 py-2 flex items-center gap-2 border border-primary/30"
        >
          <span>💬 Beta Feedback</span>
        </Button>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-background border-primary/30 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>🩺 React Hospital Beta Survey</span>
                </CardTitle>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-mono px-2"
                >
                  ✕
                </button>
              </div>
              <CardDescription className="text-xs">
                Help us polish Dr. React & mission features during our 50-student Beta test.
              </CardDescription>
            </CardHeader>

            {submitted ? (
              <CardContent className="py-8 text-center space-y-2">
                <div className="text-3xl">🎉</div>
                <h3 className="font-bold text-base text-emerald-400">Feedback Submitted!</h3>
                <p className="text-xs text-muted-foreground">Thank you for helping us build a better coding hospital.</p>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 text-xs">
                  {/* Feedback Category */}
                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground uppercase text-[10px]">Feedback Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["Feedback", "Bug", "UX Confusion", "AI Issue"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`p-2 rounded border text-center transition-colors ${
                            type === t ? "bg-primary/20 border-primary text-primary font-bold" : "bg-surface/30 border-border/40 text-muted-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground uppercase text-[10px]">Overall Experience (1-5 Stars)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`flex-1 py-1.5 rounded border text-sm transition-colors ${
                            rating >= star ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold" : "bg-surface/30 border-border/40 text-muted-foreground"
                          }`}
                        >
                          ★ {star}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Was Dr. React Helpful */}
                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground uppercase text-[10px]">Was Dr. React Helpful?</label>
                    <select
                      value={drReactHelpful}
                      onChange={(e) => setDrReactHelpful(e.target.value)}
                      className="w-full bg-surface/30 border border-border/50 rounded p-2 text-xs text-foreground focus:outline-none"
                    >
                      <option value="Yes">Yes — Perfect hints without giving full code</option>
                      <option value="Too Little">Too Little — Need clearer line direction</option>
                      <option value="Too Much">Too Much — Revealed answer too quickly</option>
                    </select>
                  </div>

                  {/* Would Pay Pro */}
                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground uppercase text-[10px]">Would You Pay $19/mo for Pro Missions & Unlimited Dr. React?</label>
                    <select
                      value={wouldPayPro}
                      onChange={(e) => setWouldPayPro(e.target.value)}
                      className="w-full bg-surface/30 border border-border/50 rounded p-2 text-xs text-foreground focus:outline-none"
                    >
                      <option value="Yes">Yes — Extremely valuable for job prep</option>
                      <option value="Maybe">Maybe — Need more advanced cases first</option>
                      <option value="No">No — Prefer free tier only</option>
                    </select>
                  </div>

                  {/* Freeform Comment */}
                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground uppercase text-[10px]">What confused you or needs improvement?</label>
                    <textarea
                      rows={3}
                      value={whatConfused}
                      onChange={(e) => setWhatConfused(e.target.value)}
                      placeholder="Tell us what was confusing, broken, or awesome..."
                      className="w-full bg-background border border-border/50 rounded p-2 text-xs text-foreground focus:outline-none"
                      required
                    />
                  </div>
                </CardContent>

                <CardFooter className="pt-2 flex justify-end gap-2 border-t border-border/30">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                    {isSubmitting ? "Sending..." : "Submit Beta Feedback"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
