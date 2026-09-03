"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/authContext";
import { SkillLevel } from "@/lib/types";

export default function Onboarding() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState<SkillLevel>("intermediate");
  const [goal, setGoal] = useState("job");
  const [language, setLanguage] = useState<"english" | "urdu_hindi" | "hinglish">("english");
  const [style, setStyle] = useState<"friendly" | "direct" | "interview">("friendly");

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      localStorage.setItem("rh_skill_level", level);
      localStorage.setItem("rh_goal", goal);
      localStorage.setItem("rh_language", language);
      localStorage.setItem("rh_mentor_style", style);
      localStorage.setItem("rh_onboarded", "true");

      await updateProfile({
        skill_level: level,
        goal,
        mentor_language: language,
        mentor_style: style,
        preferred_language: language,
      });

      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-primary/20 shadow-xl bg-surface/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            Dr. React Onboarding Calibration
          </CardTitle>
          <CardDescription>
            Step {step} of 4 — Calibrating AI Mentor & Ward Assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-medium text-foreground">What is your current coding confidence?</h3>
              <RadioGroup value={level} onValueChange={(val) => setLevel(val as SkillLevel)} className="gap-3">
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="beginner" id="r1" />
                  <Label htmlFor="r1" className="flex-1 cursor-pointer font-medium">Beginner (Basic HTML/CSS, learning JS)</Label>
                </div>
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="intermediate" id="r2" />
                  <Label htmlFor="r2" className="flex-1 cursor-pointer font-medium">Intermediate (Tutorial watcher, struggle in bugs)</Label>
                </div>
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="advanced" id="r3" />
                  <Label htmlFor="r3" className="flex-1 cursor-pointer font-medium">Advanced (Junior Dev, want production mastery)</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-medium text-foreground">What is your primary career goal?</h3>
              <RadioGroup value={goal} onValueChange={setGoal} className="gap-3">
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="job" id="g1" />
                  <Label htmlFor="g1" className="flex-1 cursor-pointer font-medium">Get a job as a Frontend/Fullstack Dev</Label>
                </div>
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="freelance" id="g2" />
                  <Label htmlFor="g2" className="flex-1 cursor-pointer font-medium">Start freelancing & client projects</Label>
                </div>
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="saas" id="g3" />
                  <Label htmlFor="g3" className="flex-1 cursor-pointer font-medium">Build my own SaaS / Startup app</Label>
                </div>
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="interview" id="g4" />
                  <Label htmlFor="g4" className="flex-1 cursor-pointer font-medium">Tech Interview & Live Coding Prep</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-medium text-foreground">What language should Dr. React speak?</h3>
              <RadioGroup value={language} onValueChange={(v) => setLanguage(v as typeof language)} className="gap-3">
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="english" id="l1" />
                  <Label htmlFor="l1" className="flex-1 cursor-pointer font-medium">Professional English</Label>
                </div>
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="urdu_hindi" id="l2" />
                  <Label htmlFor="l2" className="flex-1 cursor-pointer font-medium">Friendly Hinglish (Casual Urdu/Hindi mix)</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-medium text-foreground">Preferred Mentor Tone & Teaching Style?</h3>
              <RadioGroup value={style} onValueChange={(v) => setStyle(v as typeof style)} className="gap-3">
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="friendly" id="s1" />
                  <Label htmlFor="s1" className="flex-1 cursor-pointer font-medium">Friendly & Supportive (Step-by-step guidance)</Label>
                </div>
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="direct" id="s2" />
                  <Label htmlFor="s2" className="flex-1 cursor-pointer font-medium">Direct CTO Mode (Concise & sharp clues)</Label>
                </div>
                <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
                  <RadioGroupItem value="interview" id="s3" />
                  <Label htmlFor="s3" className="flex-1 cursor-pointer font-medium">Strict Interviewer (Probing questions)</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
          ) : (
            <div></div>
          )}
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            onClick={handleNext}
          >
            {step === 4 ? "Complete & Enter Ward →" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
