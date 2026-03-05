"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: React.ReactNode;
};

export default function BaseModal({
  open,
  onOpenChange,
  title,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent className="z-[9999]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Form For {title}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
