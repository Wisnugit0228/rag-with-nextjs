"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { roleColumns } from "./roles-column";
import RoleFormModal from "./role-form-modal";
import { Role } from "@/types/role";
import AppToast from "@/components/common/app-toast";
import { environment } from "@/config/environments";
import { string } from "zod";
import AddPermissionModal from "./add-permission-form-modal";
import { usePermission } from "@/hooks/use-permission";

type RoleForm = Omit<Role, "id"> & {
  id?: string;
};

export default function RolesClient({ data }: { data: Role[] }) {
  const { hasPermission } = usePermission();
  const [roles, setRoles] = useState<Role[]>(data);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const [selected, setSelected] = useState<Role | null>(null);
  const [toast, setToast] = useState({
    open: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [permissions, setPermissions] = useState<
    { id: string; code: string }[]
  >([]);
  const [openPermission, setOpenPermission] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleSubmit = async (form: RoleForm) => {
    try {
      if (form.id) {
        // UPDATE
        const res = await fetch(`/api/roles/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const err = await res.json();
          setToast({
            open: true,
            title: "Error",
            message: "Role updated failed",
            type: "error",
          });
          return;
        }
        const updated = await res.json();

        setRoles((r) => r.map((x) => (x.id === updated.id ? updated : x)));
        setToast({
          open: true,
          title: "Success",
          message: "Role updated successfully",
          type: "success",
        });
      } else {
        // CREATE
        const res = await fetch(`/api/roles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const err = await res.json();
          setAlert(err.message);
          return;
        }
        const created = await res.json();

        setRoles((r) => [...r, created]);
        setToast({
          open: true,
          title: "Success",
          message: "Role created successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePermission = async (
    roleId: string,
    rolePermissionId: string,
  ) => {
    try {
      const res = await fetch(`/api/role-permissions/${rolePermissionId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          title: "Failed",
          message: result.message || "Role permission deleted failed",
          type: "error",
        });
        return;
      }

      setRoles((prev) =>
        prev.map((role) =>
          role.id === roleId
            ? {
                ...role,
                permissions: role.permissions?.filter(
                  (p) => p.id !== rolePermissionId,
                ),
              }
            : role,
        ),
      );

      setToast({
        open: true,
        title: "Success",
        message: "Permission removed successfully",
        type: "success",
      });
    } catch (error: any) {
      setToast({
        open: true,
        title: "Error",
        message: "Network error",
        type: "error",
      });
    }
  };

  const handleAddPermission = async (payload: {
    role_id: string;
    permission_id: string;
  }) => {
    try {
      const res = await fetch(`/api/role-permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          title: "Failed",
          message: result.message || "Role permission added failed",
          type: "error",
        });
        return;
      }

      setRoles((prev) =>
        prev.map((role) => (role.id === result.id ? result : role)),
      );

      setToast({
        open: true,
        title: "Success",
        message: "Permission added successfully",
        type: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch(`/api/permissions`);
        const data = await res.json();
        setPermissions(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPermissions();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <>
          {hasPermission("roles:create") && (
            <Button
              onClick={() => {
                setSelected(null);
                setOpen(true);
              }}
            >
              Create Role
            </Button>
          )}
        </>
      </div>

      <DataTable<Role>
        columns={roleColumns({
          onEdit: (r) => {
            setSelected(r);
            setOpen(true);
          },
          onDelete: async (id) => {
            const res = await fetch(`/api/roles/${id}`, {
              method: "DELETE",
            });

            const deleted = await res.json();

            if (!res.ok) {
              setToast({
                open: true,
                title: "Failed",
                message: deleted.message || "Role deleted failed",
                type: "error",
              });
              return;
            }

            setRoles((r) => r.filter((x) => x.id !== id));
            setSelected(null);

            setToast({
              open: true,
              title: "Success",
              message: "Role deleted successfully",
              type: "success",
            });
          },
          onDeletePermission: handleDeletePermission,
          onAddPermission: (role) => {
            setSelectedRole(role);
            setOpenPermission(true);
          },
        })}
        data={roles}
      />

      <RoleFormModal
        open={open}
        onOpenChange={setOpen}
        role={selected}
        onSubmit={handleSubmit}
      />

      <AddPermissionModal
        open={openPermission}
        onOpenChange={(v) => {
          setOpenPermission(v);
          if (!v) setSelectedRole(null);
        }}
        role={selectedRole}
        permissions={permissions}
        onSubmit={handleAddPermission}
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
