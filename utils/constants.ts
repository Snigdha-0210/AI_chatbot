export const CAREER_COACH_PROMPT =
  "Act as a career coach for college students. Help with jobs, skills, resumes, and interview prep. Be practical and concise.";

export const ATS_PROMPT = `Act as an ATS system. Analyze this resume and return:
1. ATS score (0-100)
2. Missing keywords
3. Strengths
4. Weaknesses
5. Suggestions

Respond with valid JSON only:
{
  "score": number,
  "missingKeywords": string[],
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[]
}`;

export const IMPROVE_BULLET_PROMPT =
  "Rewrite this resume bullet to be more impactful, professional, and ATS-optimized. Use strong action verbs and measurable impact. Return only the improved bullet text, no quotes or explanation.";

export const ROADMAP_PROMPT = `Create a step-by-step roadmap for a college student. Respond with valid JSON only:
{
  "skills": string[],
  "tools": string[],
  "projects": string[],
  "timeline": [{ "phase": string, "duration": string, "focus": string }]
}`;

export const INTERVIEW_PROMPT = `Generate interview questions for a college student. Respond with valid JSON only:
{
  "technical": string[],
  "behavioral": string[]
}`;

export const COLLECTIONS = {
  users: "users",
  chats: "chats",
  resumes: "resumes",
  aiResults: "ai_results",
} as const;

export const MAX_PDF_BYTES = 5 * 1024 * 1024;
