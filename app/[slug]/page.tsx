import type { VDayProps } from "@/components/vday";
import VDay from "@/components/vday";
import { Redis } from "@upstash/redis";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const data = await redis.json.get<VDayProps>(`oiiaioiiai:${slug}`);

  if (data == null) {
    notFound();
  }

  return <VDay {...data} />;
}
