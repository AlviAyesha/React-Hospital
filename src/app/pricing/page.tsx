"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  const router = useRouter();
  const { user, isSupabaseActive, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currentPlan = user?.plan || "free";

  const handleUpgrade = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (!user) {
        router.push("/sign-up");
        return;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });

      const data = await res.json();

      if (data.url) {
        if (data.simulated) {
          await updateProfile({ plan: "pro", subscription_status: "active" });
          setMessage("⚡ Local Dev Mode: Upgraded to Pro plan successfully!");
          setTimeout(() => router.push("/dashboard"), 1200);
        } else {
          window.location.href = data.url;
        }
      } else {
        setMessage(data.error || "Failed to start checkout process.");
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Navigation */}
      <header className="border-b border-border/40 bg-surface/30 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-xl font-bold tracking-tighter flex items-center gap-2">
          <span className="text-primary">{"<"}</span>
          React Hospital
          <span className="text-primary">{"/>"}</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Button>
          </Link>
          {user ? (
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
              Plan: {currentPlan}
            </span>
          ) : (
            <Link href="/sign-in">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Survive Production. <span className="text-primary">Level Up Faster.</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose the survival plan that fits your career goals. Master React & Next.js debugging with AI-guided missions.
          </p>
        </div>

        {message && (
          <div className="max-w-md mx-auto p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center">
            {message}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className="border-border/50 bg-surface/20 flex flex-col justify-between relative overflow-hidden">
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">Free Survival</CardTitle>
                <span className="text-xs font-mono uppercase bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded">
                  Starter
                </span>
              </div>
              <CardDescription>Essential debugging practice for beginners.</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-muted-foreground text-sm font-mono"> / forever</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-t border-border/40 pt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Access to Beginner Bug Cases</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>5 AI Mentor Hints per Mission</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Basic XP & Streak Tracking</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-zinc-600">✕</span>
                  <span className="line-through">Advanced & Pro Bug Missions</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-zinc-600">✕</span>
                  <span className="line-through">Unlimited AI Mentor Guidance</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-6">
              {currentPlan === "free" ? (
                <Button variant="outline" className="w-full border-border/50 text-muted-foreground" disabled>
                  Current Plan
                </Button>
              ) : (
                <Link href="/dashboard" className="w-full">
                  <Button variant="outline" className="w-full border-border/50">
                    Start Free
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className="border-primary/40 bg-surface/40 flex flex-col justify-between relative overflow-hidden shadow-[0_0_25px_rgba(59,130,246,0.15)]">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">
              MOST POPULAR
            </div>
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-primary">Pro Survivor</CardTitle>
              </div>
              <CardDescription>Full access to production-grade bug cases & unlimited AI mentor.</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-extrabold">$19</span>
                <span className="text-muted-foreground text-sm font-mono"> / month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-t border-border/40 pt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <span className="text-primary">✓</span>
                  <span>Full Access to ALL Bug Missions (Easy, Medium, Hard)</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <span className="text-primary">✓</span>
                  <span>Unlimited AI CTO Mentor Guidance</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <span className="text-primary">✓</span>
                  <span>Deep Skill Memory & Weakness Analytics</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <span className="text-primary">✓</span>
                  <span>Priority Code Evaluation & Instant Feedback</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <span className="text-primary">✓</span>
                  <span>Certificate-Ready Progress Verification</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-6">
              {currentPlan === "pro" ? (
                <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-400" disabled>
                  ✓ Pro Plan Active
                </Button>
              ) : (
                <Button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  {loading ? "Connecting to Stripe..." : "Upgrade to Pro →"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-4xl mx-auto space-y-6 pt-8">
          <h2 className="text-2xl font-bold tracking-tight text-center">Feature Comparison</h2>
          <div className="rounded-xl border border-border/40 bg-surface/20 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface/50 border-b border-border/40 font-mono text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="p-4">Feature</th>
                  <th className="p-4 text-center">Free Plan</th>
                  <th className="p-4 text-center text-primary">Pro Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr>
                  <td className="p-4 font-medium">Beginner Cases (Hydration, simple state)</td>
                  <td className="p-4 text-center text-emerald-400">Included</td>
                  <td className="p-4 text-center text-emerald-400">Included</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Advanced Cases (Stale closure, race conditions)</td>
                  <td className="p-4 text-center text-muted-foreground">Locked</td>
                  <td className="p-4 text-center text-primary font-semibold">Full Access</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">AI CTO Mentor Hints</td>
                  <td className="p-4 text-center text-muted-foreground">5 messages / case</td>
                  <td className="p-4 text-center text-primary font-semibold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Skill Memory Analytics</td>
                  <td className="p-4 text-center text-muted-foreground">Basic</td>
                  <td className="p-4 text-center text-primary font-semibold">Advanced Breakdown</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Streak & XP System</td>
                  <td className="p-4 text-center text-emerald-400">Included</td>
                  <td className="p-4 text-center text-emerald-400">Included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 p-6 text-center text-xs text-muted-foreground">
        React Hospital OS — Stripe Billing Integration ({isSupabaseActive ? "Supabase Live" : "Local Dev Mode"})
      </footer>
    </div>
  );
}
