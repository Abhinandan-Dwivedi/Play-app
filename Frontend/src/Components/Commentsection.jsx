import { useState, useEffect, useCallback } from "react";  
import api from "../Utils/axiosInstance.js";
import { formatDistanceToNow } from "date-fns";
import Button from "./Button.jsx";
import LikeButton from "./Likedbutton.jsx";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";
import { MessageSquare, Trash2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CommentSection({ videoId, currentUser }) {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    
    const fetchComments = useCallback(async () => {
        if (!videoId) return;
        try {
            setLoading(true);
             
            const res = await api.get(`/comment/${videoId}`);
            
             const fetchedData = res.data?.data?.comments || res.data?.data?.docs || res.data?.data || [];
            setComments(Array.isArray(fetchedData) ? fetchedData : []);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setComments([]);
        } finally {
            setLoading(false);
        }
    }, [videoId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

     const handlePostComment = async (e) => {
        if (e) e.preventDefault();  
        
        if (!newComment.trim()) return;

        try {
            setIsPosting(true);
             await api.post(`/comment/u/${videoId}`, { content: newComment });

            setNewComment("");
            await fetchComments();
        } catch (err) {
            console.error("Post Error:", err);
            alert("Failed to post comment. Ensure you are logged in.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await api.delete(`/comment/c/${commentId}`);
            setComments((prev) => prev.filter((c) => c._id !== commentId));
        } catch (err) {
            alert("Could not delete comment.");
        }
    };

    return (
        <div className="mt-10 rounded-[32px] border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-colors">
            
            <div className="mb-8 flex items-center justify-between">
                <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-[#AE7AFF]" />
                    {comments.length} Comments
                </h3>
            </div>

            {/* --- INPUT SECTION --- */}
            <div className="mb-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-transparent focus-within:border-[#AE7AFF]/30 transition-all">
                {currentUser ? (
                    <div className="group">  
                        <div className="flex gap-4">
                            <img
                                src={proxyCloudinaryUrl(currentUser.avatar)}
                                className="w-10 h-10 rounded-full object-cover border-2 border-[#AE7AFF] shadow-sm cursor-pointer"
                                alt="avatar"
                                onClick={() => navigate(`/channel/${currentUser?.username}`)}
                            />
                            <div className="flex-1">
                                <textarea
                                    rows="1"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none py-2 text-sm dark:text-white transition-all resize-none min-h-[40px] focus:min-h-[100px]"
                                />
                                
                                <div className="mt-2 flex items-center justify-end gap-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => setNewComment("")}
                                        className="px-4 py-2 text-xs font-black text-zinc-500 hover:text-red-500 uppercase"
                                    >
                                        Clear
                                    </button>
                                    <Button
                                        text={isPosting ? "POSTING..." : "COMMENT"}
                                        disabled={!newComment.trim() || isPosting}
                                        onClick={handlePostComment}  
                                        className="bg-[#AE7AFF] text-black px-6 py-2 rounded-xl font-black text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 text-center">
                        <p className="text-sm font-bold text-zinc-500">Please sign in to join the discussion.</p>
                    </div>
                )}
            </div>

            {/* --- LIST SECTION --- */}
            <div className="space-y-6">
                {loading && comments.length === 0 ? (
                    <div className="flex justify-center p-10"><Send className="animate-spin text-[#AE7AFF]" /></div>
                ) : comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 group animate-fade-in border-b last:border-none border-zinc-100 dark:border-zinc-800 pb-6">
                        <img
                            src={proxyCloudinaryUrl(comment.owner?.avatar)}
                            className="w-10 h-10 rounded-full object-cover border dark:border-zinc-700 shadow-sm cursor-pointer"
                            alt="avatar"
                            onClick={() => navigate(`/channel/${comment.owner?.username}`)}
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span 
                                    className="text-xs font-black dark:text-zinc-100 cursor-pointer hover:text-[#AE7AFF]"
                                    onClick={() => navigate(`/channel/${comment.owner?.username}`)}
                                >
                                    @{comment.owner?.username || "user"}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-bold">
                                    {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : "just now"}
                                </span>
                            </div>
                            <p className="text-sm dark:text-zinc-300 leading-relaxed font-medium">
                                {comment.content}
                            </p>
                            
                            <div className="flex items-center justify-between mt-3">
                                <LikeButton
                                    id={comment._id}
                                    type="comment"
                                    initialLikes={comment.likesCount || 0}
                                    initialIsLiked={comment.isLiked}
                                />
                                {String(currentUser?._id) === String(comment.owner?._id) && (
                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
                                        className="p-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentSection;