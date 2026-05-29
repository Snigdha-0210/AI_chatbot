import { getIdToken } from "@/lib/firebase";
import type {
  AtsAnalysis,
  ChatMessage,
  InterviewContent,
  RoadmapContent,
} from "@/types";

async function authJsonHeaders(): Promise<HeadersInit> {
  const token = await getIdToken();
  if (!token) throw new Error("You must be signed in");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function postChat(body: {
  message: string;
  chatId?: string;
  history?: ChatMessage[];
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: await authJsonHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Chat failed");
  return data as {
    reply: string;
    chatId: string;
    messages: ChatMessage[];
  };
}

export async function postAts(file: File) {
  const token = await getIdToken();
  if (!token) throw new Error("You must be signed in");

  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/ats", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "ATS scan failed");
  return data as AtsAnalysis & { resumeId: string };
}

export async function postImproveBullet(bullet: string) {
  const res = await fetch("/api/improve-bullet", {
    method: "POST",
    headers: await authJsonHeaders(),
    body: JSON.stringify({ bullet }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to improve bullet");
  return data as { resultId: string; input: string; output: string };
}

export async function postRoadmap(role: string, timeframe?: string) {
  const res = await fetch("/api/roadmap", {
    method: "POST",
    headers: await authJsonHeaders(),
    body: JSON.stringify({ role, timeframe }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to generate roadmap");
  return data as RoadmapContent & { resultId: string };
}

export async function postInterview(body: {
  role: string;
  difficulty: string;
  existing?: InterviewContent;
  resultId?: string;
}) {
  const res = await fetch("/api/interview", {
    method: "POST",
    headers: await authJsonHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to generate questions");
  return data as InterviewContent & { resultId: string };
}

export async function ensureUser() {
  const token = await getIdToken();
  if (!token) return;
  await fetch("/api/users/ensure", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
