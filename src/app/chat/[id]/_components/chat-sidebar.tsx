"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatSession = {
  id: string;
  createdAt: string;
  chatMessages: { content: string; role: string }[];
};

export default function ChatSidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const router = useRouter();
  const { id } = useParams();

  const fetchSessions = async () => {
    const res = await fetch("/api/chat/sessions");
    const data = await res.json();
    setSessions(data);
  };

  useEffect(() => {
    fetchSessions();
  }, [id]);

  const handleNewChat = async () => {
    const res = await fetch("/api/chat/sessions", { method: "POST" });
    const data = await res.json();
    router.push(`/chat/${data.id}`);
  };

  const getSessionTitle = (session: ChatSession) => {
    const firstUserMsg = session.chatMessages?.find((m) => m.role === "USER");

    if (firstUserMsg) {
      return (
        firstUserMsg.content.slice(0, 30) +
        (firstUserMsg.content.length > 30 ? "..." : "")
      );
    }

    // fallback jika belum ada pesan
    return new Date(session.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full w-64 border-r bg-muted/20">
      {/* Header */}
      <div className="p-4 border-b">
        <Button onClick={handleNewChat} className="w-full gap-2" size="sm">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <p className="text-xs text-muted-foreground px-2 py-1 font-medium">
          Recent Chats
        </p>
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => router.push(`/chat/${session.id}`)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-muted transition-colors",
              id === session.id && "bg-muted font-medium",
            )}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{getSessionTitle(session)}</span>
          </button>
        ))}

        {sessions.length === 0 && (
          <p className="text-xs text-muted-foreground px-2 py-4 text-center">
            No chat history yet
          </p>
        )}
      </div>
    </div>
  );
}
