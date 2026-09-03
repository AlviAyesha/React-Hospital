import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: "⚡",
    title: "Fix Real Bugs",
    description: "Learn by debugging actual production-style errors — hydration mismatches, stale closures, infinite loops.",
  },
  {
    icon: "🤖",
    title: "AI Mentor (CTO Mode)",
    description: "Your personal CTO never gives you the answer. It asks guiding questions until YOU figure it out.",
  },
  {
    icon: "🎯",
    title: "Skill Memory",
    description: "Every submission tracks your weak spots. The AI adapts future missions to your exact gaps.",
  },
  {
    icon: "🔥",
    title: "Gamified XP System",
    description: "Earn XP, maintain streaks, level up your rank. Tutorial Hell has a boss fight — this is it.",
  },
];

const curriculum = [
  { level: "Level 1", title: "React Fundamentals", cases: ["The Hydration Trap", "Infinite Loop Chaos"], difficulty: "Easy–Medium" },
  { level: "Level 2", title: "State Management", cases: ["Stale Closure Nightmare", "Batched Updates Gone Wrong"], difficulty: "Medium–Hard" },
  { level: "Level 3", title: "Next.js Patterns", cases: ["Server/Client Boundary Explosion", "RSC Data Leak"], difficulty: "Hard" },
  { level: "Level 4", title: "Performance & Architecture", cases: ["Re-render Cascade", "Memoization Minefield"], difficulty: "Expert" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-mono text-xl font-bold tracking-tighter flex items-center gap-2">
            <span className="text-primary">{"<"}</span>
            React Hospital
            <span className="text-primary">{"/>"}</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              Features
            </Link>
            <Link href="#curriculum" className="text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              Curriculum
            </Link>
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Join Beta →
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-6 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-bold text-emerald-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
            🩺 React Hospital Beta Ward Active (50-Student Cohort)
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl">
            Fix Real Apps.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              Master React & Next.js.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Learn React and Next.js by fixing broken real-world apps with Dr. React, your AI debugging mentor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="h-14 px-8 text-base sm:text-lg bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(59,130,246,0.3)] font-semibold">
                Join Beta — Start Free Debugging Mission →
              </Button>
            </Link>
            <Link href="/hospital/case/id?caseId=c1">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base sm:text-lg border-primary/30 hover:bg-primary/10 font-semibold">
                Try Your First Emergency Case
              </Button>
            </Link>
          </div>

          {/* Code visual */}
          <div className="mt-16 w-full max-w-4xl rounded-xl border border-border/50 bg-surface/50 shadow-2xl overflow-hidden backdrop-blur-sm">
            <div className="flex items-center px-4 py-3 border-b border-border/50 bg-background/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="mx-auto text-xs font-mono text-muted-foreground">page.tsx — Hydration Error</div>
            </div>
            <div className="p-6 text-left font-mono text-sm sm:text-base overflow-x-auto text-muted-foreground leading-relaxed">
              <div className="text-red-400 mb-4">
                ✗ Error: Text content does not match server-rendered HTML.
              </div>
              <div>
                <span className="text-purple-400">export default function</span>{" "}
                <span className="text-blue-400">BrokenDashboard</span>() {"{"}
              </div>
              <div className="pl-4">
                <span className="text-purple-400">const</span> [time, setTime] ={" "}
                <span className="text-blue-400">useState</span>(
                <span className="text-emerald-400">new</span>{" "}
                <span className="text-blue-400">Date</span>().toLocaleTimeString())
              </div>
              <br />
              <div className="pl-4">
                <span className="text-purple-400">return</span> (
              </div>
              <div className="pl-8">
                {"<"}div{">"}Current Time: {"{"}time{"}"}
                {"<"}/div{">"}
              </div>
              <div className="pl-4">)</div>
              <div>{"}"}</div>
              <div className="mt-6 border-t border-border/50 pt-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="text-primary font-sans text-sm font-medium">
                  AI Mentor: Notice anything wrong with generating a Date on the first render?
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="container mx-auto px-6 mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why React Hospital?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Most tutorials teach syntax. This platform teaches debugging — the skill that separates junior devs from seniors.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl border border-border/50 bg-surface/20 hover:bg-surface/40 hover:border-primary/30 transition-all"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Curriculum */}
        <section id="curriculum" className="container mx-auto px-6 mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">The Curriculum</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              4 levels. 16+ bug cases. Each one a real-world pattern you will hit in a production job.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {curriculum.map((c, i) => (
              <div
                key={c.level}
                className={`p-6 rounded-xl border transition-all ${
                  i === 0
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/40 bg-surface/20 opacity-75"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-primary uppercase tracking-wider">{c.level}</span>
                  <span className="text-xs text-muted-foreground">{c.difficulty}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
                <ul className="space-y-1">
                  {c.cases.map((cas) => (
                    <li key={cas} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                      {cas}
                    </li>
                  ))}
                  <li className="text-sm text-muted-foreground/50 flex items-center gap-2 italic">
                    <span className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                    + more cases coming...
                  </li>
                </ul>
                {i === 0 && (
                  <Link href="/sign-up" className="mt-4 block">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 w-full">
                      Start Here →
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10 bg-background/80 text-center text-sm text-muted-foreground mt-20">
        <div className="container mx-auto space-y-2">
          <div className="font-mono font-bold text-foreground">
            <span className="text-primary">{"<"}</span>React Hospital<span className="text-primary">{"/>"}</span>
          </div>
          <p>DevSurvival OS MVP — Phase 2 Complete</p>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <Link href="/sign-in" className="hover:text-primary transition-colors">Sign In</Link>
            <Link href="/sign-up" className="hover:text-primary transition-colors">Sign Up</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
