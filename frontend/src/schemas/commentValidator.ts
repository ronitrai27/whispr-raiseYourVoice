import { z } from 'zod';

// Zod schema for comment
export const CommentSchema = z.object({
  thought: z
    .string()
    .trim()
    .refine(
      (val) => {
        const wordCount = val.trim().split(/\s+/).filter(Boolean).length;
        return wordCount >= 10 && wordCount <= 250;
      },
      {
        message: 'Comment must be between 10 and 250 words',
      }
    ),
  topics: z
    .array(
      z.string().regex(/^#[a-z0-9]+$/, {
        message: 'Hashtags must start with # and contain only lowercase letters or numbers',
      })
    )
    .max(10, { message: 'Maximum 10 Topic allowed' })
    .min(1, { message: 'Minimum 1 Topic is required' })
    .default([]),
  isPublic: z.boolean().default(true),
});

// Type for validated comment data
export type CommentFormData = z.infer<typeof CommentSchema>;

// Validation function
export const validateComment = (data: unknown) => {
  return CommentSchema.safeParse(data);
};