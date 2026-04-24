import z from "zod";

// REGISTER FORM SCHEMA
export const registerFormSchema = z
  .object({
    name: z.string().nonempty(),
    email: z.email().nonempty(),
    password: z.string().nonempty().min(10),
    confirmPassword: z.string(),
    isHost: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

export type RegisterUserInputs = z.infer<typeof registerFormSchema>;

// LOGIN FORM SCHEMA
export const loginFormSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty(),
});

export type LoginUserInputs = z.infer<typeof loginFormSchema>;
