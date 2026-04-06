import React from "react";

function VideoSkeleton({ showAvatar = true }) {
    return (
        <div className="flex flex-col gap-3 mb-4 animate-pulse">

            <div className="relative aspect-video w-full bg-gray-200 dark:bg-zinc-800 rounded-xl" />

            <div className="flex gap-3 px-1 mt-1">

                {showAvatar && (
                    <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-zinc-800 flex-shrink-0" />
                )}

                <div className="flex flex-col gap-2 w-full">
                    <div className="h-4 w-[90%] bg-gray-200 dark:bg-zinc-800 rounded-md" />
                    <div className="h-4 w-[40%] bg-gray-200 dark:bg-zinc-800 rounded-md" />

                    <div className="h-3 w-[60%] bg-gray-100 dark:bg-zinc-900 rounded-md mt-1" />
                </div>
            </div>
        </div>
    );
}

export default VideoSkeleton;