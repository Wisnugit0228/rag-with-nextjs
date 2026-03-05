"use client";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { UsersColumn } from "./users-column";
import { environment } from "@/config/environments";
import UserFormModal from "./user-form-modal";
import { set } from "zod";
import AppToast from "@/components/common/app-toast";
import { usePermission } from "@/hooks/use-permission";

export default function UsersClient({ data }: { data: User[] }) {
  const { hasPermission } = usePermission();
  const [users, setUsers] = useState<User[]>(data);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [toast, setToast] = useState({
    open: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await fetch(`/api/roles`);
      const result = await res.json();
      setRoles(result);
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (form: any) => {
    try {
      //update
      if (form.id) {
        const res = await fetch(`/api/users/${form.id}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(form),
        });

        const updated = await res.json();

        if (!res.ok) {
          setToast({
            open: true,
            title: "Error",
            message: "User updated failed",
            type: "error",
          });
          return;
        }

        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u)),
        );
        setToast({
          open: true,
          title: "Success",
          message: "User updated successfully",
          type: "success",
        });
      } else {
        //create
        const res = await fetch(`/api/auth/register`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(form),
        });

        const created = await res.json();

        if (!res.ok) {
          setToast({
            open: true,
            title: "Error",
            message: "User created failed",
            type: "error",
          });
          return;
        }

        setUsers((prev) => [...prev, created]);

        setToast({
          open: true,
          title: "Success",
          message: "User created successfully",
          type: "success",
        });
      }
      setSelected(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <>
          {hasPermission("users:create") && (
            <Button
              onClick={() => {
                setSelected(null);
                setOpen(true);
              }}
            >
              Create User
            </Button>
          )}
        </>
      </div>

      <DataTable<User>
        columns={UsersColumn({
          onEdit: (user) => {
            setSelected(user);
            setOpen(true);
          },
          onDelete: async (id) => {
            const res = await fetch(`/api/users/${id}`, {
              method: "DELETE",
            });

            const deleted = await res.json();

            if (!res.ok) {
              setToast({
                open: true,
                title: "Failed",
                message: deleted.message || "User deleted failed",
                type: "error",
              });
              return;
            }

            setUsers((r) => r.filter((x) => x.id !== id));
            setSelected(null);

            setToast({
              open: true,
              title: "Success",
              message: "User deleted successfully",
              type: "success",
            });
          },
        })}
        data={users}
      />

      <UserFormModal
        open={open}
        onOpenChange={setOpen}
        user={selected}
        roles={roles}
        onSubmit={handleSubmit}
      />

      <AppToast
        open={toast.open}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast((t) => ({
            ...t,
            open: false,
          }))
        }
      />
    </div>
  );
}
