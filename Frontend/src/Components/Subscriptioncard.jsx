import Button from "./Button.jsx";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";

function SubscriberCard({ channel, onUnsubscribe }) {
    return (
        <div className="flex items-center justify-between p-4 md:p-6 border dark:border-gray-800 rounded-3xl bg-white dark:bg-gray-900/40 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4">
                <img 
                    src={proxyCloudinaryUrl(channel.avatar)} 
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-transparent group-hover:border-[#AE7AFF] transition-all" 
                    alt="avatar" 
                />
                <div>
                    <h3 className="font-bold dark:text-white text-base md:text-lg">{channel.fullname || channel.username}</h3>
                    <p className="text-xs text-gray-500 font-medium">@{channel.username}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                        {channel.subscribersCount || 0} Subscribers
                    </p>
                </div>
            </div>
            
            <div className="flex gap-2">
                <Button 
                    text="Unsubscribe" 
                    variant="outline" 
                    onClick={() => onUnsubscribe(channel._id)}
                    className="text-xs px-4 h-9 border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                />
            </div>
        </div>
    );
}

export default SubscriberCard;