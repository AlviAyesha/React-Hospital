"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminGuard } from "@/components/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 border-r border-border/40 bg-zinc-950 p-6 flex flex-col gap-8 shrink-0">
          <div className="font-mono text-xl font-bold tracking-tighter flex items-center gap-2">
            <span className="text-red-500">{"<"}</span>
            Admin_OS
            <span className="text-red-500">{"/>"}</span>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/admin"
              className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/admin/cases"
              className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
            >
              Bug Cases
            </Link>
            <Link
              href="/admin/users"
              className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
            >
              Students
            </Link>
            <Link
              href="/admin/prompts"
              className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
            >
              AI Prompts
            </Link>
          </nav>

          <div className="mt-auto">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-border/50 text-muted-foreground">
                Exit Admin
              </Button>
            </Link>
          </div>
        </aside>

        {/* Admin Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
