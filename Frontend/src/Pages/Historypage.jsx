import { useState, useEffect } from "react";
import api from "../Utils/axiosInstance.js";
import HistoryCard from "../Components/Historycard.jsx";
import Button from "../Components/Button.jsx";
import {
    History as HistoryIcon,
    Trash2,
    PauseCircle,
    Clock3,
    PlayCircle,
} from "lucide-react";

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get("/user/history");


            const historyData = res.data.data;

            if (Array.isArray(historyData)) {
                setHistory(historyData);
            } else {
                setHistory([]);
            }
        } catch (err) {
            console.error("Error fetching history:", err);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveVideo = async (videoId) => {
        // try {
        //     await api.delete(`/user/history/${videoId}`);
        //     setHistory(prev => prev.filter(v => v._id !== videoId));
        // } catch (err) {
        //     alert("Could not remove video.");
        // }
    };

    const handleClearHistory = async () => {
        // if (!window.confirm("Are you sure you want to clear your entire watch history?")) return;
        // try {
        //     await api.delete("/user/history/clear");
        //     setHistory([]);
        // } catch (err) {
        //     alert("Error clearing history.");
        // }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F0F] transition-colors pt-20 px-4 md:px-8 pb-10">
            <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">

                {/* Left Side */}
                <div className="flex-1 min-w-0">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-lg">
                            <HistoryIcon className="w-7 h-7 text-white dark:text-black" />
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white leading-tight">
                                Watch History
                            </h1>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                {history.length} {history.length === 1 ? "video" : "videos"} watched recently
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-32 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                                >
                                    <div className="h-full w-full animate-pulse bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />
                                </div>
                            ))}
                        </div>
                    ) : history.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {history.map((video) => (
                                <div
                                    key={video._id}
                                    className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-200"
                                >
                                    <HistoryCard
                                        video={video}
                                        onRemove={handleRemoveVideo}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-8 py-20 text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <Clock3 className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
                            </div>

                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                No watch history yet
                            </h2>

                            <p className="max-w-md mx-auto text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Videos you watch will appear here so you can quickly find them again.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="w-full xl:w-[320px] flex-shrink-0">
                    <div className="sticky top-24 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

                        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                            <p className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-500 dark:text-zinc-400 mb-2">
                                Manage History
                            </p>

                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                                Controls
                            </h2>
                        </div>

                        <div className="p-5 space-y-3">
                            <Button
                                text={
                                    <span className="flex items-center gap-3 font-medium">
                                        <Trash2 className="w-5 h-5" />
                                        Clear all watch history
                                    </span>
                                }
                                variant="outline"
                                onClick={handleClearHistory}
                                className="w-full justify-start rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 px-4 py-4"
                            />

                            <Button
                                text={
                                    <span className="flex items-center gap-3 font-medium">
                                        <PauseCircle className="w-5 h-5" />
                                        Pause watch history
                                    </span>
                                }
                                variant="outline"
                                className="w-full justify-start rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-4"
                            />
                        </div>

                        <div className="mx-5 mb-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/70 p-4 border border-zinc-200 dark:border-zinc-700">
                            <div className="flex items-start gap-3">
                                <PlayCircle className="w-5 h-5 mt-0.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />

                                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                    When watch history is paused, the videos you watch won't appear here or affect your recommendations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
