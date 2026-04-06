import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Globe,
    Lock,
    Trash2,
    Loader2,
    Eye,
    MoreVertical,
} from "lucide-react";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";
import axios from "axios";

function Mychannelvideocard({ video, onDeleteSuccess }) {
    const [isPublished, setIsPublished] = useState(video.isPublished);
    const [isToggling, setIsToggling] = useState(false);
    const navigate = useNavigate();

    const handleTogglePublish = async () => {
        try {
            setIsToggling(true);
            const res = await axios.patch(
                `/api/v1/video/publish-status/${video._id}`,
                {},
                { withCredentials: true }
            );

            setIsPublished(res.data.data.isPublished);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        } finally {
            setIsToggling(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this video permanently?")) return;

        try {
            await axios.delete(`/api/v1/video/videodelete/${video._id}`, {
                withCredentials: true,
            });
            onDeleteSuccess(video._id);
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div className="group overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Thumbnail */}
            <div
                onClick={() => navigate(`/video/${video._id}`)}
                className="relative aspect-video cursor-pointer overflow-hidden bg-zinc-200 dark:bg-zinc-800"
            >
                <img
                    src={proxyCloudinaryUrl(video.thumbnail)}
                    alt="thumbnail"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                {/* Top Right Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePublish();
                        }}
                        disabled={isToggling}
                        title={isPublished ? "Make Private" : "Make Public"}
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl backdrop-blur-md border transition-all ${
                            isPublished
                                ? "bg-black/50 border-white/10 text-white hover:bg-black/70"
                                : "bg-green-500/90 border-green-400/30 text-white hover:bg-green-500"
                        }`}
                    >
                        {isToggling ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isPublished ? (
                            <Lock className="w-4 h-4" />
                        ) : (
                            <Globe className="w-4 h-4" />
                        )}
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        title="Delete Video"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/90 text-white backdrop-blur-md transition-all hover:bg-red-500"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Bottom Status */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur-md border ${
                            isPublished
                                ? "bg-green-500/20 text-green-100 border-green-400/20"
                                : "bg-zinc-900/60 text-zinc-200 border-white/10"
                        }`}
                    >
                        {isPublished ? (
                            <Globe className="w-3 h-3" />
                        ) : (
                            <Lock className="w-3 h-3" />
                        )}
                        {isPublished ? "Public" : "Private"}
                    </span>

                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-bold leading-6 text-zinc-900 dark:text-white min-h-[3rem]">
                    {video.title}
                </h3>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        <Eye className="w-4 h-4" />
                        <span>
                            {video.views} {video.views === 1 ? "view" : "views"}
                        </span>
                    </div>

                    <button
                        onClick={() => navigate(`/video/${video._id}`)}
                        className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    >
                        Open
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Mychannelvideocard;