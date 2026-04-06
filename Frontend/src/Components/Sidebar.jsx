import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
    Home,
    Users,
    History,
    Video,
    ThumbsUp,
    LogOut,
    LogIn,
    Menu,
    PlaySquare,
} from "lucide-react";

function Sidebar({ isLoggedIn, setIsLoggedIn, isOpen, toggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        if (!window.confirm("Are you sure you want to logout?")) return;

        try {
            await axios.post(
                "/api/v1/user/logout",
                {},
                { withCredentials: true }
            );

            localStorage.removeItem("user");
            setIsLoggedIn(false);
            toggleSidebar();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            setIsLoggedIn(false);
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    const menuItems = [
        { label: "Home", icon: Home, path: "/" },
        {
            label: "Liked Videos",
            icon: ThumbsUp,
            path: "/liked-videos",
            authRequired: true,
        },
        {
            label: "History",
            icon: History,
            path: "/history",
            authRequired: true,
        },
        {
            label: "My Channel",
            icon: Video,
            path: "/my-channel",
            authRequired: true,
        },
        {
            label: "Subscribers",
            icon: Users,
            path: "/my-subscriptions",
            authRequired: true,
        },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 flex h-full w-[280px] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
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
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#AE7AFF] text-black shadow-sm">
                                <PlaySquare className="h-5 w-5 fill-current" />
                            </div>

                            <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                                PLAY
                            </span>
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
                    {menuItems.map((item) => {
                        if (item.authRequired && !isLoggedIn) return null;

                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.label}
                                onClick={() => {
                                    navigate(item.path);
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                                className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive
                                        ? "bg-[#AE7AFF] text-black shadow-md"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                                    }`}
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${isActive
                                            ? "bg-black/10"
                                            : "bg-zinc-100 dark:bg-zinc-900 group-hover:bg-white dark:group-hover:bg-zinc-800"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 flex-shrink-0">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-4 rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-950/30"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                                <LogOut className="h-5 w-5" />
                            </div>
                            <span>Logout</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                navigate("/login");
                                toggleSidebar();
                            }}
                            className="flex w-full items-center gap-4 rounded-2xl bg-[#AE7AFF] px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-violet-500/20 transition-all hover:bg-[#9d69ff] hover:-translate-y-[1px]"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/10">
                                <LogIn className="h-5 w-5" />
                            </div>
                            <span>Sign In</span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}

export default Sidebar;