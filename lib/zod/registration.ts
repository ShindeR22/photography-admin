import { z } from "zod";

export const createRegistrationSchema = z.object({
  memberId: z.string().min(1, "Select a member."),
  workshopId: z.string().min(1, "Select a workshop."),
});

export const publicWorkshopRegistrationSchema = z.object({
  workshopId: z.string().min(1, "Select a workshop."),
  memberNumber: z.string().trim().max(40).optional().default(""),
  name: z.string().trim().max(120).optional(),
  phoneNumber: z.string().trim().max(30).optional(),
  studioName: z.string().trim().max(180).optional(),
  address: z.string().trim().max(500).optional(),
  profession: z.string().trim().max(120).optional(),
});

export const updateRegistrationSchema = z
  .object({
    paymentStatus: z.enum(["Paid", "Pending", "Refunded"]).optional(),
    attendanceStatus: z.enum(["Registered", "Attended", "Waitlist"]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "Provide a registration update.");
