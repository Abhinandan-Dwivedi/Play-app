import { useState, useEffect } from "react";
import {
    Send,
    MessageCircle,
    Trash2,
    Megaphone,
    Loader2,
} from "lucide-react";
import api from "../Utils/axiosInstance.js";
import Button from "./Button.jsx";
import LikeButton from "./Likedbutton.jsx";
import { formatDistanceToNow } from "date-fns";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";

function TweetSection({ tweets: initialTweets, channelOwner, isOwner }) {
    const [content, setContent] = useState("");
    const [localTweets, setLocalTweets] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setLocalTweets(initialTweets);
    }, [initialTweets]);

    const handleSaveTweet = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setIsSubmitting(true);
            const res = await api.post("/tweet/", { content });

            const newTweet = {
                ...res.data.data,
                owner: channelOwner,
            };

            setLocalTweets([newTweet, ...localTweets]);
            setContent("");
        } catch (err) {
            alert("Failed to post tweet.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTweet = async (tweetId) => {
        if (!window.confirm("Delete this post permanently?")) return;

        try {
            await api.delete(`/tweet/${tweetId}`);
            setLocalTweets((prev) => prev.filter((t) => t._id !== tweetId));
        } catch (err) {
            alert("Could not delete tweet.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-6">

            {/* Composer */}
            {isOwner && (
                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#AE7AFF]/15 flex items-center justify-center">
                            <Megaphone className="w-5 h-5 text-[#AE7AFF]" />
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                                Share an update
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                Let your subscribers know what you're working on.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSaveTweet} className="p-5">
                        <div className="flex gap-4 items-start">
                            <img
                                src={proxyCloudinaryUrl(channelOwner?.avatar)}
                                alt="avatar"
                                className="w-11 h-11 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 flex-shrink-0"
                            />

                            <div className="flex-1">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share something with your community..."
                                    className="w-full min-h-[120px] resize-none rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-all focus:border-[#AE7AFF] focus:ring-4 focus:ring-[#AE7AFF]/10"
                                />

                                <div className="mt-4 flex items-center justify-between gap-4">
                                    <span className="text-xs text-zinc-400 font-medium">
                                        {content.length}/280
                                    </span>

                                    <Button
                                        text={
                                            <span className="flex items-center gap-2 font-semibold">
                                                {isSubmitting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                                {isSubmitting ? "Posting..." : "Post Update"}
                                            </span>
                                        }
                                        type="submit"
                                        disabled={isSubmitting || !content.trim()}
                                        className="rounded-2xl bg-[#AE7AFF] hover:bg-[#9d69ff] text-black px-5 py-2.5 shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Posts */}
            <div className="flex flex-col gap-5">
                {localTweets.length > 0 ? (
                    localTweets.map((tweet) => (
                        <div
                            key={tweet._id}
                            className="group rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="p-5">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={proxyCloudinaryUrl(channelOwner?.avatar)}
                                        alt="avatar"
                                        className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 flex-shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-bold text-sm text-zinc-900 dark:text-white">
                                                        {channelOwner?.fullname || channelOwner?.username}
                                                    </span>

                                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                                        @{channelOwner?.username}
                                                    </span>

                                                    <span className="text-zinc-400 text-sm">·</span>

                                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                                        {formatDistanceToNow(new Date(tweet.createdAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {isOwner && (
                                                <button
                                                    onClick={() => handleDeleteTweet(tweet._id)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition-all hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                                    title="Delete post"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                                            {tweet.content}
                                        </p>

                                        <div className="mt-5 flex items-center gap-5 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                                            <LikeButton
                                                id={tweet._id}
                                                type="tweet"
                                                initialLikes={tweet.likesCount || 0}
                                                initialIsLiked={tweet.isLiked}
                                            />

                                            <button className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>0</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-20 px-6 text-center shadow-sm">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <Megaphone className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
                        </div>

                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">
                            No posts yet
                        </h3>

                        <p className="max-w-md mx-auto text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {isOwner
                                ? "Share your first update with your subscribers."
                                : "This creator hasn't posted any community updates yet."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TweetSection;