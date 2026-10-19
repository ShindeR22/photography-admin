import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().trim().min(1, "Enter the member name.").max(120),
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  phone: z.string().trim().max(30).optional().default(""),
});
