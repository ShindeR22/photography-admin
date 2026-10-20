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
  venueFee: z.coerce.number().finite().min(0, "Venue fee cannot be negative.").default(0),
  mentorFee: z.coerce.number().finite().min(0, "Mentor fee cannot be negative.").default(0),
  foodExpense: z.coerce.number().finite().min(0, "Food expense cannot be negative.").default(0),
  advertisingExpense: z.coerce.number().finite().min(0, "Advertising expense cannot be negative.").default(0),
  sponsors: z.array(z.string().trim().min(1).max(240)).max(20).default([]),
  arrangedBy: z.string().trim().max(120).default(""),
  anchorName: z.string().trim().max(120).default(""),
  guestName: z.string().trim().max(240).default(""),
  imageUrls: z.array(z.string().url("Workshop image URL is invalid.")).max(10, "A workshop can have at most 10 images.").default([]),
  imagePublicIds: z.array(z.string().min(1).max(500)).max(10).default([]),
}).refine((workshop) => workshop.imageUrls.length === workshop.imagePublicIds.length, {
  message: "Each workshop image must have a matching Cloudinary asset ID.",
  path: ["imagePublicIds"],
});
