"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/authContext";
import { SkillLevel } from "@/lib/types";

const skillLevelOptions = [
  { value: "beginner", label: "Absolute Beginner" },
  { value: "intermediate", label: "Tutorial Watcher" },
  { value: "advanced", label: "Junior Dev" },
];

const goalOptions = [
  { value: "job", label: "Get a job" },
  { value: "freelance", label: "Freelance" },
  { value: "saas", label: "Build a SaaS" },
  { value: "interview", label: "Tech Interview Prep" },
];

const languageOptions = [
  { value: "english", label: "Professional English" },
  { value: "urdu_hindi", label: "Casual Urdu/Hindi mix (Hinglish)" },
];

const styleOptions = [
  { value: "friendly", label: "Friendly & Supportive (Step-by-step guidance)" },
  { value: "direct", label: "Direct CTO Mode (Concise & sharp clues)" },
  { value: "interview", label: "Strict Interviewer (Probing questions)" },
];

const strictnessOptions = [
  { value: "gentle", label: "Gentle (Early conceptual guidance)" },
  { value: "balanced", label: "Balanced (4-stage progressive hints)" },
  { value: "challenge", label: "Challenge Me (Strict line clues only)" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("intermediate");
  const [goal, setGoal] = useState("job");
  const [language, setLanguage] = useState("english");
  const [style, setStyle] = useState("friendly");
  const [strictness, setStrictness] = useState("balanced");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setName(user?.display_name || localStorage.getItem("rh_user_name") || "");
      setSkillLevel(user?.skill_level || (localStorage.getItem("rh_skill_level") as SkillLevel) || "intermediate");
      setGoal(user?.goal || localStorage.getItem("rh_goal") || "job");
      setLanguage(user?.mentor_language || localStorage.getItem("rh_language") || "english");
      setStyle(user?.mentor_style || localStorage.getItem("rh_mentor_style") || "friendly");
      setStrictness(user?.hint_strictness || localStorage.getItem("rh_strictness") || "balanced");
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  const handleSave = async () => {
    localStorage.setItem("rh_user_name", name);
    localStorage.setItem("rh_skill_level", skillLevel);
    localStorage.setItem("rh_goal", goal);
    localStorage.setItem("rh_language", language);
    localStorage.setItem("rh_mentor_style", style);
    localStorage.setItem("rh_strictness", strictness);

    await updateProfile({
      display_name: name,
      skill_level: skillLevel,
      goal,
      preferred_language: language,
      mentor_language: language as 'english' | 'urdu_hindi' | 'hinglish',
      mentor_style: style as 'friendly' | 'direct' | 'interview',
      hint_strictness: strictness as 'gentle' | 'balanced' | 'challenge',
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (!confirm("Reset all progress? This will clear XP, streak, and skill memory.")) return;
    ["rh_user_name", "rh_skill_level", "rh_goal", "rh_language", "rh_mentor_style", "rh_strictness", "rh_onboarded",
      "rh_xp", "rh_streak", "rh_last_visit", "rh_skill_memory", "rh_solved"].forEach((k) =>
      localStorage.removeItem(k)
    );
    router.push("/");
  };

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Update your profile and Dr. React AI Mentor preferences.</p>
      </div>

      <div className="space-y-6 border border-border/40 rounded-xl p-6 bg-surface/20">
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label>Skill Level</Label>
          <div className="flex flex-col gap-2">
            {skillLevelOptions.map((o) => (
              <label key={o.value} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${skillLevel === o.value ? "border-primary/50 bg-primary/5" : "border-border/40 hover:bg-surface/40"}`}>
                <input type="radio" name="skill" value={o.value} checked={skillLevel === o.value} onChange={(e) => setSkillLevel(e.target.value as SkillLevel)} className="accent-primary" />
                <span className="text-sm font-medium">{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Goal</Label>
          <div className="flex flex-col gap-2">
            {goalOptions.map((o) => (
              <label key={o.value} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${goal === o.value ? "border-primary/50 bg-primary/5" : "border-border/40 hover:bg-surface/40"}`}>
                <input type="radio" name="goal" value={o.value} checked={goal === o.value} onChange={(e) => setGoal(e.target.value)} className="accent-primary" />
                <span className="text-sm font-medium">{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Dr. React Language</Label>
          <div className="flex flex-col gap-2">
            {languageOptions.map((o) => (
              <label key={o.value} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${language === o.value ? "border-primary/50 bg-primary/5" : "border-border/40 hover:bg-surface/40"}`}>
                <input type="radio" name="language" value={o.value} checked={language === o.value} onChange={(e) => setLanguage(e.target.value)} className="accent-primary" />
                <span className="text-sm font-medium">{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Dr. React Mentor Style</Label>
          <div className="flex flex-col gap-2">
            {styleOptions.map((o) => (
              <label key={o.value} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${style === o.value ? "border-primary/50 bg-primary/5" : "border-border/40 hover:bg-surface/40"}`}>
                <input type="radio" name="style" value={o.value} checked={style === o.value} onChange={(e) => setStyle(e.target.value)} className="accent-primary" />
                <span className="text-sm font-medium">{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Hint Strictness</Label>
          <div className="flex flex-col gap-2">
            {strictnessOptions.map((o) => (
              <label key={o.value} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${strictness === o.value ? "border-primary/50 bg-primary/5" : "border-border/40 hover:bg-surface/40"}`}>
                <input type="radio" name="strictness" value={o.value} checked={strictness === o.value} onChange={(e) => setStrictness(e.target.value)} className="accent-primary" />
                <span className="text-sm font-medium">{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 flex-1 font-semibold">
            {saved ? "Saved ✓" : "Save Preferences"}
          </Button>
        </div>
      </div>

      <div className="border border-red-500/20 rounded-xl p-6 bg-red-500/5 space-y-3">
        <h3 className="font-semibold text-red-400">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">Reset all progress — XP, streak, skill memory, and solved cases.</p>
        <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={handleReset}>
          Reset All Progress
        </Button>
      </div>
    </div>
  );
}
