import { z } from "zod";

export const createRegistrationSchema = z.object({
  memberId: z.string().min(1, "Select a member."),
  workshopId: z.string().min(1, "Select a workshop."),
});

export const updateRegistrationSchema = z
  .object({
    paymentStatus: z.enum(["Paid", "Pending", "Refunded"]).optional(),
    attendanceStatus: z.enum(["Registered", "Attended", "Waitlist"]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "Provide a registration update.");
