import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import proxyCloudinaryUrl from "../Utils/imageProxy.js";
import {
    Home,
    Search,
    Bell,
    Video,
    X,
    Sun,
    Moon,
    Menu,
    PlaySquare,
    Plus,
} from "lucide-react";

function Navbar({ isLoggedIn, toggleSidebar, dark, setDark, onUploadClick }) {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        const saved = localStorage.getItem("user");
        setUser(saved ? JSON.parse(saved) : null);
    }, [isLoggedIn]);

    const handleSearch = () => {
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <nav className="fixed top-0 left-0 z-[60] flex h-16 w-full items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0F0F0F]/95 backdrop-blur-xl px-3 sm:px-4 transition-colors">

            {/* Left */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                    onClick={toggleSidebar}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 rounded-xl px-2 py-1 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#AE7AFF] text-black shadow-sm">
                        <PlaySquare className="h-4 w-4 fill-current" />
                    </div>

                    <span className="hidden sm:block text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                        PLAY
                    </span>
                </button>
            </div>

            {/* Center Search */}
            <div className="mx-3 flex flex-1 max-w-2xl items-center justify-center">
                <div className="flex w-full items-center overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus-within:border-[#AE7AFF] focus-within:ring-4 focus-within:ring-[#AE7AFF]/10 transition-all">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                        <Input
                            placeholder="Search videos, creators..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="border-0 bg-transparent pl-11 pr-10 h-11 rounded-none shadow-none focus:ring-0 dark:bg-transparent"
                        />

                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleSearch}
                        className="flex h-11 items-center gap-2 border-l border-zinc-200 dark:border-zinc-700 px-4 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        <Search className="h-4 w-4" />
                        <span className="hidden sm:block">Search</span>
                    </button>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                    onClick={() => setDark(!dark)}  
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 border border-transparent active:scale-90"
                    title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                     <div className="transition-transform duration-300 rotate-0 dark:rotate-[360deg]">
                        {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
                    </div>
                </button>

                {isLoggedIn ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            onClick={onUploadClick || (() => navigate("/my-channel"))}
                            className="hidden md:flex h-10 items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Create</span>
                        </button>

                        <button
                            className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        >
                            <Bell className="h-5 w-5" />
                        </button>

                        <button
                            onClick={() => navigate("/my-channel")}
                            className="ml-1 rounded-full transition-all hover:scale-105 active:scale-95"
                        >
                            <img
                                src={proxyCloudinaryUrl(
                                    user?.avatar ||
                                    "https://api.dicebear.com/7.x/initials/svg?seed=User"
                                )}
                                alt="Profile"
                                className="h-10 w-10 rounded-full border-2 border-transparent object-cover hover:border-[#AE7AFF]"
                            />
                        </button>
                    </div>
                ) : (
                    <Button
                        text={
                            <span className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Sign in
                            </span>
                        }
                        onClick={() => navigate("/login")}
                        className="px-4 py-2"
                    />
                )}
            </div>
        </nav>
    );
}

export default Navbar;