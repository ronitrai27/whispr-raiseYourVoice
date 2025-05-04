// import { z } from 'zod';

// export const otpSchema = z.object({
//   otp: z
//     .string()
//     .regex(/^[0-9]{6}$/, "OTP must be exactly 6 digits") 
//     .min(6, "OTP must be 6 digits")
//     .max(6, "OTP must be 6 digits"), 
// });

// export type OTPFormData = z.infer<typeof otpSchema>;
// schema/otpSchema.ts
import { z } from "zod";

export const otpSchema = z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be numeric");

