import { COLLECTIONS } from "@/utils/constants";
import { generateChatTitle } from "@/utils/chat-title";
import { db, auth } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import type {
  AiResultContent,
  AiResultType,
  AtsAnalysis,
  ChatMessage,
} from "@/types";

export async function upsertUser(uid: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.users, uid);
  const snap = await getDoc(ref);

  const data = {
    id: uid,
    updatedAt: serverTimestamp(),
  };

  if (!snap.exists()) {
    await setDoc(ref, { ...data, createdAt: serverTimestamp() }, { merge: true });
  } else {
    await updateDoc(ref, data);
  }
}

export async function saveChat(
  userId: string,
  chatId: string | undefined,
  messages: ChatMessage[],
  newMessageText?: string
): Promise<string> {
  if (chatId) {
    const ref = doc(db, COLLECTIONS.chats, chatId);
    const snap = await getDoc(ref);
    if (!snap.exists() || snap.data()?.userId !== userId) {
      throw new Error("Chat not found");
    }
    await updateDoc(ref, {
      messages,
      updatedAt: serverTimestamp(),
    });
    return chatId;
  }

  const firstUser = messages.find((m) => m.role === "user");
  const title = generateChatTitle(
    newMessageText ?? firstUser?.content ?? "New chat"
  );

  const newDocRef = await addDoc(collection(db, COLLECTIONS.chats), {
    userId,
    title,
    messages,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return newDocRef.id;
}

export async function saveResume(
  userId: string,
  score: number,
  feedback: AtsAnalysis,
  meta: { fileName: string; storagePath: string }
): Promise<string> {
  const newDocRef = await addDoc(collection(db, COLLECTIONS.resumes), {
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
    createdAt: serverTimestamp(),
  });
  return newDocRef.id;
}

export async function saveAiResult(
  userId: string,
  type: AiResultType,
  label: string,
  content: AiResultContent
): Promise<string> {
  const newDocRef = await addDoc(collection(db, COLLECTIONS.aiResults), {
    userId,
    type,
    label,
    content,
    createdAt: serverTimestamp(),
  });
  return newDocRef.id;
}
