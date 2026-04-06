import { useState, useEffect } from "react";
import { AlertCircle, RefreshCcw, Video, Sparkles , Wand2 , MenuIcon} from "lucide-react";
import api from "../Utils/axiosInstance.js";
import VideoCard from "../Components/Videocard";
import VideoSkeleton from "../Components/Videoskeleton";

function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("/video/videos");
            const videoData = response.data.data.videos;

            if (Array.isArray(videoData)) {
                setVideos(videoData);
            } else {
                setVideos([]);
            }
        } catch (err) {
            console.error("Error fetching videos:", err);
            setError("Failed to load videos. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F0F] transition-colors">

            {/* Header */}
            {!loading && !error && videos.length > 0 && (
                <div className="mb-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 dark:bg-zinc-100">
                            <Sparkles className="h-5 w-5 text-white dark:text-black" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
                                Recommended for you
                            </h1>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                {videos.length} videos available to explore
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="mx-auto mt-16 max-w-xl rounded-3xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-zinc-900 p-8 text-center shadow-sm">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>

                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">
                        Something went wrong
                    </h2>

                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {error}
                    </p>

                    <button
                        onClick={fetchVideos}
                        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-500 hover:bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-all"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            )}

            {/* Loading / Grid */}
            {!error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {loading ? (
                        [...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
                            >
                                <VideoSkeleton />
                            </div>
                        ))
                    ) : Array.isArray(videos) && videos.length > 0 ? (
                        videos.map((video) => (
                            <div
                                key={video._id}
                                className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                            >
                                <VideoCard video={video} />
                            </div>
                        ))
                    ) : null}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && videos.length === 0 && (
                <div className="mx-auto mt-20 max-w-2xl rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-8 py-20 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <Video className="h-10 w-10 text-zinc-500 dark:text-zinc-400" />
                    </div>

                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-3">
                        No videos available yet
                    </h2>

                    <p className="mx-auto max-w-md text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        New uploads will appear here as soon as creators publish them. Check back later or upload your own first video.
                    </p>
                </div>
            )}
        </div>
    );
}

export default Home;