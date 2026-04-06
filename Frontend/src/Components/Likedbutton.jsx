import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import api from "../Utils/axiosInstance.js";

function LikeButton({
    id,
    type = "video",
    initialLikes = 0,
    initialIsLiked = false,
    onToggle 
}) {
     const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLiked(initialIsLiked);
        setLikesCount(initialLikes);
    }, [initialIsLiked, initialLikes, id]);

    const handleToggleLike = async () => {
        if (!localStorage.getItem("user")) {
            alert("Please login to like this");
            return;
        }

         const prevLiked = isLiked;
        const prevCount = likesCount;

         setIsLiked(!prevLiked);
        setLikesCount(prev => prevLiked ? Math.max(0, prev - 1) : prev + 1);

        try {
            setIsLoading(true);

             let endpoint = "";
            if (type === "video") endpoint = `/likes/video/${id}`;
            else if (type === "comment") endpoint = `/likes/comment/${id}`;
            else if (type === "tweet") endpoint = `/likes/tweet/${id}`;

            const res = await api.post(endpoint);

             const message = (res?.data?.message || "").toLowerCase();
             const isNowLiked = message.includes("liked") && !message.includes("unliked");
            
            setIsLiked(isNowLiked);
            
            if (onToggle) onToggle(isNowLiked);

        } catch (err) {
             setIsLiked(prevLiked);
            setLikesCount(prevCount);
            console.error("Like error:", err);
            alert("Failed to update like. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                if (!isLoading) handleToggleLike();
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition-all duration-200 ${
                isLiked
                    ? "bg-[#AE7AFF] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:dark:bg-zinc-700"
            } ${isLoading ? "opacity-70 cursor-wait" : "active:scale-90"}`}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            )}
            <span>{likesCount}</span>
        </button>
    );
}

export default LikeButton;