import { useNavigate } from "react-router-dom";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";
import { formatDistanceToNow } from "date-fns";  

function Searchvideocard({ video }) {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/video/${video._id}`)}
            className="flex flex-col md:flex-row gap-4 cursor-pointer group p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
        >
            {/* Thumbnail */}
            <div className="relative w-full md:w-80 aspect-video flex-shrink-0 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
                <img 
                    src={proxyCloudinaryUrl(video.thumbnail)} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={video.title} 
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    {video.duration}
                </span>
            </div>

            {/* Details */}
            <div className="flex flex-col flex-1 py-1">
                <h3 className="text-lg font-bold dark:text-white line-clamp-2 leading-tight mb-1">
                    {video.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                </div>
                
                {/* Channel Info */}
                <div className="flex items-center gap-2 mb-3">
                    <img 
                        src={proxyCloudinaryUrl(video.owner?.avatar)} 
                        className="w-6 h-6 rounded-full object-cover" 
                        alt="avatar" 
                    />
                    <span className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        {video.owner?.fullname || video.owner?.username}
                    </span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 hidden md:block leading-relaxed">
                    {video.description}
                </p>
            </div>
        </div>
    );
}

export default Searchvideocard;