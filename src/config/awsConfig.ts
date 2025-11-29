import { S3Client } from "@aws-sdk/client-s3";

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export function safeFileKey(
  userId: number | undefined,
  title: string,
  type: "cover" | "poster",
  originalName?: string
) {
  const safeTitle = (title || "sem-titulo").replace(/\s+/g, "_");
  const safeName = originalName?.replace(/\s+/g, "_") || `${uuidv4()}.jpg`;
  return `usuarios/${
    userId || "anon"
  }/movies/${safeTitle}/${type}/${uuidv4()}-${safeName}`;
}

export async function uploadFileToS3(file?: Express.Multer.File, key?: string) {
  if (!file || !file.buffer) return null;
  if (!key) throw new Error("S3 key não fornecida.");

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "application/octet-stream",
    })
  );

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
