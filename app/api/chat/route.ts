import { NextRequest, NextResponse } from "next/server";
import { verifyBearerToken } from "@/utils/auth";
import { saveChat } from "@/utils/firestore-server";
import { careerCoachReply } from "@/lib/openai";
import type { ChatMessage } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyBearerToken(req.headers.get("authorization"));
    const body = await req.json();
    const message = body.message as string;
    const chatId = body.chatId as string | undefined;
    const history = (body.history ?? []) as ChatMessage[];

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const trimmed = message.trim();
    const messages: ChatMessage[] = [
      ...history,
      { role: "user", content: trimmed },
    ];
    const reply = await careerCoachReply(messages);
    const updated: ChatMessage[] = [
      ...messages,
      { role: "assistant", content: reply },
    ];
    const id = await saveChat(userId, chatId, updated, trimmed);

    return NextResponse.json({ reply, chatId: id, messages: updated });
  } catch (err) {
    console.error("[api/chat]", err);
    const msg = err instanceof Error ? err.message : "Chat failed";
    const status = msg.includes("Authorization") ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
