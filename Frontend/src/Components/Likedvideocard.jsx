import { useNavigate } from "react-router-dom";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";
import { formatDistanceToNow } from "date-fns";

function Likedvideocard({ video, onUnlike }) {
    const navigate = useNavigate();

    // Reusing our formatting logic
    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const formatViews = (views) => {
        if (!views) return "0";
        if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
        if (views >= 1000) return (views / 1000).toFixed(1) + "K";
        return views;
    };

    return (
        <div className="flex gap-4 p-3 md:p-4 bg-white dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-[24px] transition-all group border-2 border-transparent hover:border-[#AE7AFF]/30 relative">

            {/* 1. THUMBNAIL */}
            <div
                className="relative w-36 md:w-56 aspect-video flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-sm"
                onClick={() => navigate(`/video/${video?._id}`)}
            >
                <img
                    src={proxyCloudinaryUrl(video?.thumbnail)}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    alt="thumbnail"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg">
                    {formatDuration(video?.duration)}
                </span>
            </div>

            {/* 2. VIDEO INFO */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
                <h3
                    className="font-black text-sm md:text-lg dark:text-white line-clamp-2 leading-tight mb-1 cursor-pointer hover:text-[#AE7AFF] transition-colors"
                    onClick={() => navigate(`/video/${video?._id}`)}
                >
                    {video?.title}
                </h3>

                <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-zinc-500 font-bold hover:text-black dark:hover:text-white transition-colors cursor-pointer" onClick={() => navigate(`/channel/${video?.owner?.username}`)}>
                        {video?.owner?.fullname || video?.owner?.username || "Unknown Creator"}
                    </p>

                    <p className="text-[11px] text-zinc-400 font-medium">
                        {formatViews(video?.views)} views • {video?.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : ""}
                    </p>
                </div>
            </div>

            {/* 3. UNLIKE BUTTON */}
            <div className="flex items-center pr-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUnlike(video?._id);
                    }}
                    className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all active:scale-90"
                    title="Remove from liked videos"
                >
                    <span className="text-lg font-bold">✕</span>
                </button>
            </div>
        </div>
    );
}

export default Likedvideocard;