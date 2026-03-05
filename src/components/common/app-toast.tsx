"use client";

import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function AppToast({
  open,
  title,
  message,
  type = "success",
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed bottom-5 right-5 z-[9999] w-[350px] animate-in slide-in-from-bottom">
      <Alert
        variant={isSuccess ? "default" : "destructive"}
        className={
          isSuccess
            ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
            : ""
        }
      >
        {isSuccess ? (
          <CheckCircle2Icon className="text-green-600" />
        ) : (
          <XCircleIcon />
        )}

        <div>
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{message}</AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
