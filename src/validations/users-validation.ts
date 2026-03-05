import z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "User name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("please enter a valid email"),
  password: z.string().optional(),
  role_id: z.string().min(1, "Role is required"),
});

export type UserForm = z.infer<typeof userSchema>;
