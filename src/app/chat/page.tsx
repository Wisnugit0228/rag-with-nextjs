"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      // Cek dulu apakah ada session yang sudah ada
      const res = await fetch("/api/chat/sessions");
      const sessions = await res.json();

      if (sessions.length > 0) {
        // Langsung buka session terbaru
        router.replace(`/chat/${sessions[0].id}`);
      } else {
        // Buat baru hanya jika belum ada sama sekali
        const newRes = await fetch("/api/chat/sessions", { method: "POST" });
        const data = await newRes.json();
        router.replace(`/chat/${data.id}`);
      }
    };
    init();
  }, []);

  return (
    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
      Loading...
    </div>
  );
}
