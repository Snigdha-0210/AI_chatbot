import { FieldValue } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/utils/constants";
import { generateChatTitle } from "@/utils/chat-title";
import { getAdminAuth, getAdminDb } from "@/utils/firebase-admin";
import type {
  AiResultContent,
  AiResultType,
  AtsAnalysis,
  ChatMessage,
} from "@/types";

export async function upsertUser(uid: string): Promise<void> {
  const record = await getAdminAuth().getUser(uid);
  const db = getAdminDb();
  const ref = db.collection(COLLECTIONS.users).doc(uid);
  const snap = await ref.get();

  const data = {
    id: uid,
    name: record.displayName ?? null,
    email: record.email ?? null,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (!snap.exists) {
    await ref.set({ ...data, createdAt: FieldValue.serverTimestamp() });
  } else {
    await ref.update(data);
  }
}

export async function saveChat(
  userId: string,
  chatId: string | undefined,
  messages: ChatMessage[],
  newMessageText?: string
): Promise<string> {
  const db = getAdminDb();

  if (chatId) {
    const ref = db.collection(COLLECTIONS.chats).doc(chatId);
    const snap = await ref.get();
    if (!snap.exists || snap.data()?.userId !== userId) {
      throw new Error("Chat not found");
    }
    await ref.update({
      messages,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return chatId;
  }

  const firstUser = messages.find((m) => m.role === "user");
  const title = generateChatTitle(
    newMessageText ?? firstUser?.content ?? "New chat"
  );

  const doc = await db.collection(COLLECTIONS.chats).add({
    userId,
    title,
    messages,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return doc.id;
}

export async function saveResume(
  userId: string,
  score: number,
  feedback: AtsAnalysis,
  meta: { fileName: string; storagePath: string }
): Promise<string> {
  const doc = await getAdminDb().collection(COLLECTIONS.resumes).add({
    userId,
    score,
    feedback: {
      missingKeywords: feedback.missingKeywords,
      strengths: feedback.strengths,
      weaknesses: feedback.weaknesses,
      suggestions: feedback.suggestions,
    },
    fileName: meta.fileName,
    storagePath: meta.storagePath,
    createdAt: FieldValue.serverTimestamp(),
  });
  return doc.id;
}

export async function saveAiResult(
  userId: string,
  type: AiResultType,
  label: string,
  content: AiResultContent
): Promise<string> {
  const doc = await getAdminDb().collection(COLLECTIONS.aiResults).add({
    userId,
    type,
    label,
    content,
    createdAt: FieldValue.serverTimestamp(),
  });
  return doc.id;
}
