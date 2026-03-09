"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

type Props = {
  status: string;
};

type StatusConfig = {
  label: string;
  variant: "default" | "secondary" | "destructive";
  icon: React.ReactNode;
};

const statusConfig: Record<string, StatusConfig> = {
  READY: {
    label: "Ready",
    variant: "default",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  PROCESSING: {
    label: "Processing",
    variant: "secondary",
    icon: <Clock className="w-3 h-3" />,
  },
  FAILED: {
    label: "Failed",
    variant: "destructive",
    icon: <XCircle className="w-3 h-3" />,
  },
};

export default function DocumentStatusBadge({ status }: Props) {
  const config: StatusConfig = statusConfig[status] ?? {
    label: status,
    variant: "secondary",
    icon: null,
  };

  return (
    <Badge variant={config.variant} className="gap-1 text-xs">
      {config.icon}
      {config.label}
    </Badge>
  );
}
