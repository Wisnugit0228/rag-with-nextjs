"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreVertical,
  GripVertical,
  Trash2,
  Pencil,
  ClipboardPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Role } from "@/types/role";
import TooltipAction from "@/components/common/tooltip-action";

export const roleColumns = ({
  onEdit,
  onDelete,
  onDeletePermission,
  onAddPermission,
}: {
  onEdit: (r: Role) => void;
  onDelete: (id: string) => void;
  onDeletePermission: (roleId: string, rolePermissionId: string) => void;
  onAddPermission: (role: Role) => void;
}): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: "Role",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.original.permissions ?? [];
      const roleId = row.original.id;

      if (!permissions?.length) {
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <div className="flex flex-col gap-1 max-w-xs">
          {permissions.map((p) => {
            const [module = "-", action = "-"] =
              p.permission?.code?.split(":") || [];

            return (
              <div
                key={p.id}
                className="px-2 py-1 rounded-md bg-slate-700 text-slate-200 text-xs"
              >
                {module}:{action}
                <ConfirmDialog
                  title="Remove Permission"
                  description={`Permission ${module}:${action} akan dihapus dari role ini.`}
                  confirmText="Remove"
                  cancelText="Cancel"
                  onConfirm={() => onDeletePermission(roleId, p.id)}
                  trigger={
                    <button className="ml-2 text-red-400 hover:text-red-600 font-bold">
                      ✕
                    </button>
                  }
                />
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <TooltipAction text={"add permission"}>
          <Button size="icon" onClick={() => onAddPermission(row.original)}>
            <ClipboardPlus size={16} />
          </Button>
        </TooltipAction>

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
