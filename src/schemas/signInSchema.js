import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address format" }),
    password: z.string().min(1, "Password is required")
});