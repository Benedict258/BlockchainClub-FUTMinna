import { v2 as cloudinary } from "cloudinary";

function getConfiguredCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<{ url: string; publicId: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const client = getConfiguredCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(
  publicId: string
): Promise<{ result: string }> {
  const client = getConfiguredCloudinary();
  const result = await client.uploader.destroy(publicId);
  return { result: result.result };
}

export function getOptimizedUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  const client = getConfiguredCloudinary();
  const transformations: Record<string, string | number>[] = [
    { quality: "auto", fetch_format: "auto" },
  ];

  if (width) transformations.push({ width });
  if (height) transformations.push({ height });
  if (width && height) transformations.push({ crop: "fill" });

  return client.url(publicId, {
    transformation: transformations,
    secure: true,
  });
}
