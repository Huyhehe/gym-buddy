"use server";

import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const generateFileName = (byte = 32) =>
  crypto.randomBytes(byte).toString("hex");

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

export async function getSignedURL(fileType: string) {
  const session = await getServerAuthSession();
  if (!session) {
    return { error: "You must be logged in to access this resource" };
  }
  const allowedFileType = fileType.includes("image") ? "images" : "videos";

  const putObjectCommand = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: `uploads/${session.user.id}/${allowedFileType}/${generateFileName()}`,
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 3600,
  });

  return { signedURL };
}
