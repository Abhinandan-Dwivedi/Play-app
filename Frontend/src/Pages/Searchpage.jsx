import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Frown, SlidersHorizontal } from "lucide-react";
import api from "../Utils/axiosInstance.js";
import SearchVideoCard from "../Components/Searchvideocard.jsx";

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;

            try {
                setLoading(true);
                const res = await api.get(`/video/videos?query=${query}`);
                setVideos(res.data.data.videos || []);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F0F] transition-colors pt-20 px-4 md:px-8 lg:px-12 pb-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center flex-shrink-0">
                                <Search className="w-6 h-6 text-white dark:text-black" />
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                                    Search Results
                                </p>

                                <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white break-words">
                                    “{query}”
                                </h1>

                                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                    {loading
                                        ? "Searching videos..."
                                        : `${videos.length} ${videos.length === 1 ? "result" : "results"} found`}
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            <SlidersHorizontal className="w-4 h-4" />
                            Best match
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col gap-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 md:p-5 shadow-sm"
                            >
                                <div className="flex flex-col md:flex-row gap-5 animate-pulse">
                                    <div className="w-full md:w-80 aspect-video rounded-2xl bg-zinc-200 dark:bg-zinc-800" />

                                    <div className="flex-1 py-1 space-y-4">
                                        <div className="h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 w-3/4" />
                                        <div className="h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 w-1/3" />
                                        <div className="space-y-2 pt-2">
                                            <div className="h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 w-full" />
                                            <div className="h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 w-5/6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : videos.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        {videos.map((video) => (
                            <div
                                key={video._id}
                                className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200"
                            >
                                <SearchVideoCard video={video} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-8 py-24 text-center shadow-sm">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <Frown className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-3">
                            No results found
                        </h2>

                        <p className="max-w-md mx-auto text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
                            We couldn’t find anything for
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300"> “{query}”</span>.
                            Try checking your spelling or using different keywords.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;