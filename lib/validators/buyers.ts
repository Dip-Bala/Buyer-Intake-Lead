import { z } from "zod";

export const CityEnum = z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]);
export const PropertyTypeEnum = z.enum(["Apartment", "Villa", "Plot", "Office", "Retail"]);
export const BHKEnum = z.enum(["Studio", "One", "Two", "Three", "Four"]);
export const PurposeEnum = z.enum(["Buy", "Rent"]);
export const TimelineEnum = z.enum([
  "ZERO_TO_THREE_MONTHS",
  "THREE_TO_SIX_MONTHS",
  "SIX_PLUS_MONTHS",
  "EXPLORING",
]);
export const SourceEnum = z.enum(["Website", "Referral", "Walk_in", "Call", "Other"]);

export const createBuyerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    city: CityEnum,
    propertyType: PropertyTypeEnum,
    bhk: BHKEnum.optional(),
    purpose: PurposeEnum,
    budgetMin: z.coerce.number().optional(),
    budgetMax: z.coerce.number().optional(),
    timeline: TimelineEnum,
    source: SourceEnum,
    notes: z.string().optional(),
    tags: z
      .string()
      .transform((val) => val.split(",").map((t) => t.trim()))
      .optional(),
  })
  .superRefine(({ budgetMin, budgetMax }, ctx) => {
    if (budgetMin && budgetMax && budgetMin > budgetMax) {
      ctx.addIssue({
        code: "custom",
        path: ["budgetMax"],
        message: "Max budget must be greater than Min budget",
      });
    }
  });

export type CreateBuyerInput = z.infer<typeof createBuyerSchema>;
