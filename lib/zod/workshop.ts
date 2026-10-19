import { z } from "zod";

const workshopDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid workshop date.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Choose a valid workshop date.");

export const workshopSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a workshop title.")
    .max(120, "Title must be 120 characters or fewer."),
  date: workshopDateSchema,
  venue: z
    .string()
    .trim()
    .min(1, "Enter a venue.")
    .max(180, "Venue must be 180 characters or fewer."),
  registrationFee: z.coerce.number().finite().min(0, "Registration fee cannot be negative."),
  description: z
    .string()
    .trim()
    .min(1, "Enter a description.")
    .max(2000, "Description must be 2000 characters or fewer."),
  mentorName: z
    .string()
    .trim()
    .min(1, "Enter the mentor name.")
    .max(120, "Mentor name must be 120 characters or fewer."),
  time: z
    .string()
    .trim()
    .min(1, "Enter the workshop time.")
    .max(80, "Workshop time must be 80 characters or fewer."),
});
