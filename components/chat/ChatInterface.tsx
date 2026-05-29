"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { useToast } from "@/components/ui/Toast";
import { postChat } from "@/utils/api";
import { fetchChatDoc } from "@/utils/firestore-client";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ChatMessage } from "@/types";

export function ChatInterface({ chatId }: { chatId?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { refresh: refreshChatList } = useChats();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [title, setTitle] = useState<string>("New chat");
  const [activeChatId, setActiveChatId] = useState<string | undefined>(chatId);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingChat, setLoadingChat] = useState(!!chatId);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveChatId(chatId);
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (!user || !chatId) {
      setLoadingChat(false);
      if (!chatId) {
        setMessages([]);
        setTitle("New chat");
      }
      return;
    }

    let cancelled = false;
    setLoadingChat(true);
    setError(null);

    (async () => {
      try {
        const doc = await fetchChatDoc(chatId, user.uid);
        if (cancelled) return;
        if (!doc) {
          setError("Chat not found");
          return;
        }
        setMessages(doc.messages);
        setTitle(doc.title);
        setActiveChatId(doc.id);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load chat");
        }
      } finally {
        if (!cancelled) setLoadingChat(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, chatId]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    setError(null);
    setSending(true);
    setInput("");

    const prior = messages;
    const optimistic: ChatMessage[] = [
      ...prior,
      { role: "user", content: text },
    ];
    setMessages(optimistic);

    try {
      const res = await postChat({
        message: text,
        chatId: activeChatId,
        history: prior,
      });
      setMessages(res.messages);
      setActiveChatId(res.chatId);
      await refreshChatList();

      if (!chatId && res.chatId) {
        router.replace(`/chat/${res.chatId}`);
        toast.success("Chat saved");
      } else {
        toast.success("Message sent");
      }
    } catch (e) {
      setMessages(prior);
      const msg = e instanceof Error ? e.message : "Failed to send";
      setError(msg);
      toast.error(msg);
    } finally {
      setSending(false);
    }
  }

  if (loadingChat) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="mb-4 border-b border-white/10 pb-4">
        <h1 className="truncate text-xl font-bold text-on-surface">{title}</h1>
        <p className="text-sm text-on-surface-variant">
          Career coach · jobs, skills, interviews
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-card/40">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {!chatId && messages.length === 0 && (
            <EmptyState
              icon="chat"
              title="Start a conversation"
              description="Ask about internships, resumes, or interview prep."
            />
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary-container text-on-primary-container"
                    : "border border-white/5 bg-surface-container text-on-surface"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/5 bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce">·</span>
                  <span className="animate-bounce [animation-delay:0.1s]">·</span>
                  <span className="animate-bounce [animation-delay:0.2s]">·</span>
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="px-6 pb-2 text-sm text-error" role="alert">
            {error}
          </p>
        )}

        <div className="border-t border-white/10 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 rounded-xl border border-white/10 bg-surface-container p-2 focus-within:border-primary/50"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message your career coach…"
              disabled={sending}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary transition hover:opacity-90 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
