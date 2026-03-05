"use client";

import BaseModal from "@/components/common/base-modal";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { User } from "@/types/user";
import { UserForm, userSchema } from "@/validations/users-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user?: User | null;
  onSubmit: (data: UserForm & { id?: string }) => void;
  roles: { id: string; name: string }[];
};

export default function UserFormModal({
  open,
  onOpenChange,
  user,
  onSubmit,
  roles,
}: Props) {
  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role_id: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (user) {
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        role_id: user.role?.id ?? "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        role_id: "",
      });
    }
  }, [open, user, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit({
      ...data,
      id: user?.id,
    });
    onOpenChange(false);
  });

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={user ? "Edit User" : "Add User"}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            form={form}
            name="name"
            label="Name"
            placeholder="Inser user name"
          />

          <FormInput
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="Insert user email"
          />

          <FormSelect
            form={form}
            name="role_id"
            label="Role"
            placeholder="Select Role"
            options={roles.map((r) => ({
              label: r.name,
              value: r.id ?? "",
            }))}
          />

          {!user && (
            <FormInput
              form={form}
              name="password"
              label="Password"
              type="password"
              placeholder="******"
            />
          )}

          <Button type="submit" className="w-full">
            {user ? "update" : "create"}
          </Button>
        </form>
      </Form>
    </BaseModal>
  );
}
