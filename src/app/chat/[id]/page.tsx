"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import ChatSidebar from "./_components/chat-sidebar";
import ChatBubble from "./_components/chat-bubble";
import ChatInput from "./_components/chat-input";
import { Bot } from "lucide-react";
import { DarkmodeToggle } from "@/components/common/darkmode-toggle";

type Source = { source: string; page: number };

type Message = {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  sources?: Source[];
};

export default function ChatRoomPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch(`/api/chat/sessions/${id}/messages`);
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (question: string) => {
    const tempUserMsg: Message = {
      id: crypto.randomUUID(),
      role: "USER",
      content: question,
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await fetch(`/api/chat/sessions/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      const assistantMsg: Message = {
        ...data.message,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Pastikan parent layout memberikan h-screen atau h-full pada container ini
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Chat Area — flex column, tidak overflow ke luar */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header — tetap di atas */}
        <div className="shrink-0 border-b px-6 py-3 flex items-center gap-2 bg-background">
          <Bot className="w-5 h-5 text-primary" />
          <h1 className="font-semibold text-sm">Knowledge Base AI</h1>
          <div className="ml-auto">
            <DarkmodeToggle />
          </div>
        </div>

        {/* Messages — scroll di dalam area ini saja */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Bot className="w-12 h-12 opacity-20" />
              <p className="text-sm">Ask anything from your documents</p>
            </div>
          )}

          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              id={msg.id}
              role={msg.role}
              content={msg.content}
              sources={msg.sources}
            />
          ))}

          {/* Loading bubble */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input — shrink-0 agar selalu di bawah, tidak ikut scroll */}
        <div className="shrink-0">
          <ChatInput onSend={handleSend} loading={loading} />
        </div>
      </div>
    </div>
  );
}
