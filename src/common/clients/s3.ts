import { S3Client } from "@aws-sdk/client-s3";
import { CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY } from "../env";

export const BUCKET_NAME = "noah-poc";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: "https://9e88df3fe6cda6e09650915de1d31c91.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});
