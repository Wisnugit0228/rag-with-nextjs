"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BaseModal from "@/components/common/base-modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/common/form-input";

import { Role } from "@/types/role";
import { RoleForm, roleSchema } from "@/validations/roles-validation";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  role?: Role | null;
  onSubmit: (data: RoleForm & { id?: string }) => void;
};

export default function RoleFormModal({
  open,
  onOpenChange,
  role,
  onSubmit,
}: Props) {
  const form = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (role) {
      form.reset({
        name: role.name,
        description: role.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [open, role, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit({
      ...data,
      id: role?.id,
    });
    onOpenChange(false);
  });

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={role ? "Update Role" : "Create Role"}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            form={form}
            name="name"
            label="Role Name"
            placeholder="Insert role name"
          />

          <FormInput
            form={form}
            name="description"
            label="Description"
            placeholder="Insert description"
            type="textarea"
          />

          <Button type="submit" className="w-full">
            {role ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </BaseModal>
  );
}
