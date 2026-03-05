"use client";

import BaseModal from "@/components/common/base-modal";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  role?: {
    id: string;
    name: string;
    permissions?: {
      permissionId: string;
      permission?: { id: string; code: string };
    }[];
  } | null;
  permissions: { id: string; code: string }[];
  onSubmit: (data: { role_id: string; permission_id: string }) => void;
};

type FormValues = {
  permission_id: string;
};

export default function AddPermissionModal({
  open,
  onOpenChange,
  role,
  permissions,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      permission_id: "",
    },
  });

  const filteredPermissions = (permissions ?? []).filter(
    (p) => !(role?.permissions ?? []).some((rp) => rp.permission?.id === p.id),
  );

  const handleSubmit = form.handleSubmit((data) => {
    if (!role) return;

    onSubmit({
      role_id: role.id,
      permission_id: data.permission_id,
    });

    onOpenChange(false);
  });

  useEffect(() => {
    if (open) {
      form.reset({ permission_id: "" });
    }
  }, [open]);

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} title="Add Permission">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Role</label>
              <Input value={role?.name || ""} disabled />
            </div>
            <div className="space-y-2 w-full">
              <FormSelect
                form={form}
                name="permission_id"
                label="Permission"
                placeholder="Select Permission"
                options={filteredPermissions.map((p) => ({
                  label: p.code,
                  value: p.id,
                }))}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Permission
          </Button>
        </form>
      </Form>
    </BaseModal>
  );
}
