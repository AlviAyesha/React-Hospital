"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dataService } from "@/lib/data";
import { BugCase } from "@/lib/types";

export default function NewCase() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<BugCase>>({
    title: "",
    difficulty: "Easy",
    access_level: "free",
    xp_reward: 100,
    description: "",
    user_complaint: "",
    error_logs: "",
    broken_code: "",
    expected_code: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dataService.createBugCase(formData as Omit<BugCase, 'id'>);
      router.push("/admin/cases");
    } catch (error) {
      console.error("Failed to save case:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Bug Case</h1>
        <p className="text-muted-foreground mt-2">Design a new mission for React Hospital students.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-surface/30 border-border/50">
          <CardHeader>
            <CardTitle>Case Details</CardTitle>
            <CardDescription>Basic information and categorisation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Mission Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. The Hydration Trap" 
                  required 
                  className="bg-background border-border/50"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module">Module / Level</Label>
                <Select>
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue placeholder="Select Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="l1">Level 1: React Fundamentals</SelectItem>
                    <SelectItem value="l2">Level 2: State Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(val: string | null) => setFormData({ ...formData, difficulty: (val as BugCase['difficulty']) || 'Easy' })}
                >
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="access_level">Access Level</Label>
                <Select 
                  value={formData.access_level || 'free'} 
                  onValueChange={(val: string | null) => setFormData({ ...formData, access_level: (val as BugCase['access_level']) || 'free' })}
                >
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue placeholder="Access Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free (All Students)</SelectItem>
                    <SelectItem value="pro">Pro Only (Subscribers)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="xp">XP Reward</Label>
                <Input 
                  id="xp" 
                  type="number" 
                  placeholder="100" 
                  required 
                  className="bg-background border-border/50"
                  value={formData.xp_reward}
                  onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Input 
                id="description" 
                placeholder="A brief summary of the bug..." 
                className="bg-background border-border/50" 
                required 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complaint">User Complaint (Briefing)</Label>
              <Textarea 
                id="complaint" 
                placeholder="Describe what the simulated user is experiencing..." 
                className="min-h-[100px] bg-background border-border/50" 
                required 
                value={formData.user_complaint}
                onChange={(e) => setFormData({ ...formData, user_complaint: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logs">Terminal Error Logs</Label>
              <Textarea 
                id="logs" 
                placeholder="Paste the exact Next.js/React error logs here..." 
                className="min-h-[100px] font-mono text-xs bg-background border-border/50 text-red-400" 
                required 
                value={formData.error_logs}
                onChange={(e) => setFormData({ ...formData, error_logs: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/30 border-border/50">
          <CardHeader>
            <CardTitle>Code Simulator</CardTitle>
            <CardDescription>The broken code presented to the user, and the expected correct code.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="broken_code">Broken Code (Starting State)</Label>
              <Textarea 
                id="broken_code" 
                placeholder="export default function..." 
                className="min-h-[200px] font-mono text-sm bg-background border-border/50" 
                required 
                value={formData.broken_code}
                onChange={(e) => setFormData({ ...formData, broken_code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_code">Expected Code (Solution)</Label>
              <Textarea 
                id="expected_code" 
                placeholder="export default function..." 
                className="min-h-[200px] font-mono text-sm bg-background border-border/50 text-green-500/80" 
                required 
                value={formData.expected_code}
                onChange={(e) => setFormData({ ...formData, expected_code: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/cases')}>Cancel</Button>
          <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Case"}
          </Button>
        </div>
      </form>
    </div>
  );
}
