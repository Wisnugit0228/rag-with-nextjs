"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import TooltipAction from "@/components/common/tooltip-action";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { GripVertical, Pencil, Trash2, Users } from "lucide-react";

export const UsersColumn = ({
  onEdit,
  onDelete,
}: {
  onEdit: (u: User) => void;
  onDelete: (id: string) => void;
}): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex item-center gap-3">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.role?.name}</span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <TooltipAction text="edit">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onEdit(row.original)}
          >
            <Pencil size={16} />
          </Button>
        </TooltipAction>

        <div className="relative">
          <TooltipAction text="delete">
            <span>
              <ConfirmDialog
                title="Delete Role"
                description={`Role "${row.original.name}" akan dihapus permanen.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => onDelete(row.original.id)}
                trigger={
                  <Button size="icon" variant="destructive">
                    <Trash2 size={16} />
                  </Button>
                }
              />
            </span>
          </TooltipAction>
        </div>
      </div>
    ),
  },
];
