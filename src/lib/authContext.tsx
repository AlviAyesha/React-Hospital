"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "./supabase/client";
import { Profile, SkillLevel } from "./types";

interface AuthContextType {
  user: Profile | null;
  supabaseUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSupabaseActive: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  toggleMockAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_PROFILE_KEY = "rh_local_user_profile";

function getFallbackProfile(): Profile {
  if (typeof window === "undefined") {
    return {
      id: "local-user-1",
      display_name: "Dev",
      email: "dev@example.com",
      role: "student",
      skill_level: "intermediate",
      goal: "job",
      preferred_language: "english",
      total_xp: 0,
      current_level: 1,
      current_streak: 1,
      created_at: new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback below
  }

  const name = localStorage.getItem("rh_user_name") || "Dev";
  const email = localStorage.getItem("rh_user_email") || "dev@example.com";
  const role = (localStorage.getItem("rh_user_role") as "student" | "admin") || "student";
  const level = (localStorage.getItem("rh_skill_level") as SkillLevel) || "intermediate";
  const goal = localStorage.getItem("rh_goal") || "job";
  const lang = localStorage.getItem("rh_language") || "english";
  const xp = parseInt(localStorage.getItem("rh_xp") ?? "0") || 0;
  const streak = parseInt(localStorage.getItem("rh_streak") ?? "1") || 1;

  const profile: Profile = {
    id: "local-user-1",
    display_name: name,
    email,
    role,
    skill_level: level,
    goal,
    preferred_language: lang,
    total_xp: xp,
    current_level: 1,
    current_streak: streak,
    created_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }

  return profile;
}

function saveFallbackProfile(profile: Profile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem("rh_user_name", profile.display_name);
    if (profile.email) localStorage.setItem("rh_user_email", profile.email);
    localStorage.setItem("rh_user_role", profile.role);
    localStorage.setItem("rh_skill_level", profile.skill_level);
    localStorage.setItem("rh_goal", profile.goal);
    localStorage.setItem("rh_language", profile.preferred_language);
    localStorage.setItem("rh_xp", String(profile.total_xp));
    localStorage.setItem("rh_streak", String(profile.current_streak));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isSupabaseActive = isSupabaseConfigured();

  const ensureSupabaseProfile = async (sbUser: User, nameHint?: string): Promise<Profile> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Supabase unconfigured");

    const { data: existing } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", sbUser.id)
      .single();

    if (existing) {
      const profile: Profile = {
        id: existing.id,
        display_name: existing.display_name || nameHint || sbUser.email?.split("@")[0] || "Dev",
        email: sbUser.email,
        role: (existing.role as "student" | "admin") || "student",
        skill_level: existing.skill_level || "intermediate",
        goal: existing.goal || "job",
        preferred_language: existing.preferred_language || "english",
        total_xp: existing.total_xp || 0,
        current_level: existing.current_level || 1,
        current_streak: existing.current_streak || 1,
        created_at: existing.created_at || new Date().toISOString(),
      };
      return profile;
    }

    // Initialize new profile & default records
    const newProfileData = {
      id: sbUser.id,
      display_name: nameHint || sbUser.user_metadata?.display_name || sbUser.email?.split("@")[0] || "Dev",
      role: "student" as const,
      skill_level: "intermediate" as const,
      goal: "job",
      preferred_language: "english",
      total_xp: 0,
      current_level: 1,
      current_streak: 1,
    };

    await supabase.from("profiles").upsert(newProfileData);

    // Initialize student_progress
    await supabase.from("student_progress").upsert({
      user_id: sbUser.id,
      completed_cases: [],
      unlocked_modules: ["m1", "m2"],
      last_activity_at: new Date().toISOString(),
    });

    // Initialize streaks
    await supabase.from("streaks").upsert({
      user_id: sbUser.id,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: new Date().toISOString().split("T")[0],
    });

    return {
      ...newProfileData,
      email: sbUser.email,
      created_at: new Date().toISOString(),
    } as Profile;
  };

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseActive) {
      const timer = setTimeout(() => {
        if (mounted) {
          setUser(getFallbackProfile());
          setLoading(false);
        }
      }, 0);
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      const timer = setTimeout(() => {
        if (mounted) {
          setUser(getFallbackProfile());
          setLoading(false);
        }
      }, 0);
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }

    // Active Supabase auth initialization
    supabase.auth.getUser().then(async ({ data: { user: sbUser } }) => {
      if (!mounted) return;
      if (sbUser) {
        setSupabaseUser(sbUser);
        try {
          const prof = await ensureSupabaseProfile(sbUser);
          if (mounted) setUser(prof);
        } catch (err) {
          console.error("Failed to load profile from Supabase:", err);
          if (mounted) setUser(getFallbackProfile());
        }
      } else {
        if (mounted) setUser(null);
      }
      if (mounted) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      const sbUser = session?.user ?? null;
      setSupabaseUser(sbUser);
      if (sbUser) {
        try {
          const prof = await ensureSupabaseProfile(sbUser);
          if (mounted) setUser(prof);
        } catch {
          if (mounted) setUser(getFallbackProfile());
        }
      } else {
        if (mounted) setUser(null);
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isSupabaseActive]);

  const login = async (email: string, password?: string) => {
    if (!isSupabaseActive) {
      const isDevAdmin = email.toLowerCase().includes("admin");
      const current = getFallbackProfile();
      const updated: Profile = {
        ...current,
        email,
        display_name: email.split("@")[0] || current.display_name,
        role: isDevAdmin ? "admin" : "student",
      };
      saveFallbackProfile(updated);
      setUser(updated);
      return { success: true };
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { success: false, error: "Supabase unavailable" };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || "",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const prof = await ensureSupabaseProfile(data.user);
      setUser(prof);
    }
    return { success: true };
  };

  const signUp = async (name: string, email: string, password?: string) => {
    if (!isSupabaseActive) {
      const isDevAdmin = email.toLowerCase().includes("admin");
      const updated: Profile = {
        id: `local-user-${Date.now()}`,
        display_name: name,
        email,
        role: isDevAdmin ? "admin" : "student",
        skill_level: "intermediate",
        goal: "job",
        preferred_language: "english",
        total_xp: 0,
        current_level: 1,
        current_streak: 1,
        created_at: new Date().toISOString(),
      };
      saveFallbackProfile(updated);
      setUser(updated);
      return { success: true };
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { success: false, error: "Supabase unavailable" };

    const { data, error } = await supabase.auth.signUp({
      email,
      password: password || "",
      options: {
        data: { display_name: name },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const prof = await ensureSupabaseProfile(data.user, name);
      setUser(prof);
    }
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseActive) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_PROFILE_KEY);
      localStorage.removeItem("rh_user_role");
    }
    setUser(null);
    setSupabaseUser(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const updated: Profile = { ...user, ...updates };
    setUser(updated);

    if (!isSupabaseActive) {
      saveFallbackProfile(updated);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.from("profiles").update(updates).eq("id", user.id);
    }
  };

  const toggleMockAdmin = () => {
    if (!user) return;
    const newRole: "student" | "admin" = user.role === "admin" ? "student" : "admin";
    const updated: Profile = { ...user, role: newRole };
    setUser(updated);
    if (!isSupabaseActive) {
      saveFallbackProfile(updated);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        loading,
        isAdmin,
        isSupabaseActive,
        login,
        signUp,
        logout,
        updateProfile,
        toggleMockAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
