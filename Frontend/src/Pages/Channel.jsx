import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Check,
    Edit3,
    Loader2,
    MessageSquare,
    Play,
    Users,
    Video,
    FolderOpen,
    ArrowRight,
} from "lucide-react";
import api from "../Utils/axiosInstance.js";
import VideoCard from "../Components/Videocard.jsx";
import Button from "../Components/Button.jsx";
import TweetSection from "../Components/Tweetsection.jsx";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";

function ChannelPage() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [channel, setChannel] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState("Videos");
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [localSubCount, setLocalSubCount] = useState(0);
    const [tweets, setTweets] = useState([]);
    const [videos, setVideos] = useState([]);
    const [subscribedChannels, setSubscribedChannels] = useState([]);

    const fetchSubscribedChannels = async () => {
        try {
            setLoading(true);
            const res = await api.get("/subscriber/u/channels");
            setSubscribedChannels(res.data.data || []);
        } catch (err) {
            console.error("Error fetching subscriptions:", err);
            setSubscribedChannels([]);
        } finally {
            setLoading(false);
        }
    };
    const fetchChannelVideos = async () => {
        try {
            const res = await api.get(`/video/videos?userId=${channel._id}`);

            setVideos(res.data.data.videos || []);
        } catch (err) {
            console.error("Error fetching channel videos:", err);
            setVideos([]);
        }
    };

    const fetchChannelTweets = async () => {
        try {
            const res = await api.get(`/tweet/${channel._id}`);
            setTweets(res.data.data.tweets || []);
        } catch (err) {
            console.error("Error fetching tweets:", err);
            setTweets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!channel?._id) return;

        if (activeTab === "Videos") fetchChannelVideos();
        if (activeTab === "Tweets" && channel?._id) {
            fetchChannelTweets();
        }
        if (activeTab === "Subscribed") fetchSubscribedChannels();
    }, [activeTab, channel?._id]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/user/c/${username}`);
                const data = res.data.data;

                setChannel(data);
                setIsSubscribed(data.isSubscribed);
                setLocalSubCount(data.subscribersCount || 0);

                const savedUser = localStorage.getItem("user");
                if (savedUser) setCurrentUser(JSON.parse(savedUser));
            } catch (err) {
                console.error("Error fetching channel data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [username]);

    const toggleSubscription = async () => {
        try {
            const previousStatus = isSubscribed;
            setIsSubscribed(!previousStatus);
            setLocalSubCount((prev) => (previousStatus ? prev - 1 : prev + 1));

            await api.post(`/subscriber/c/${channel._id}`);
        } catch (err) {
            setIsSubscribed(isSubscribed);
            setLocalSubCount(channel.subscribersCount);
            alert("Action failed. Please login to subscribe.");
        }
    };

    if (loading)
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#0F0F0F]">
                <div className="text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#AE7AFF]/10 text-[#AE7AFF]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                        Loading channel...
                    </p>
                </div>
            </div>
        );

    if (!channel)
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-[#0F0F0F] px-6 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                    <Users className="h-10 w-10 text-zinc-400" />
                </div>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
                    Channel not found
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    The creator you are looking for may not exist or may have been removed.
                </p>
                <Button
                    text="Return Home"
                    onClick={() => navigate("/")}
                    className="mt-6"
                />
            </div>
        );

    const isOwner =
        currentUser?._id === channel?._id ||
        currentUser?.username === channel?.username;

    const tabs = [
        { label: "Videos", icon: Video },
        { label: "Playlist", icon: FolderOpen },
        { label: "Tweets", icon: MessageSquare },
        { label: "Subscribed", icon: Users },
    ];

    const EmptyState = ({ icon: Icon, title, message }) => (
        <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-8 py-20 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Icon className="h-10 w-10 text-zinc-500 dark:text-zinc-400" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                {title}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {message}
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F0F] pb-16 transition-colors">
            <div className="relative h-44 md:h-72 lg:h-80 overflow-hidden">
                <img
                    src={proxyCloudinaryUrl(channel.coverImage)}
                    alt="Banner"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 md:-mt-20 md:px-8 lg:px-12">
                <div className="overflow-hidden rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col gap-8 px-6 py-6 md:px-8 md:py-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex flex-col items-center gap-5 md:flex-row md:items-end md:gap-6">
                            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-200 shadow-xl md:h-40 md:w-40">
                                <img
                                    src={proxyCloudinaryUrl(channel.avatar)}
                                    alt="Avatar"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-4xl">
                                    {channel.fullname}
                                </h1>
                                <p className="mt-1 text-base font-medium text-zinc-500 dark:text-zinc-400">
                                    @{channel.username}
                                </p>

                                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                    <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        <Users className="h-4 w-4" />
                                        {localSubCount} subscribers
                                    </div>

                                    <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        <Video className="h-4 w-4" />
                                        {channel.videos?.length || 0} videos
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            {isOwner ? (
                                <Button
                                    text={
                                        <span className="flex items-center gap-2">
                                            <Edit3 className="h-4 w-4" />
                                            Edit Profile
                                        </span>
                                    }
                                    onClick={() => navigate("/edit-profile")}
                                />
                            ) : (
                                <button
                                    onClick={toggleSubscription}
                                    className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all ${isSubscribed
                                        ? "border border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                        : "bg-[#AE7AFF] text-black shadow-lg shadow-violet-500/20 hover:bg-[#9d69ff]"
                                        }`}
                                >
                                    {isSubscribed ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Subscribed
                                        </>
                                    ) : (
                                        <>
                                            <Users className="h-4 w-4" />
                                            Subscribe
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-zinc-200 px-4 dark:border-zinc-800 md:px-8">
                        <div className="flex min-w-max gap-2 overflow-x-auto py-3 no-scrollbar">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.label}
                                        onClick={() => setActiveTab(tab.label)}
                                        className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === tab.label
                                            ? "bg-[#AE7AFF] text-black shadow-md"
                                            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    {activeTab === "Videos" && (
                        <>

                            {videos.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {videos.map((v) => (
                                        <div
                                            key={v._id}
                                            className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                                        >
                                            <VideoCard video={v} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Play}
                                    title="No videos uploaded"
                                    message="This creator hasn't posted any videos yet."
                                />
                            )}
                        </>
                    )}

                    {activeTab === "Tweets" && (
                        <TweetSection
                            tweets={tweets}
                            channelOwner={channel}
                            isOwner={currentUser?._id === channel?._id}
                        />
                    )}

                    {activeTab === "Subscribed" && (
                        <>
                            {subscribedChannels.length > 0 ? (
                                <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
                                    {subscribedChannels.map((sub) => (
                                        <div
                                            key={sub._id}
                                            className="flex items-center justify-between rounded-3xl border-2 border-zinc-100 dark:border-zinc-800 bg-white p-5 shadow-sm transition-all hover:border-[#AE7AFF] hover:shadow-lg dark:bg-zinc-900"
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <img
                                                    src={proxyCloudinaryUrl(sub.channels?.avatar)}
                                                    alt="avatar"
                                                    className="h-14 w-14 rounded-full border-2 border-zinc-100 object-cover dark:border-zinc-700"
                                                />

                                                <div className="min-w-0">
                                                    <p className="truncate font-black text-zinc-900 dark:text-white">
                                                        {sub.channels?.fullname || sub.channels?.fullName}
                                                    </p>
                                                    <p className="mt-1 truncate text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                                        @{sub.channels?.username}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/channel/${sub.channels?.username}`)}
                                                className="ml-4 inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-5 py-2.5 text-xs font-black text-zinc-700 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200"
                                            >
                                                View
                                                <ArrowRight className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Users}
                                    title="No public subscriptions"
                                    message="This user's subscriptions are private or they haven't followed anyone yet."
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ChannelPage;