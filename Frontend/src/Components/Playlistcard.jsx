import proxyCloudinaryUrl from "../Utils/imageProxy.js";

function Playlistcard({ playlist }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
        <img 
          src={proxyCloudinaryUrl(playlist.videos[0]?.thumbnail || "https://via.placeholder.com/400x225")} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          alt={playlist.name}
        />
        {/* Playlist Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-3xl">📂</span>
          <span className="text-white font-bold mt-2">View All</span>
        </div>
        {/* Video Count Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
           {playlist.videos?.length || 0} videos
        </div>
      </div>
      <h3 className="mt-2 font-bold dark:text-white line-clamp-1">{playlist.name}</h3>
      <p className="text-xs text-gray-500">{playlist.description || "No description"}</p>
    </div>
  );
}
export default Playlistcard;