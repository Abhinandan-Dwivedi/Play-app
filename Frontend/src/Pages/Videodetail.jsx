import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Clock3, Loader2, Sparkles, Users, Eye } from "lucide-react";
import api from "../Utils/axiosInstance.js";
import Button from "../Components/Button.jsx";
import Videocard from "../Components/Videocard.jsx";
import LikeButton from "../Components/Likedbutton.jsx";
import CommentSection from "../Components/Commentsection.jsx";
import { formatDistanceToNow } from "date-fns";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";

function Videodetail() {
    const { videoId } = useParams();
    const navigate = useNavigate();

    const [video, setVideo] = useState(null);
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [viewCounted, setViewCounted] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setCurrentUser(JSON.parse(savedUser));

        const fetchVideoData = async () => {
            try {
                setLoading(true);
                const videoRes = await api.get(`/video/videobyid/${videoId}`);
                const fetched = videoRes.data.data;
                setVideo(fetched);

                if (fetched.owner?.username) {
                    const chan = await api.get(`/user/c/${fetched.owner.username}`);
                    setIsSubscribed(!!chan.data?.data?.isSubscribed);
                    setSubscribersCount(chan.data?.data?.subscribersCount || 0);
                }

                const recRes = await api.get("/video/videos?limit=10");
                const allVideos = recRes.data.data.videos || [];
                setRecommendedVideos(allVideos.filter((v) => v._id !== videoId));
            } catch (err) {
                console.error("Error fetching video details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) fetchVideoData();
    }, [videoId]);

    const refreshVideo = async () => {
        try {
            const videoRes = await api.get(`/video/videobyid/${videoId}`);
            setVideo(videoRes.data.data);
        } catch (err) {
            console.error('refreshVideo error', err);
        }
    };

    const toggleSubscription = async () => {
        if (!currentUser) return alert("Please login to subscribe");
        if (!video?.owner?._id) return;

        const previousIsSubscribed = isSubscribed;
        setIsSubscribed(!previousIsSubscribed);
        setSubscribersCount(prev => previousIsSubscribed ? prev - 1 : prev + 1);

        try {
            await api.post(`/subscriber/${video.owner._id}`);
        } catch (err) {
            setIsSubscribed(previousIsSubscribed);
            setSubscribersCount(prev => previousIsSubscribed ? prev + 1 : prev - 1);
            console.error('Subscription action failed:', err);
        }
    };

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#0F0F0F]">
            <Loader2 className="h-8 w-8 animate-spin text-[#AE7AFF]" />
        </div>
    );

    if (!video) return (
        <div className="flex min-h-screen flex-col items-center justify-center dark:bg-[#0F0F0F]">
            <h2 className="text-2xl font-black dark:text-white">Video not found</h2>
            <Button text="Go Home" onClick={() => navigate("/")} className="mt-4" />
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F0F] px-4 pb-16 pt-20 transition-colors md:px-8 lg:px-12">
            <div className="mx-auto flex max-w-[1700px] flex-col gap-8 lg:flex-row">
                <div className="min-w-0 flex-1">

                    {/* Video Player */}
                    <div className="overflow-hidden rounded-[28px] bg-black shadow-2xl">
                        <video
                            ref={videoRef}
                            src={proxyCloudinaryUrl(video.videoFile)}
                            poster={proxyCloudinaryUrl(video.thumbnail)}
                            crossOrigin="anonymous"
                            controls
                            autoPlay
                            className="aspect-video h-full w-full bg-black shadow-inner"
                            onPlay={async () => {
                                if (viewCounted) return;

                                try {
                                    setViewCounted(true);

                                    const res = await api.post(`/video/views/${videoId}`);

                                    if (res.data?.data?.views) {
                                        setVideo((v) => ({ ...v, views: res.data.data.views }));
                                    }
                                } catch (err) {
                                    setViewCounted(false);
                                    console.error("Failed to update view/history:", err.message);
                                }
                            }}
                        />
                    </div>

                    {/* Info Card */}
                    <div className="mt-6 rounded-3xl border dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                        <h1 className="text-2xl font-black dark:text-white">{video.title}</h1>

                        <div className="mt-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between xl:flex-1">
                                <div onClick={() => navigate(`/channel/${video.owner?.username}`)} className="flex cursor-pointer items-center gap-4">
                                    <img
                                        src={proxyCloudinaryUrl(video.owner?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${video.owner?.username}`)}
                                        className="h-14 w-14 rounded-full object-cover border dark:border-zinc-700"
                                    />
                                    <div>
                                        <p className="font-black dark:text-white">{video.owner?.fullname || video.owner?.username}</p>
                                        <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                                            <Users className="h-4 w-4" />
                                            <span>{subscribersCount.toLocaleString()} subscribers</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={toggleSubscription}
                                    className={`rounded-2xl px-6 py-3 text-sm font-black transition-all ${isSubscribed
                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
                                        : "bg-[#AE7AFF] text-black shadow-lg"
                                        }`}
                                >
                                    {isSubscribed ? "Subscribed" : "Subscribe"}
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <LikeButton
                                    id={video._id}
                                    type="video"
                                    initialLikes={video.likesCount || 0}
                                    initialIsLiked={video.isLiked}
                                />

                                <Button
                                    text={<span className="flex items-center gap-2 font-black"><Sparkles className="h-4 w-4" /> AI Summary</span>}
                                    onClick={() => navigate(`/video/${videoId}/summary`)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6 rounded-3xl border dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                        <div className="mb-4 flex items-center gap-4 text-sm font-bold text-zinc-500">
                            <span className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl"><Eye className="h-4 w-4" /> {video.views?.toLocaleString()} views</span>
                            <span className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl"><Clock3 className="h-4 w-4" /> {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-[15px] dark:text-zinc-300 leading-relaxed">{video.description}</p>
                    </div>

                    <CommentSection videoId={videoId} currentUser={currentUser} />
                </div>

                {/* Sidebar */}
                <aside className="w-full flex-shrink-0 lg:w-[380px]">
                    <h2 className="text-lg font-black dark:text-white mb-4">Up Next</h2>
                    <div className="flex flex-col gap-4">
                        {recommendedVideos.map((rec) => (
                            <Videocard key={rec._id} video={rec} />
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
export default Videodetail;