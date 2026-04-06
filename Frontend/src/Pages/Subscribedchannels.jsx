import { useState, useEffect } from "react";
import {
    Users,
    Search,
    UserRoundPlus,
    Inbox,
} from "lucide-react";
import api from "../Utils/axiosInstance.js";
import SubscriptionCard from "../Components/Subscriptioncard.jsx";

function Subscribedchannels() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const res = await api.get("/subscriber/u/channels");
            setSubscriptions(res.data.data || []);
        } catch (err) {
            console.error("Error fetching subscriptions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleUnsubscribe = async (channelId) => {
        try {
            await api.post(`/subscriber/${channelId}`);
            setSubscriptions(prev =>
                prev.filter(sub => sub.channels._id !== channelId)
            );
        } catch (err) {
            alert("Could not unsubscribe. Try again later.");
        }
    };

    const filteredSubs = subscriptions.filter(sub => {
        const channel = sub.channels;
        return (
            channel?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            channel?.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F0F] transition-colors pt-24 px-4 md:px-8 pb-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                    <div className="px-6 py-6 md:px-8 md:py-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center flex-shrink-0 shadow-md">
                                <Users className="w-7 h-7 text-white dark:text-black" />
                            </div>

                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
                                        Subscriptions
                                    </h1>

                                    <span className="inline-flex items-center justify-center min-w-[36px] h-9 px-3 rounded-full bg-[#AE7AFF] text-black text-sm font-bold shadow-sm">
                                        {subscriptions.length}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                    Keep track of creators you follow and manage your subscriptions.
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="w-full lg:w-[360px] relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />

                            <input
                                type="text"
                                placeholder="Search by creator name or username"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 pl-12 pr-4 py-3.5 text-sm font-medium text-zinc-800 dark:text-white placeholder:text-zinc-400 outline-none transition-all focus:border-[#AE7AFF] focus:ring-4 focus:ring-[#AE7AFF]/10"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-36 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                            >
                                <div className="h-full w-full animate-pulse bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />
                            </div>
                        ))}
                    </div>
                ) : filteredSubs.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {filteredSubs.map((sub) => (
                            <div
                                key={sub._id}
                                className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200"
                            >
                                <SubscriptionCard
                                    channel={sub.channels}
                                    onUnsubscribe={() => handleUnsubscribe(sub.channels._id)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-8 py-24 text-center shadow-sm">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                            {searchTerm ? (
                                <Search className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
                            ) : (
                                <Inbox className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
                            )}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-3">
                            {searchTerm ? "No creators found" : "No subscriptions yet"}
                        </h2>

                        <p className="max-w-md mx-auto text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm md:text-base mb-6">
                            {searchTerm
                                ? `We couldn't find any creator matching “${searchTerm}”. Try a different name or username.`
                                : "Subscribe to your favorite creators and they’ll appear here for quick access."}
                        </p>

                        {!searchTerm && (
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                <UserRoundPlus className="w-4 h-4" />
                                Explore creators from your home feed
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Subscribedchannels;