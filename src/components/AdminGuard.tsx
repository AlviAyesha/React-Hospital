"use client";

import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, toggleMockAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-sm">
        Authenticating Admin session...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md border border-red-500/30 bg-red-950/10 p-8 rounded-xl space-y-6">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-2xl mx-auto border border-red-500/30">
            🔒
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">Admin Access Required</h1>
            <p className="text-sm text-muted-foreground">
              You must have an administrator role to access <code className="text-red-400 font-mono">/admin</code>.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Return to Dashboard
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleMockAdmin}
              className="w-full text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              ⚡ Dev Override: Switch Role to Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
