import Anthropic from "@anthropic-ai/sdk";
import { Redis } from "@upstash/redis";
import { makeEvent } from "@/lib/analytics";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();
const anthropic = new Anthropic();

const STYLE_TAXONOMY = `
Named architectural styles: Mid-Century Modern, Ranch, Brutalist, Craftsman, Modern Farmhouse, Colonial, Mediterranean, Minimalist, Victorian, Tudor.

"No distinct style" references (for comparison): Tract home, Builder-grade, McMansion, 1990s suburban, Generic American, Awkward/mismatched renovation, Overbuilt suburban.
`.trim();

const CLAUDE_PROMPT = `You are an architectural style classifier and educator helping people learn about home design. Analyze the home image and any listing context provided.

${STYLE_TAXONOMY}

Respond with ONLY valid JSON — no markdown, no explanation outside the JSON. Use this exact shape:
{
  "primaryStyle": "Craftsman",
  "secondaryStyle": "Arts & Crafts or null",
  "topStyles": [
    { "style": "Craftsman", "confidence": 82 },
    { "style": "Arts & Crafts", "confidence": 11 },
    { "style": "Colonial Revival", "confidence": 4 }
  ],
  "styleClarity": 8,
  "designQuality": 7,
  "clues": [
    "Wide front porch with tapered columns on stone bases",
    "Exposed rafter tails under the eave",
    "Natural wood siding with earthy tone palette"
  ],
  "education": "2-3 sentences explaining this style for someone who knows nothing about architecture. What movement gave rise to it, what makes it distinctive, why people love it.",
  "era": "1910s–1930s",
  "noDistinctStyle": false
}

styleClarity (0-10): how strongly does this match a named style? 0 = generic tract home, 10 = textbook example.
designQuality (0-10): how well-executed and architecturally coherent is the design? 0 = McMansion/builder-grade, 10 = masterwork.
clues: 3-5 specific visual features that led to your classification — be specific and educational.
noDistinctStyle: true if this is clearly a generic/builder home with no strong architectural identity.`;

type ClassifyResult = {
  primaryStyle: string;
  secondaryStyle: string | null;
  topStyles: Array<{ style: string; confidence: number }>;
  styleClarity: number;
  designQuality: number;
  clues: string[];
  education: string;
  era: string;
  noDistinctStyle: boolean;
};

async function classifyWithClaude(
  imageSource: { type: "url"; url: string } | { type: "base64"; media_type: string; data: string },
  textContext: string,
): Promise<ClassifyResult> {
  const userContent: Anthropic.MessageParam["content"] = [
    { type: "image", source: imageSource as Anthropic.ImageBlockParam["source"] },
  ];

  if (textContext) {
    userContent.push({ type: "text", text: `Listing context: ${textContext}` });
  }

  userContent.push({ type: "text", text: "Classify the architectural style of this home." });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: CLAUDE_PROMPT,
    messages: [{ role: "user", content: userContent }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(clean) as ClassifyResult;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  let imageSource: { type: "url"; url: string } | { type: "base64"; media_type: string; data: string };
  let textContext = "";
  let imageUrl = "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    if (!file) return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = file.type || "image/jpeg";
    imageSource = { type: "base64", media_type: mediaType, data: base64 };
    imageUrl = "uploaded";
  } else {
    const body = await request.json() as { url?: string };
    const url = body.url?.trim();
    if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });

    const imageExtensions = /\.(jpe?g|png|webp|gif)(\?.*)?$/i;
    if (imageExtensions.test(url)) {
      imageSource = { type: "url", url };
      imageUrl = url;
    } else {
      let html: string;
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
          },
          signal: AbortSignal.timeout(10000),
        });
        html = await res.text();
      } catch {
        return NextResponse.json(
          { error: "Could not load this page — try pasting a direct image URL or uploading the photo instead." },
          { status: 400 },
        );
      }

      const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
        ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];

      if (!ogImage) {
        return NextResponse.json(
          { error: "No preview image found on this page — try pasting a direct image URL or uploading the photo." },
          { status: 400 },
        );
      }

      imageUrl = ogImage;
      imageSource = { type: "url", url: ogImage };

      const title = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? "";
      const description = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? "";
      if (title || description) textContext = [title, description].filter(Boolean).join(" — ");
    }
  }

  let result: ClassifyResult;
  try {
    result = await classifyWithClaude(imageSource, textContext);
  } catch (err) {
    console.error("Claude error", err);
    return NextResponse.json({ error: "Classification failed — please try again." }, { status: 500 });
  }

  const id = crypto.randomUUID();
  await redis.set(`classify:result:${id}`, { ...result, imageUrl, analyzedAt: new Date().toISOString() }, { ex: 60 * 60 * 24 * 90 });

  await redis.lpush(
    "style-search:events",
    makeEvent({
      app_id: "B",
      event: "search_submitted",
      session_id: `B-classify-${id}`,
      metadata: { type: "classify", primaryStyle: result.primaryStyle, styleClarity: result.styleClarity },
    }),
  );

  return NextResponse.json({ id, ...result, imageUrl });
}
