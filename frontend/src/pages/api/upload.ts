import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File } from "formidable";
import cloudinary from "@/helpers/cloudinary";
import { unlink } from "fs/promises";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const uploadDir = path.join(process.cwd(), "tmp");
    await fs.mkdir(uploadDir, { recursive: true });

    const data = await new Promise<{ file: File | File[] }>((resolve, reject) => {
      const form = new IncomingForm({
        multiples: false,
        keepExtensions: true,
        uploadDir,
        maxFileSize: 5 * 1024 * 1024, // 5MB limit
        filter: ({ mimetype }) => mimetype?.startsWith("image/") || false, // Only images
      });
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Formidable error:", err);
          return reject(err);
        }
        // console.log("Formidable fields:", fields);
        // console.log("Formidable files:", files);
        resolve({ file: files.file });
      });
    });

    // Handle file as array and extract first item
    const file = Array.isArray(data.file) ? data.file[0] : data.file;
    if (!file || !file.filepath) {
      console.log("No valid file detected:", data);
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: "profile_pics",
      resource_type: "image",
    });

    await unlink(file.filepath).catch((err) =>
      console.warn("Failed to delete temp file:", err)
    );

    res.status(200).json({ message: "✅ Upload successful", url: result.secure_url });
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
}