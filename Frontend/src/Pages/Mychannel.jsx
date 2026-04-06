import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Pencil,
    Upload,
    Video,
    FolderOpen,
    MessageSquare,
    Users,
    ImageIcon,
} from "lucide-react";
import api from "../Utils/axiosInstance.js";
import MyChannelVideoCard from "../Components/Mychannelvideocard.jsx";
import Button from "../Components/Button.jsx";
import TweetSection from "../Components/Tweetsection.jsx";
import UploadVideoModal from "../Components/Uploadvedio.jsx";
import VideoSkeleton from "../Components/Videoskeleton.jsx";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";
import { set } from "date-fns";

function MyChannel() {
    const navigate = useNavigate();
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [activeTab, setActiveTab] = useState("Videos");
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [tweets, setTweets] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [subscribedChannels, setSubscribedChannels] = useState([]);

    const fetchSubscribedChannels = async () => {
        try {
            if (!channel?._id) return;
            const res = await api.get(`/subscriber/u/channels`);
            setSubscribedChannels(res.data.data || []);
        } catch (err) {
            console.error("Error fetching subscriptions:", err);
            setSubscribedChannels([]);
        }
    };
    const fetchChannelTweets = async () => {
        try {
            const res = await api.get(`/tweet/${channel._id}`);
            const tweetData = res.data.data.tweets || res.data.data || [];
            setTweets(tweetData);
        } catch (err) {
            console.error("Error fetching tweets:", err);
            setTweets([]);
        }
    };

    useEffect(() => {
        if (activeTab === "Tweets" && channel?._id) {
            fetchChannelTweets();
        }
        if (activeTab === "Subscribed" && channel?._id) {
            fetchSubscribedChannels();
        }
    }, [activeTab, channel?._id]);

    const fetchMyData = async () => {
        try {
            setLoading(true);
            const savedUser = JSON.parse(localStorage.getItem("user"));
            const username = savedUser?.username;

            if (!username) return;

            const userRes = await api.get(`/user/c/${username}`);
            setChannel(userRes.data.data);
            setCurrentUser(userRes.data.data);

            const videoRes = await api.get(`/video/videos?userId=${userRes.data.data._id}`);
            setVideos(videoRes.data.data.videos || []);
        } catch (err) {
            console.error("Auth error:", err);
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyData();
    }, [navigate]);

    const handleVideoDeleted = (videoId) => {
        setVideos((prev) => prev.filter((v) => v._id !== videoId));
    };

    if (loading)
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F0F] animate-pulse">
                <div className="h-40 md:h-72 bg-zinc-200 dark:bg-zinc-800" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 -mt-14 md:-mt-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
                            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-zinc-300 dark:bg-zinc-700 border-4 border-white dark:border-[#0F0F0F]" />
                            <div className="space-y-3 pb-2">
                                <div className="h-8 w-52 rounded-xl bg-zinc-300 dark:bg-zinc-700" />
                                <div className="h-4 w-28 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                                <div className="h-4 w-40 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                            </div>
                        </div>

                        <div className="h-11 w-36 rounded-2xl bg-zinc-300 dark:bg-zinc-700" />
                    </div>

                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <VideoSkeleton key={i} showAvatar={false} />
                        ))}
                    </div>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F0F] text-zinc-900 dark:text-white transition-colors pb-16">

            {/* Cover */}
            <div className="relative h-44 md:h-72 lg:h-80 overflow-hidden group">
                <img
                    src={proxyCloudinaryUrl(channel?.coverImage)}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <button
                    onClick={() => navigate("/edit-profile")}
                    className="absolute top-5 right-5 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md px-4 py-2 text-sm font-semibold text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
                >
                    <ImageIcon className="w-4 h-4" />
                    Edit cover
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 -mt-14 md:-mt-20 relative z-10">

                {/* Profile Header */}
                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-xl overflow-hidden">
                    <div className="px-5 md:px-8 py-6 md:py-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

                        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-6">
                            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl bg-zinc-200 dark:bg-zinc-800 flex-shrink-0">
                                <img
                                    src={proxyCloudinaryUrl(channel?.avatar)}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="text-center md:text-left pb-1">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                                    {channel?.fullname}
                                </h1>

                                <p className="mt-1 text-base text-zinc-500 dark:text-zinc-400 font-medium">
                                    @{channel?.username}
                                </p>

                                <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                                    <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2 font-semibold text-zinc-700 dark:text-zinc-300">
                                        <Users className="w-4 h-4" />
                                        {channel?.subscribersCount || 0} subscribers
                                    </div>

                                    <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2 font-semibold text-zinc-700 dark:text-zinc-300">
                                        <Video className="w-4 h-4" />
                                        {videos.length} videos
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            text={
                                <span className="flex items-center gap-2 font-semibold">
                                    <Pencil className="w-4 h-4" />
                                    Edit Profile
                                </span>
                            }
                            onClick={() => navigate("/edit-profile")}
                            className="rounded-2xl bg-[#AE7AFF] hover:bg-[#9f6dff] text-black px-6 py-3 shadow-lg shadow-violet-500/20 transition-all"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 md:px-8 overflow-x-auto no-scrollbar">
                        <div className="flex min-w-max gap-2 py-3">
                            {[
                                { label: "Videos", icon: Video },
                                { label: "Playlist", icon: FolderOpen },
                                { label: "Tweets", icon: MessageSquare },
                                { label: "Subscribed", icon: Users },
                            ].map((tab) => {
                                const Icon = tab.icon;

                                return (
                                    <button
                                        key={tab.label}
                                        onClick={() => setActiveTab(tab.label)}
                                        className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === tab.label
                                            ? "bg-[#AE7AFF] text-black shadow-md"
                                            : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-8">
                    {activeTab === "Videos" && (
                        <div>
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                                        Your Uploads
                                    </h2>
                                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                        Manage and organize the videos on your channel.
                                    </p>
                                </div>

                                <Button
                                    text={
                                        <span className="flex items-center gap-2 font-semibold">
                                            <Upload className="w-4 h-4" />
                                            Upload Video
                                        </span>
                                    }
                                    onClick={() => setIsUploadModalOpen(true)}
                                    className="rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black px-5 py-3 shadow-lg transition-all hover:scale-[1.02]"
                                />
                            </div>

                            {videos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {videos.map((v) => (
                                        <div
                                            key={v._id}
                                            className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                                        >
                                            <MyChannelVideoCard
                                                video={v}
                                                onDeleteSuccess={handleVideoDeleted}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-20 px-6 text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                        <Upload className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
                                    </div>

                                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">
                                        No videos uploaded yet
                                    </h3>

                                    <p className="max-w-md mx-auto text-zinc-500 dark:text-zinc-400 mb-6">
                                        Start building your channel by uploading your first video.
                                    </p>

                                    <Button
                                        text={
                                            <span className="flex items-center gap-2 font-semibold">
                                                <Upload className="w-4 h-4" />
                                                Upload now
                                            </span>
                                        }
                                        onClick={() => setIsUploadModalOpen(true)}
                                        className="rounded-2xl bg-[#AE7AFF] text-black px-5 py-3"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Tweets" && (
                        <TweetSection
                            tweets={tweets}
                            channelOwner={channel}
                            isOwner={currentUser?._id === channel?._id}
                            onTweetSuccess={fetchChannelTweets}
                        />
                    )}

                    {activeTab === "Playlist" && (
                        <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-20 px-6 text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <FolderOpen className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Playlists coming soon</h3>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                You'll be able to organize your videos into playlists here.
                            </p>
                        </div>
                    )}
                    {activeTab === "Subscribed" && (
                        <div className="animate-fade-in">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                                    Subscriptions
                                </h2>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                    Manage the creators you follow.
                                </p>
                            </div>

                            {subscribedChannels.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {subscribedChannels.map((sub) => (
                                        <div
                                            key={sub._id}
                                            className="flex items-center justify-between p-5 rounded-[32px] border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#AE7AFF] transition-all group"
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <img
                                                    src={proxyCloudinaryUrl(sub.channels?.avatar)}
                                                    alt="avatar"
                                                    className="h-14 w-14 rounded-full border-2 border-zinc-50 dark:border-zinc-700 object-cover"
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate font-black text-zinc-900 dark:text-white">
                                                        {sub.channels?.fullname || sub.channels?.fullName}
                                                    </p>
                                                    <p className="truncate text-xs font-bold text-zinc-500">
                                                        @{sub.channels?.username}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/channel/${sub.channels?.username}`)}
                                                className="ml-4 bg-zinc-100 dark:bg-zinc-800 px-5 py-2.5 rounded-2xl text-xs font-black text-zinc-700 dark:text-zinc-200 hover:bg-[#AE7AFF] hover:text-black transition-all"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-24 text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                        <Users className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-2">No subscriptions yet</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8">
                                        Channels you subscribe to will appear here.
                                    </p>
                                    <Button
                                        text="Explore Videos"
                                        onClick={() => navigate("/")}
                                        className="rounded-2xl px-8"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isUploadModalOpen && (
                <UploadVideoModal
                    onClose={() => setIsUploadModalOpen(false)}
                    onSuccess={() => {
                        setIsUploadModalOpen(false);
                        fetchMyData();
                    }}
                />
            )}
        </div>
    );
}

export default MyChannel;