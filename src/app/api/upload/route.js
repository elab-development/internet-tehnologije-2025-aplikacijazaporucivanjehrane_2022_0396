import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import uniqid from "uniqid";
import {jsonWithCors} from "@/libs/cors";

export async function OPTIONS(req) {
  return jsonWithCors(req, null);
}

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return jsonWithCors(req, { error: "No file" }, { status: 400 });
    }

    const bucket = process.env.AWS_S3_BUCKET || "ordering-app-iteh";
    const region = process.env.AWS_REGION || "eu-north-1";
    const accessKeyId = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_KEY;

    if (!accessKeyId || !secretAccessKey) {
      return jsonWithCors(
        req,
        { error: "Missing AWS credentials in env" },
        { status: 500 }
      );
    }

    const s3Client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name?.split(".").pop() || "bin";
    const key = `menu/${uniqid()}.${ext}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        ACL: "public-read", // ✅ BITNO: da URL radi (ako bucket policy dozvoljava)
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const link = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    return jsonWithCors(req, link);
  } catch (err) {
    console.error("Upload error:", err);
    return jsonWithCors(req, { error: "Upload failed" }, { status: 500 });
  }
}
