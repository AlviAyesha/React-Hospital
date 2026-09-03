"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [xp, setXp] = useState(0);

  const userName = user?.display_name || "Dev";
  const userRole = user?.role || "student";

  useEffect(() => {
    const timer = setTimeout(() => {
      setXp(user?.total_xp ?? (parseInt(localStorage.getItem("rh_xp") ?? "0") || 0));
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  const xpMax = 1000;
  const xpPercent = Math.min((xp / xpMax) * 100, 100);

  const handleSignOut = async () => {
    await logout();
    router.push("/sign-in");
  };

  const navLinks = [
    { href: "/dashboard", label: "Missions" },
    { href: "/dashboard/memory", label: "Skill Memory" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r border-border/40 bg-surface/30 p-6 flex flex-col gap-8 shrink-0">
        <Link href="/" className="font-mono text-xl font-bold tracking-tighter flex items-center gap-2">
          <span className="text-primary">{"<"}</span>
          RH_OS
          <span className="text-primary">{"/>"}</span>
        </Link>

        <div className="flex items-center gap-3 px-3 py-2 bg-surface/40 rounded-lg border border-border/30">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
            {userName[0]?.toUpperCase() || "D"}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-medium leading-none truncate">{userName}</div>
            <div className="text-xs text-muted-foreground mt-0.5 capitalize">{userRole}</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-2 text-sm font-medium rounded-md text-red-400 hover:bg-red-950/20 transition-colors flex items-center justify-between"
            >
              <span>Admin Panel</span>
              <span className="text-xs font-mono bg-red-500/20 px-1.5 py-0.5 rounded text-red-300">OS</span>
            </Link>
          )}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 rounded-lg border border-border/50 bg-background/50 space-y-2">
            <div className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Current Rank</div>
            <div className="font-semibold text-foreground">Level {user?.current_level || 1}: Survivor</div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-right">{xp} / {xpMax} XP</div>
          </div>

          <div className="flex items-center justify-between px-1">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Home
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 h-7 px-2"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
