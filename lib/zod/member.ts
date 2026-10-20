import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().trim().min(1, "Enter the member name.").max(120),
  email: z.union([z.email("Enter a valid email address."), z.literal("")]).optional().default(""),
  phone: z.union([
    z.literal(""),
    z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  ]).optional().default(""),
  address: z.string().trim().max(500).optional().default(""),
  studioName: z.string().trim().max(160).optional().default(""),
  aadhaarNumber: z.string().trim().regex(/^\d{12}$/, "Enter a valid 12-digit Aadhaar number."),
  udyamAadhaar: z.string().trim().max(40).optional().default(""),
  membershipFee: z.coerce.number().min(0).optional().default(0),
  membershipPeriodYears: z.coerce.number().int().min(1, "Membership period must be at least 1 year.").max(100),
  registrationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid registration date."),
  experienceYears: z.coerce.number().int().min(0).max(100).optional().default(0),
  bloodGroup: z.string().trim().max(5).optional().default(""),
  professions: z.array(z.string()).optional().default([]),
  camerasUsed: z.array(z.string()).optional().default([]),
  photoUrl: z.string().url("Upload the member photo."),
  aadhaarPhotoUrl: z.string().url("Upload the Aadhaar card photo."),
  udyamAadhaarPhotoUrl: z.union([z.literal(""), z.string().url()]).optional().default(""),
}).refine((member) => !member.udyamAadhaar || member.udyamAadhaarPhotoUrl, {
  message: "Upload the Udyam Aadhaar photo when a Udyam Aadhaar number is provided.",
  path: ["udyamAadhaarPhotoUrl"],
});
