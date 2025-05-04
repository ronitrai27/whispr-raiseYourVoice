import { z } from "zod";

// List of valid TLDs
const validTlds = ['com', 'org', 'net', 'edu', 'gov', 'co', 'io', 'ai'];

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format") 
    .refine((email) => {
      const domain = email.split('@')[1]; 
      const tld = domain?.split('.').pop(); 
      return tld ? validTlds.includes(tld) : false; 
    }, {
      message: "Invalid email ", 
    })
    .optional(),
});
