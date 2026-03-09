import { cn } from "@/lib/utils";
import { Bot, User, FileText } from "lucide-react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";

type Source = {
  source: string;
  page: number;
};

type Props = {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  sources?: Source[];
};

export default function ChatBubble({ id, role, content, sources }: Props) {
  const isUser = role === "USER";
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleFeedback = async (rating: number, type: "up" | "down") => {
    setFeedback(type);
    await fetch(`/api/chat/sessions/messages/${id}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
  };

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted border",
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={cn("flex flex-col gap-2 max-w-[75%]", isUser && "items-end")}
      >
        {/* Bubble */}
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm",
          )}
        >
          <p className="whitespace-pre-wrap">{content}</p>
        </div>

        {/* Sources */}
        {!isUser && sources && sources.length > 0 && (
          <div className="w-full space-y-1">
            <p className="text-xs text-muted-foreground font-medium px-1">
              Sources:
            </p>
            {sources.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300"
              >
                <span className="w-4 h-4 rounded bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {i + 1}
                </span>
                <FileText className="w-3 h-3 shrink-0" />
                <span className="truncate">{s.source}</span>
                {s.page && (
                  <span className="ml-auto shrink-0 text-blue-400">
                    p.{s.page}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Feedback */}
        {!isUser && (
          <div className="flex gap-1 px-1">
            <button
              onClick={() => handleFeedback(5, "up")}
              className={cn(
                "p-1 rounded hover:bg-muted transition-colors",
                feedback === "up" && "text-green-500",
              )}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleFeedback(1, "down")}
              className={cn(
                "p-1 rounded hover:bg-muted transition-colors",
                feedback === "down" && "text-red-500",
              )}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
