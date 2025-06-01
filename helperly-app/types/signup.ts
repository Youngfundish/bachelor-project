import { z } from 'zod'

export const registrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" })
      .min(5, { message: "Email must be at least 5 characters long" })
      .max(50, { message: "Email must not exceed 50 characters" }),
  password: z.string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#^]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &, #, ^)" })
      .max(20, { message: "Password must be less than 20 characters" }),
});

export type RegistrationSchema = z.infer<typeof registrationSchema>;
