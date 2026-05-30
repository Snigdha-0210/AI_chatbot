import type {
  AtsAnalysis,
  ChatMessage,
  InterviewContent,
  CareerRoadmap,
  BulletImproverDoc,
} from "@/types";

const jsonHeaders = {
  "Content-Type": "application/json",
};

export async function postChat(body: {
  message: string;
  chatId?: string;
  history?: ChatMessage[];
  userId: string;
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Chat failed");
  return json.data as {
    reply: string;
    chatId: string;
    messages: ChatMessage[];
  };
}

export async function postAts(file: File, jobDescription: string, userId: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("jobDescription", jobDescription);
  form.append("userId", userId);

  const res = await fetch("/api/ats", {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "ATS scan failed");
  return json.data as AtsAnalysis & { resumeId: string };
}

export async function postImproveBullet(bullet: string, userId: string) {
  const res = await fetch("/api/improve-bullet", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ bullet, userId }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to improve bullet");
  return json.data as BulletImproverDoc;
}

export async function postRoadmap(roleId: string, year: string, level: string) {
  const res = await fetch("/api/roadmap", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ roleId, year, level }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to load roadmap");
  return json.data as CareerRoadmap;
}

export async function postInterview(roleId: string, level: string) {
  const res = await fetch("/api/interview", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ roleId, level }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to load interview data");
  return json.data;
}

export async function postInterviewV2(roleId: string, type: "subjects" | "coding" | "viva" | "companies" | "all" = "all") {
  const res = await fetch("/api/interview-v2", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ roleId, type }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to load V2 interview data");
  return json.data;
}

export async function getInterviewTopic(roleId: string, topicSlug: string) {
  const res = await fetch(`/api/interview-topic?roleId=${roleId}&topicSlug=${topicSlug}`, {
    method: "GET",
    headers: jsonHeaders
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to load detailed topic page");
  return json.data;
}

export async function ensureUser() {
  // Bypassed for development
  return;
}
