import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Middleware for rate limiting
const ratelimitMiddleware = async (req) => {
  if (!redis) return true;

  const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(20, "1440 m"),
    analytics: true,
  });

  const headersList = headers();
  const ipIdentifier = headersList.get("x-real-ip");
  const result = await ratelimit.limit(ipIdentifier ?? "");

  if (!result.success) {
    return new Response(
      "Too many uploads in 1 day. Please try again in 24 hours.",
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": result.limit,
          "X-RateLimit-Remaining": result.remaining,
        },
      }
    );
  }
  return true;
};

export async function POST(request) {
  const rateLimitResponse = await ratelimitMiddleware(request);
  if (rateLimitResponse !== true) return rateLimitResponse;

  try {
    const { imageUrl, theme, prompt } = await request.json();
    const jobId = uuidv4();
    await redis.set(jobId, JSON.stringify({ status: "queued", result: null }));

    // Send the task to a background worker or task queue
    processImageGeneration(jobId, imageUrl, theme, prompt);

    return NextResponse.json({ jobId });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function processImageGeneration(jobId, imageUrl, theme, prompt) {
  try {
    const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        version: "f203e9b8755a51b23f8ebdd80bb4f8b7177685b8d3fcca949abfbf8606b6d42a",
        input: {
          image: imageUrl,
          clothing: theme === "Top Wear" ? "topwear" : "bottomwear",
          prompt: `a person wearing ${prompt}`,
        },
      }),
    });

    const jsonStartResponse = await startResponse.json();
    const endpointUrl = jsonStartResponse.urls.get;

    // Implement polling in a separate worker or task queue
    pollForResult(jobId, endpointUrl);
  } catch (error) {
    console.error("Error processing image generation:", error);
    await redis.set(jobId, JSON.stringify({ status: "failed", result: null }));
  }
}

async function pollForResult(jobId, endpointUrl) {
  let restoredImage = null;
  let attempts = 0;
  const maxAttempts = 60;

  while (!restoredImage && attempts < maxAttempts) {
    attempts += 1;
    console.log("Polling for result...");

    try {
      const finalResponse = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        },
      });

      const jsonFinalResponse = await finalResponse.json();

      if (jsonFinalResponse.status === "succeeded") {
        restoredImage = jsonFinalResponse.output;
        await redis.set(jobId, JSON.stringify({ status: "completed", result: restoredImage }));
      } else if (jsonFinalResponse.status === "failed") {
        await redis.set(jobId, JSON.stringify({ status: "failed", result: null }));
        break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error polling for result:", error);
      await redis.set(jobId, JSON.stringify({ status: "failed", result: null }));
      break;
    }
  }

  if (!restoredImage) {
    await redis.set(jobId, JSON.stringify({ status: "failed", result: null }));
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return new Response("Job ID is required", { status: 400 });
  }

  try {
    const jobData = await redis.get(jobId);

    if (!jobData) {
      return new Response("Job not found", { status: 404 });
    }

    const { status, result } = JSON.parse(jobData);
    return NextResponse.json({ status, result });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
