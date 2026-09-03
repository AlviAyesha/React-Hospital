"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dataService } from "@/lib/data";
import { BugCase } from "@/lib/types";

const getDifficultyColor = (diff: string) => {
  if (diff === 'Easy') return 'bg-green-500/10 text-green-500';
  if (diff === 'Medium') return 'bg-yellow-500/10 text-yellow-500';
  return 'bg-red-500/10 text-red-500';
};

export default function AdminCases() {
  const [cases, setCases] = useState<BugCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getBugCases().then((data) => {
      setCases(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bug Cases</h1>
          <p className="text-muted-foreground mt-2">Manage the React Hospital missions.</p>
        </div>
        <Link href="/admin/cases/new">
          <Button className="bg-primary hover:bg-primary/90">Create New Case</Button>
        </Link>
      </div>

      <div className="rounded-md border border-border/50 bg-surface/20">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead>Case Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead className="text-right">XP Reward</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Loading cases...
                </TableCell>
              </TableRow>
            ) : cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No cases found. Create your first case above!
                </TableCell>
              </TableRow>
            ) : (
              cases.map((c) => (
                <TableRow key={c.id} className="border-border/50">
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell>
                    <span className={"px-2 py-1 rounded text-xs " + getDifficultyColor(c.difficulty)}>
                      {c.difficulty}
                    </span>
                  </TableCell>
                  <TableCell>
                    {c.access_level === 'pro' ? (
                      <span className="px-2 py-1 rounded text-xs bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                        PRO
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-300">
                        Free
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{c.xp_reward}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/hospital/case/id?caseId=${c.id}`}>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
