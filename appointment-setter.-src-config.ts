import "dotenv/config";
import { z } from "zod";

// Fail fast and loud at startup if a required secret is missing,
// instead of failing silently mid-job three hours into a cron run.
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.string().default("info"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  YOUR_BUSINESS_NAME: z.string().min(1),
  YOUR_CONTACT_EMAIL: z.string().email(),
  YOUR_PHONE_NUMBER: z.string().min(1),
  BOOKING_LINK: z.string().url(),

  GOOGLE_MAPS_API_KEY: z.string().min(1),
  LEAD_SEARCH_QUERIES: z.string().min(1),
  LEAD_SEARCH_RADIUS_METERS: z.coerce.number().default(15000),

  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),

  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),

  TWILIO_ACCOUNT_SID: z.string().optional().default(""),
  TWILIO_AUTH_TOKEN: z.string().optional().default(""),
  TWILIO_FROM_NUMBER: z.string().optional().default(""),

  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_ID: z.string().min(1),
  STRIPE_SUCCESS_URL: z.string().url(),
  STRIPE_CANCEL_URL: z.string().url(),

  MAX_OUTREACH_PER_RUN: z.coerce.number().default(50),
  DRY_RUN: z.coerce.boolean().default(true),
ADMIN_API_KEY: z.string().min(16, "ADMIN_API_KEY must be at least 16 characters"),});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

// Parsed list of "trade in location" search queries for Google Places.
export const leadSearchQueries = env.LEAD_SEARCH_QUERIES.split(",").map((q) =>
  q.trim()
);
