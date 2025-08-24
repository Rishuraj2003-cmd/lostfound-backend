import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.local" });
}

// ✅ Base URL detect automatically
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://lostfound-backend.onrender.com"
    : "http://localhost:5001";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET || "devsecret",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  // Frontend / Backend URLs
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  API_BASE_URL:
    process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`,

  // SMTP
  SMTP_HOST: process.env.EMAIL_HOST,
  SMTP_PORT: process.env.EMAIL_PORT,
  SMTP_USER: process.env.EMAIL_USER,
  SMTP_PASS: process.env.EMAIL_PASS,

  // Cloudinary
  CLOUDINARY_CLOUD: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: `${BASE_URL}${process.env.GOOGLE_CALLBACK_URL}`, // ✅ dynamic full URL
};
