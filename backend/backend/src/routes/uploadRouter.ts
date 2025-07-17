import express from "express";
import multer from "multer";
import AWS from "aws-sdk";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

const BUCKET = process.env.S3_BUCKET_NAME as string;

// POST /api/upload
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const params = {
    Bucket: BUCKET,
    Key: `${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return res.json({ url: data.Location });
  } catch (err) {
    console.error("S3 upload error:", err);
    return res.status(500).json({ error: "Failed to upload file" });
  }
});

export default router;

