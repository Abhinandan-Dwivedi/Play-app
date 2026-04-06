import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatViews = (views) => {
  if (!views) return "0";
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K";
  return views;
};

function Videocard({ video }) {
  const navigate = useNavigate();

  const { _id, thumbnail, title, duration, views, createdAt, owner } = video;

  return (
    <div
      onClick={() => navigate(`/video/${_id}`)}
      className="flex flex-col gap-2 cursor-pointer group mb-4 w-full"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800 border dark:border-zinc-800">
        <img
          src={proxyCloudinaryUrl(thumbnail)}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-bold px-1.5 py-0.5 rounded shadow-lg">
          {formatDuration(duration)}
        </div>
      </div>

      <div className="flex gap-3 mt-1">
        <div className="flex-shrink-0 mt-1">
          <img
            onClick={(e) => { e.stopPropagation(); if (owner?.username) navigate(`/channel/${owner.username}`); }}
            src={proxyCloudinaryUrl(owner?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${owner?.username}`)}
            alt="avatar"
            className="h-9 w-9 rounded-full bg-zinc-100 object-cover border dark:border-zinc-700 cursor-pointer"
          />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col pr-1">
          <h3 className="font-bold text-sm line-clamp-2 dark:text-zinc-100 leading-snug group-hover:text-[#AE7AFF] transition-colors">
            {title}
          </h3>

          <div className="text-[12px] text-zinc-600 dark:text-zinc-400 mt-1">
            <p className="hover:text-black dark:hover:text-white transition-colors font-medium">
              {owner?.fullname || owner?.username || "Unknown Channel"}
            </p>
            <div className="flex items-center gap-1 font-medium">
              <span>{formatViews(views)} views</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Videocard;