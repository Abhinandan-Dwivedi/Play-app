import { useNavigate } from "react-router-dom";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";
import Button from "./Button.jsx";

function HistoryCard({ video, onRemove }) {
    const navigate = useNavigate();

    return (
        <div className="flex gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl transition-all group relative">
            {/* Thumbnail */}
            <div 
                className="relative w-40 md:w-56 aspect-video flex-shrink-0 cursor-pointer overflow-hidden rounded-xl"
                onClick={() => navigate(`/video/${video._id}`)}
            >
                <img src={proxyCloudinaryUrl(video.thumbnail)} className="w-full h-full object-cover" alt="thumbnail" />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded">
                    {video.duration}
                </span>
            </div>

            {/* Video Info */}
            <div className="flex flex-col justify-start flex-1 py-1">
                <h3 className="font-bold text-sm md:text-base dark:text-white line-clamp-2 leading-tight mb-1">
                    {video.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium mb-2">
                    {video.owner?.fullName || video.owner?.username || "Unknown"} • {video.views} views
                </p>
                <p className="text-xs text-gray-400 line-clamp-2 hidden md:block">
                    {video.description}
                </p>
            </div>

             <button 
                onClick={() => onRemove(video._id)}
                className="absolute top-2 right-2 md:opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                title="Remove from history"
            >
                ✕
            </button>
        </div>
    );
}

export default HistoryCard;