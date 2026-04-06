import { useState, useEffect } from "react";
import { Play, Shuffle, Heart, Film } from "lucide-react";
import api from "../Utils/axiosInstance.js";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";
import LikedVideoCard from "../Components/Likedvideocard.jsx";
import Button from "../Components/Button.jsx";

function Likedvideos() {
    const [likedVideos, setLikedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLikedVideos = async () => {
        try {
            setLoading(true);
            const res = await api.get("/likes/videos");
            setLikedVideos(res.data.data || []);
        } catch (err) {
            console.error("Error fetching liked videos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLikedVideos();
    }, []);

    const handleUnlike = async (videoId) => {
        try {
            await api.post(`/likes/video/${videoId}`);
            setLikedVideos(prev => prev.filter(item => item.video._id !== videoId));
        } catch (err) {
            alert("Failed to unlike video.");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F0F] transition-colors pt-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col xl:flex-row gap-8">

                {/* Left Section */}
                <div className="w-full xl:w-[380px] flex-shrink-0">
                    <div className="sticky top-24 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]">

                        {/* Cover / Thumbnail */}
                        <div className="relative h-64 w-full overflow-hidden">
                            {likedVideos.length > 0 ? (
                                <>
                                    <img
                                        src={proxyCloudinaryUrl(likedVideos[0].video?.thumbnail)}
                                        alt="Liked video thumbnail"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </>
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center">
                                    <Heart className="w-16 h-16 text-white fill-white/20" />
                                </div>
                            )}

                            <div className="absolute bottom-5 left-5 right-5 text-white">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-3">
                                    <Heart className="w-4 h-4 fill-[#AE7AFF] text-[#AE7AFF]" />
                                    <span className="text-xs font-semibold uppercase tracking-[0.25em]">
                                        Playlist
                                    </span>
                                </div>

                                <h1 className="text-3xl font-black mb-1">Liked Videos</h1>
                                <p className="text-sm text-zinc-200 font-medium flex items-center gap-2">
                                    <Film className="w-4 h-4" />
                                    {likedVideos.length} {likedVideos.length === 1 ? "Video" : "Videos"}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-5 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    text={
                                        <span className="flex items-center justify-center gap-2 font-semibold">
                                            <Play className="w-5 h-5 fill-current" />
                                            Play All
                                        </span>
                                    }
                                    className="w-full bg-[#AE7AFF] hover:bg-[#9b67ff] text-white py-3 rounded-2xl transition-all shadow-lg shadow-violet-500/20"
                                />

                                <Button
                                    text={
                                        <span className="flex items-center justify-center gap-2 font-semibold">
                                            <Shuffle className="w-5 h-5" />
                                            Shuffle
                                        </span>
                                    }
                                    className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                                />
                            </div>

                            <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 p-4 border border-zinc-200 dark:border-zinc-700">
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                                    All the videos you liked while browsing will appear here. Your most recently liked video is shown above.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex-1 flex flex-col gap-5">
                    {loading ? (
                        [1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-32 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                            >
                                <div className="animate-pulse h-full w-full bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />
                            </div>
                        ))
                    ) : likedVideos.length > 0 ? (
                        likedVideos.map((item) => (
                            <div
                                key={item._id}
                                className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <LikedVideoCard
                                    video={item.video}
                                    onUnlike={handleUnlike}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-24 px-6 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                            <div className="w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center mb-6">
                                <Heart className="w-10 h-10 text-[#AE7AFF] fill-[#AE7AFF]/20" />
                            </div>

                            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-3">
                                No liked videos yet
                            </h2>

                            <p className="max-w-md text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
                                Videos you like while watching will appear here. Start exploring and build your personal collection.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Likedvideos;
