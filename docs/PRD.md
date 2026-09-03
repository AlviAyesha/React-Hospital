# Product Requirements Document (PRD)
## 1. Product Overview
**Name:** React Hospital / DevSurvival OS
**Concept:** A simulation-based coding school where students learn by fixing broken real-world apps, completing startup-style engineering missions, and receiving AI mentor feedback.
**Platforms:** Web App, Mobile App, Admin Dashboard

## 2. Target Audience
- Beginner students
- Non-CS learners
- South Asian learners (bilingual English, Urdu/Hindi mix)
- Students suffering from tutorial hell
- Junior developers wanting production-level Next.js/React skills

## 3. Core Value Proposition
Transform absolute beginners into job-ready React + Next.js full-stack developers through hands-on debugging, real-world simulations, and personalized AI mentoring.

## 4. Key Features (MVP Scope)
1. **Auth & Student Onboarding**: Capture skill level, goal, language preference, and generate a personalized learning path.
2. **Dashboard**: Central hub for XP, streaks, level, and next mission.
3. **Learning Path Engine**: Structured levels (0 to 9) from Web Foundations to Interview Readiness.
4. **React Hospital Challenge System**: Bug cases with broken code, error logs, hints, AI mentor feedback, and scoring.
5. **Monaco Code Editor**: In-browser coding for fixing bugs.
6. **AI Tutor Chat**: AI mentor that guides without giving direct answers, tracks mistakes, and explains concepts.
7. **Skill Memory & XP/Streak System**: Track progress, weak concepts, and gamify learning.
8. **Admin Dashboard**: Manage courses, bug cases, missions, and users.

## 5. Out of Scope for MVP
- Full marketplace
- Community chat / Multiplayer
- Live code execution with WebContainers (Monaco MVP is just client-side validation/mocking)
- Complex certificates
- Native mobile coding IDE

## 6. User Flows
- **Onboarding:** Signup -> Questionnaire (Goal, Level, Lang) -> Generates Path -> Dashboard
- **Learning/Fixing:** Dashboard -> Select Mission -> Enter "React Hospital" Editor -> Attempt Fix -> Talk to AI Tutor -> Submit -> Receive AI Review & Score -> Return to Dashboard

## 7. Success Metrics
- Course completion rate
- Average time spent per bug case
- Daily Active Users (streaks)
- Number of bugs fixed per student
