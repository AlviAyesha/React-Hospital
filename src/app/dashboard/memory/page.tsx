"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSkillMemory, ConceptRecord } from "@/lib/skillMemory";
import { Button } from "@/components/ui/button";

const statusConfig = {
  weak: { label: "Weak Spot", color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/5", dot: "bg-red-500" },
  improving: { label: "Improving", color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/5", dot: "bg-yellow-500" },
  strong: { label: "Strong", color: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/5", dot: "bg-green-500" },
};

export default function SkillMemoryPage() {
  const [memory, setMemory] = useState<ConceptRecord[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMemory(getSkillMemory());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const weak = memory.filter((m) => m.status === "weak");
  const improving = memory.filter((m) => m.status === "improving");
  const strong = memory.filter((m) => m.status === "strong");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill Memory</h1>
        <p className="text-muted-foreground mt-1">
          The AI tracks your weak spots across every submission. Fix them here.
        </p>
      </div>

      {memory.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/50 rounded-xl">
          <div className="text-4xl mb-4">🧠</div>
          <p className="text-muted-foreground text-lg font-medium">No data yet</p>
          <p className="text-muted-foreground text-sm mt-1 mb-6">
            Submit a bug fix and the AI will start tracking your concepts.
          </p>
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary/90">Go to Missions →</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Weak Spots", count: weak.length, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { label: "Improving", count: improving.length, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
              { label: "Strong", count: strong.length, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}>
                <div className={`text-3xl font-bold font-mono ${s.color}`}>{s.count}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Weak spots first */}
          {weak.length > 0 && (
            <ConceptSection title="⚠️ Needs Work" concepts={weak} />
          )}
          {improving.length > 0 && (
            <ConceptSection title="📈 Improving" concepts={improving} />
          )}
          {strong.length > 0 && (
            <ConceptSection title="✅ Strong" concepts={strong} />
          )}
        </>
      )}
    </div>
  );
}

function ConceptSection({ title, concepts }: { title: string; concepts: ConceptRecord[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {concepts.map((c) => {
          const cfg = statusConfig[c.status];
          const failRate = c.attempts > 0 ? Math.round((c.failures / c.attempts) * 100) : 0;
          const passRate = 100 - failRate;
          return (
            <div key={c.concept} className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className="font-semibold text-sm">{c.concept}</span>
                </div>
                <span className={`text-xs font-mono ${cfg.color}`}>{cfg.label}</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${
                    c.status === "weak" ? "bg-red-500" : c.status === "improving" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${passRate}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{c.attempts} attempt{c.attempts !== 1 ? "s" : ""}</span>
                <span>{passRate}% pass rate</span>
                <span>{new Date(c.lastSeen).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
