import { z } from "zod";

export const verifySchema = z.object({
    code: z.string()
        .min(6, "Verification code must be 6 digits")
        .max(6, "Verification code must be 6 digits")
        .regex(/^\d{6}$/, "Verification code must contain only numbers")
})