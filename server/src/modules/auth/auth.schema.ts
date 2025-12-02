import { z } from "zod";

export const AuthSchema = z.object({
    email: z.string().email({ message: "Invalid mail address"}),
    password: z.string().min(6, "Password must contain at least 6 characters")
});
