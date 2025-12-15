import { z } from "zod";

// Sanitize string to prevent XSS - removes HTML tags and trims
const sanitizeString = (str: string) => str.replace(/<[^>]*>/g, '').trim();

// Submit form validation schema
export const submitFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .transform(sanitizeString),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .transform(sanitizeString),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(50000, "Content must be less than 50,000 characters"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters")
    .transform(sanitizeString),
  customCategory: z
    .string()
    .max(50, "Custom category must be less than 50 characters")
    .transform(sanitizeString)
    .optional(),
  tags: z
    .string()
    .max(500, "Tags must be less than 500 characters")
    .transform((val) => {
      const tags = val.split(",").map((tag) => sanitizeString(tag)).filter(Boolean);
      if (tags.length > 10) {
        throw new Error("Maximum 10 tags allowed");
      }
      // Each tag max 30 chars, alphanumeric + hyphens + spaces
      return tags.filter(tag => tag.length <= 30 && /^[a-zA-Z0-9\s-]+$/.test(tag));
    }),
  language: z
    .string()
    .max(50, "Language must be less than 50 characters")
    .transform(sanitizeString)
    .optional(),
  framework: z
    .string()
    .max(50, "Framework must be less than 50 characters")
    .transform(sanitizeString)
    .optional(),
  contentType: z
    .string()
    .min(1, "Content type is required")
    .max(50, "Content type must be less than 50 characters")
    .transform(sanitizeString),
  customContentType: z
    .string()
    .max(50, "Custom content type must be less than 50 characters")
    .transform(sanitizeString)
    .optional(),
  url: z
    .string()
    .max(500, "URL must be less than 500 characters")
    .refine((val) => !val || /^https?:\/\/.+/.test(val), "URL must be a valid HTTP(S) URL")
    .optional(),
  buttonText: z
    .string()
    .max(50, "Button text must be less than 50 characters")
    .transform(sanitizeString)
    .optional(),
});

// Profile form validation schema
export const profileFormSchema = z.object({
  username: z
    .string()
    .max(50, "Username must be less than 50 characters")
    .refine((val) => !val || /^[a-zA-Z0-9_-]+$/.test(val), "Username can only contain letters, numbers, underscores, and hyphens")
    .optional()
    .nullable(),
  display_name: z
    .string()
    .max(100, "Display name must be less than 100 characters")
    .transform(sanitizeString)
    .optional()
    .nullable(),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .transform(sanitizeString)
    .optional()
    .nullable(),
  avatar_url: z
    .string()
    .max(500, "Avatar URL must be less than 500 characters")
    .refine((val) => !val || /^https?:\/\/.+/.test(val), "Avatar URL must be a valid HTTP(S) URL")
    .optional()
    .nullable(),
});

export type SubmitFormData = z.infer<typeof submitFormSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
