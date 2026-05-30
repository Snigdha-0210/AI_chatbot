import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/utils/constants";
import type {
  ActivityItem,
  AiResultContent,
  AiResultDoc,
  AiResultType,
  ChatDoc,
  ChatMessage,
  DashboardStats,
  ResumeDoc,
} from "@/types";

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  return null;
}

function mapChatDoc(id: string, data: Record<string, unknown>): ChatDoc {
  return {
    id,
    userId: data.userId as string,
    title: (data.title as string) || "Untitled chat",
    messages: (data.messages as ChatMessage[]) ?? [],
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function mapResumeDoc(id: string, data: Record<string, unknown>): ResumeDoc {
  return {
    id,
    userId: data.userId as string,
    score: data.score as number,
    feedback: data.feedback as ResumeDoc["feedback"],
    fileName: data.fileName as string | undefined,
    storagePath: data.storagePath as string | undefined,
    createdAt: toDate(data.createdAt),
  };
}

function mapAiResultDoc(id: string, data: Record<string, unknown>): AiResultDoc {
  return {
    id,
    userId: data.userId as string,
    type: data.type as AiResultType,
    label: (data.label as string) || "Saved result",
    content: data.content as AiResultContent,
    createdAt: toDate(data.createdAt),
  };
}

export async function fetchChatDoc(
  chatId: string,
  userId: string
): Promise<ChatDoc | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.chats, chatId));
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.userId !== userId) return null;
  return mapChatDoc(snap.id, data);
}

export async function fetchAllChats(
  userId: string,
  max = 50
): Promise<ChatDoc[]> {
  const q = query(
    collection(db, COLLECTIONS.chats),
    where("userId", "==", userId),
    limit(max)
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => mapChatDoc(d.id, d.data()));
  // Sort descending locally to bypass Firebase composite index requirements
  return docs.sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
}

export async function fetchRecentChats(
  userId: string,
  max = 5
): Promise<ChatDoc[]> {
  return fetchAllChats(userId, max);
}

export async function fetchChatCount(userId: string): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.chats),
    where("userId", "==", userId)
  );
  const snap = await getCountFromServer(q);
  return snap.data().count;
}

export async function fetchLatestResumeScore(
  userId: string
): Promise<number | null> {
  const q = query(
    collection(db, COLLECTIONS.resumes),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docs = snap.docs.map(d => ({ score: d.data().score, createdAt: toDate(d.data().createdAt)?.getTime() ?? 0 }));
  docs.sort((a, b) => b.createdAt - a.createdAt);
  const score = docs[0]!.score;
  return typeof score === "number" ? score : null;
}

export async function fetchAllResumes(
  userId: string,
  max = 30
): Promise<ResumeDoc[]> {
  const q = query(
    collection(db, COLLECTIONS.resumes),
    where("userId", "==", userId),
    limit(max)
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => mapResumeDoc(d.id, d.data()));
  return docs.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

export async function fetchResumeById(
  resumeId: string,
  userId: string
): Promise<ResumeDoc | null> {
  const snap = await getDoc(
    doc(db, COLLECTIONS.resumes, resumeId)
  );
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.userId !== userId) return null;
  return mapResumeDoc(snap.id, data);
}

export async function fetchAiResults(
  userId: string,
  type: AiResultType,
  max = 30
): Promise<AiResultDoc[]> {
  const q = query(
    collection(db, COLLECTIONS.aiResults),
    where("userId", "==", userId),
    where("type", "==", type),
    limit(max)
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => mapAiResultDoc(d.id, d.data()));
  return docs.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

export async function fetchAiResultById(
  id: string,
  userId: string
): Promise<AiResultDoc | null> {
  const snap = await getDoc(
    doc(db, COLLECTIONS.aiResults, id)
  );
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.userId !== userId) return null;
  return mapAiResultDoc(snap.id, data);
}

export async function fetchDashboardStats(
  userId: string
): Promise<DashboardStats> {
  const [latestAtsScore, chatCount, chats, resumes] = await Promise.all([
    fetchLatestResumeScore(userId),
    fetchChatCount(userId),
    fetchRecentChats(userId, 3),
    fetchAllResumes(userId, 3),
  ]);

  const activity: ActivityItem[] = [
    ...chats.map((c) => ({
      type: "chat" as const,
      id: c.id,
      title: c.title,
      at: c.updatedAt ?? c.createdAt ?? new Date(0),
    })),
    ...resumes.map((r) => ({
      type: "resume" as const,
      id: r.id,
      title: r.fileName ?? "Resume scan",
      score: r.score,
      at: r.createdAt ?? new Date(0),
    })),
  ]
    .filter((a) => a.at.getTime() > 0)
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 6);

  return { latestAtsScore, chatCount, recentActivity: activity };
}
