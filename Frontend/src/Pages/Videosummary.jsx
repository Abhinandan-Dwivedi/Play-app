import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Utils/axiosInstance.js";
import Button from "../Components/Button.jsx";
import {
  Sparkles,
  Clipboard,
  Check,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Brain,
} from "lucide-react";

function VideoSummary() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        // const response = await api.get(`/api/v1/videos/${videoId}/summarize`);
        // setSummary(response.data.data.summary);
      } catch (err) {
        setError("AI was unable to process this video. Ensure it has a transcript.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [videoId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-[#0B0B0D] px-4 py-8 md:px-8 lg:px-12 transition-colors">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.12)]">

        <div className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-[#AE7AFF] via-[#9c6fff] to-[#7d5fff] px-6 py-8 md:px-10 md:py-10">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-black/10 px-4 py-2 text-sm font-bold text-black/80 backdrop-blur-sm">
                <Brain className="h-4 w-4" />
                AI Video Analysis
              </div>

              <h1 className="flex items-center gap-3 text-3xl font-black text-black md:text-5xl">
                <Sparkles className="h-8 w-8" />
                AI Insights
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-black/70 md:text-base">
                Get an automatically generated summary and key insights from this video's transcript.
              </p>

              <div className="mt-5 inline-flex items-center rounded-2xl bg-white/10 px-4 py-2 text-xs font-semibold text-black/70 backdrop-blur-sm">
                Video ID: {videoId}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {!loading && !error && (
                <Button
                  text={
                    <span className="flex items-center gap-2">
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Clipboard className="h-4 w-4" />
                          Copy Summary
                        </>
                      )}
                    </span>
                  }
                  variant="secondary"
                  onClick={handleCopy}
                  className="bg-white/20 text-black hover:bg-white/30 border-none"
                />
              )}

              <Button
                text={
                  <span className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Video
                  </span>
                }
                onClick={() => navigate(-1)}
                className="bg-black text-white hover:bg-zinc-900"
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#AE7AFF]/10 text-[#AE7AFF]">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>

              <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                Generating summary...
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Our AI is analyzing the transcript and extracting the most important information.
              </p>

              <div className="mt-10 w-full max-w-3xl space-y-4 animate-pulse">
                <div className="h-6 w-1/3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-5/6 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-2/3 rounded-full bg-zinc-200 dark:bg-zinc-800" />

                <div className="mt-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6">
                  <div className="h-4 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="mt-4 h-4 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="mt-4 h-4 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/30 dark:text-red-400">
                <AlertTriangle className="h-10 w-10" />
              </div>

              <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
                Unable to generate summary
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {error}
              </p>

              <Button
                text="Try Again"
                onClick={() => window.location.reload()}
                className="mt-8 px-6"
              />
            </div>
          ) : (
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#AE7AFF]/10 text-[#AE7AFF]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                    Generated Summary
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Key points extracted from the video transcript.
                  </p>
                </div>
              </div>

              <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6 md:p-8 shadow-inner">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-[15px] leading-8">
                  <div className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                    {summary}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-400">
                <Check className="h-4 w-4" />
                Summary generated successfully using AI transcript analysis.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoSummary;