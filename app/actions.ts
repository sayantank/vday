"use server";

import { Redis } from "@upstash/redis";
import { z } from "zod";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const formSchema = z.object({
  to: z.string().min(1, "recipient name is required"),
  from: z.string().min(1, "your name is required"),
  message: z.string().min(1, "message is required").max(500, "Message is too long"),
  slug: z
    .string()
    .min(1, "card name is required")
    .max(16, "cardname must be 16 characters or less")
    .regex(/^[a-z0-9-]+$/, "card name can only contain lowercase letters, numbers, and hyphens"),
});

export async function saveValentine(_: any, formData: FormData) {
  const validatedFields = formSchema.safeParse({
    to: formData.get("to"),
    from: formData.get("from"),
    message: formData.get("message"),
    slug: formData.get("slug"),
  });

  if (!validatedFields.success) {
    console.error("Failed to save valentine", validatedFields.error);
    return { error: validatedFields.error.errors[0].message };
  }

  const { data } = validatedFields;

  try {
    // Check if slug exists
    const exists = await redis.exists(`oiiaioiiai:${data.slug}`);
    if (exists) {
      return { error: "try another card name" };
    }

    await redis.json.set(`oiiaioiiai:${data.slug}`, "$", {
      to: data.to,
      from: data.from,
      message: data.message,
    });
    return { success: true, slug: data.slug };
  } catch (error) {
    // Keep this error log as it's useful for debugging Redis issues
    console.error("Redis error:", error);
    return { error: "Failed to save valentine" };
  }
}
