import { User } from "@/models/userModel";

export const generatePublicId = async (username: string): Promise<string> => {
  // Convert to lowercase and replace spaces with underscores
  const base = username.trim().toLowerCase().replace(/\s+/g, "_");

  // Generate a random 2-digit number
  const randomSuffix = Math.floor(Math.random() * 90) + 10; // Generates a number between 10 and 99

  let publicId = `@${base}_${randomSuffix}`;

  // Keep generating random suffix until a unique publicId is found
  while (await User.findOne({ publicId })) {
    const newRandomSuffix = Math.floor(Math.random() * 90) + 10; // Generate a new random 2-digit number
    publicId = `@${base}_${newRandomSuffix}`;
  }

  return publicId;
};
