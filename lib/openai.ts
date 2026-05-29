import OpenAI from "openai";
import {
  ATS_PROMPT,
  CAREER_COACH_PROMPT,
  IMPROVE_BULLET_PROMPT,
  INTERVIEW_PROMPT,
  ROADMAP_PROMPT,
} from "@/utils/constants";
import type {
  AtsAnalysis,
  ChatMessage,
  InterviewContent,
  RoadmapContent,
} from "@/types";

function client(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

export async function careerCoachReply(
  messages: ChatMessage[]
): Promise<string> {
  const openai = client();
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: CAREER_COACH_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
  });
  const text = res.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty response from OpenAI");
  return text;
}

export async function analyzeResume(text: string): Promise<AtsAnalysis> {
  const openai = client();
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: ATS_PROMPT },
      { role: "user", content: `Resume:\n\n${text}` },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });
  const raw = res.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error("Empty ATS response from OpenAI");

  const parsed = JSON.parse(raw) as AtsAnalysis;
  return {
    score: Number(parsed.score) || 0,
    missingKeywords: parsed.missingKeywords ?? [],
    strengths: parsed.strengths ?? [],
    weaknesses: parsed.weaknesses ?? [],
    suggestions: parsed.suggestions ?? [],
  };
}

export async function improveBullet(bullet: string): Promise<string> {
  const openai = client();
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: IMPROVE_BULLET_PROMPT },
      { role: "user", content: bullet },
    ],
    temperature: 0.5,
  });
  const text = res.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty response from OpenAI");
  return text.replace(/^["']|["']$/g, "");
}

export async function generateRoadmap(
  role: string,
  timeframe?: string
): Promise<Omit<RoadmapContent, "role" | "timeframe">> {
  const openai = client();
  const userMsg = timeframe
    ? `Role: ${role}\nTimeframe: ${timeframe}`
    : `Role: ${role}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `${ROADMAP_PROMPT}\n\nCreate a roadmap to become a ${role}.`,
      },
      { role: "user", content: userMsg },
    ],
    temperature: 0.6,
    response_format: { type: "json_object" },
  });
  const raw = res.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error("Empty roadmap response");

  const parsed = JSON.parse(raw) as {
    skills?: string[];
    tools?: string[];
    projects?: string[];
    timeline?: RoadmapContent["timeline"];
  };
  return {
    skills: parsed.skills ?? [],
    tools: parsed.tools ?? [],
    projects: parsed.projects ?? [],
    timeline: parsed.timeline ?? [],
  };
}

export async function generateInterviewQuestions(
  role: string,
  difficulty: string,
  existing?: { technical: string[]; behavioral: string[] }
): Promise<{ technical: string[]; behavioral: string[] }> {
  const openai = client();
  const avoid =
    existing &&
    (existing.technical.length > 0 || existing.behavioral.length > 0)
      ? `\nAvoid repeating these questions:\nTechnical: ${existing.technical.join("; ")}\nBehavioral: ${existing.behavioral.join("; ")}`
      : "";

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `${INTERVIEW_PROMPT}\n\nRole: ${role}\nDifficulty: ${difficulty}. Generate 5 technical and 5 behavioral questions.${avoid}`,
      },
      { role: "user", content: `Generate ${difficulty} interview questions for ${role}.` },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });
  const raw = res.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error("Empty interview response");

  const parsed = JSON.parse(raw) as {
    technical?: string[];
    behavioral?: string[];
  };
  return {
    technical: parsed.technical ?? [],
    behavioral: parsed.behavioral ?? [],
  };
}
