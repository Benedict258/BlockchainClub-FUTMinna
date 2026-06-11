import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { uploadToCloudinary } from "@/lib/upload";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const uploadInputSchema = z.object({
  file: z.custom<File>((v) => v instanceof File),
  folder: z.string().min(1),
});

export const uploadFile = createServerFn({ method: "POST" })
  .validator(uploadInputSchema)
  .handler(async ({ data }) => {
    const { file, folder } = data;

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Invalid file type. Allowed: JPG, PNG, WEBP");
    }

    if (file.size > MAX_SIZE) {
      throw new Error("File size exceeds 5MB limit");
    }

    const result = await uploadToCloudinary(file, folder);
    return { url: result.url, publicId: result.publicId };
  });
