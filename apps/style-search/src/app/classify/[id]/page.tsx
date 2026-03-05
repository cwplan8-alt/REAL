import { Redis } from "@upstash/redis";
import { notFound } from "next/navigation";
import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import CopyLinkButton from "./copy-link-button";
import FeedbackButtons from "./feedback-buttons";

const redis = Redis.fromEnv();

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
  imageUrl: string;
  analyzedAt: string;
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const filled = Math.round(value);
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium">{value}/10</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${i < filled ? "bg-slate-900" : "bg-slate-200"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default async function ClassifyResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await redis.get<ClassifyResult>(`classify:result:${id}`);

  if (!result) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-2xl font-bold">Result not found</h1>
        <p className="mt-2 text-slate-600">This analysis has expired or the link is invalid.</p>
        <Link href="/classify" className="mt-4 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm text-white">
          Classify a new home →
        </Link>
      </div>
    );
  }

  const qualityLabel =
    result.designQuality >= 8 ? "Architecturally rich"
    : result.designQuality >= 6 ? "Well-composed"
    : result.designQuality >= 4 ? "Competent"
    : "Generic / builder-grade";

  return (
    <div className="mx-auto max-w-2xl grid gap-8">

      {/* Photo */}
      {result.imageUrl && result.imageUrl !== "uploaded" ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.imageUrl} alt="Analyzed home" className="w-full object-cover max-h-80" />
        </div>
      ) : null}

      {/* Style header */}
      <div className="grid gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {result.noDistinctStyle ? "No distinct style" : result.primaryStyle}
            </h1>
            {result.secondaryStyle && !result.noDistinctStyle ? (
              <p className="text-slate-500">with {result.secondaryStyle} influence</p>
            ) : null}
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{result.era}</span>
        </div>

        {/* Top style matches */}
        {!result.noDistinctStyle && result.topStyles?.length > 1 ? (
          <p className="text-sm text-slate-500">
            {result.topStyles.map((s) => `${s.style} ${s.confidence}%`).join(" · ")}
          </p>
        ) : null}
      </div>

      {/* Scores */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 grid gap-4">
        <ScoreBar label="Style clarity" value={result.styleClarity} />
        <ScoreBar label="Design quality" value={result.designQuality} />
        <p className="text-sm text-slate-500">{qualityLabel}</p>
      </div>

      {/* Clues */}
      <div className="grid gap-3">
        <h2 className="font-semibold">What gives it away</h2>
        <ul className="grid gap-2">
          {result.clues.map((clue) => (
            <li key={clue} className="flex gap-2 text-sm text-slate-700">
              <span className="mt-0.5 shrink-0 text-slate-400">•</span>
              {clue}
            </li>
          ))}
        </ul>
      </div>

      {/* Education */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 grid gap-2">
        <h2 className="font-semibold">What is {result.noDistinctStyle ? "this style?" : `${result.primaryStyle}?`}</h2>
        <p className="text-sm leading-relaxed text-slate-700">{result.education}</p>
      </div>

      {/* Feedback + share */}
      <div className="flex flex-wrap gap-3">
        <CopyLinkButton />
        <FeedbackButtons resultId={id} predictedStyle={result.primaryStyle} />
      </div>

      {/* Find more */}
      {!result.noDistinctStyle ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 grid gap-3">
          <h2 className="font-semibold">Find more like this</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/search?style=${encodeURIComponent(result.primaryStyle)}`}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
            >
              Search {result.primaryStyle} homes →
            </Link>
            <Link href="/classify" className="rounded-lg border border-slate-300 px-4 py-2 text-sm">
              Classify another home
            </Link>
          </div>
        </div>
      ) : null}

      {/* Waitlist */}
      <div className="grid gap-3">
        <h2 className="font-semibold">Get notified when full style search launches</h2>
        <WaitlistForm appId="B" />
      </div>
    </div>
  );
}
