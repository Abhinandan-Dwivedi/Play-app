import './App.css'
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import api from "./Utils/axiosInstance.js";

// Components
import Navbar from "./Components/Navbar.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import UploadVideoModal from "./Components/Uploadvedio.jsx";

// Pages
import Home from "./Pages/Home.jsx";
import SearchPage from "./Pages/Searchpage.jsx";
import LoginPage from "./Pages/Login.jsx";
import SignupPage from "./Pages/Signup.jsx";
import VideoDetailPage from "./Pages/Videodetail.jsx";
import SummaryPage from "./Pages/Videosummary.jsx";
import ChannelPage from "./Pages/Channel.jsx";
import MyChannel from "./Pages/Mychannel.jsx";
import EditProfile from "./Pages/Editprofile.jsx";
import HistoryPage from "./Pages/Historypage.jsx";
import LikedVideosPage from "./Pages/Likedvideos.jsx";
import SubscribedChannels from "./Pages/Subscribedchannels.jsx";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // 👈 Prevents redirect flickers

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/user");
        if (res.data.success) {
          setIsLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(res.data.data));
        }
      } catch (err) {
        setIsLoggedIn(false);
        localStorage.removeItem("user");
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (dark) {
      console.log("Theme: Switching to Dark Mode. Adding 'dark' class to <html>.");
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      console.log("Theme: Switching to Light Mode. Removing 'dark' class from <html>.");
      document.documentElement.classList.remove('dark');
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  if (authLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#0F0F0F]">
      <div className="w-12 h-12 border-4 border-[#AE7AFF] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-[#0F0F0F] text-zinc-900 dark:text-white transition-colors duration-300">

        <Navbar
          isLoggedIn={isLoggedIn}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          dark={dark}
          setDark={setDark}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />

        <div className="flex pt-16">

          <Sidebar
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(false)}
          />

          <main className={`flex-1 transition-all duration-300 min-h-[calc(100vh-64px)] ${isSidebarOpen ? "md:pl-70" : "pl-0"}`}>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/video/:videoId" element={<VideoDetailPage />} />
              <Route path="/channel/:username" element={<ChannelPage />} />

              <Route
                path="/login"
                element={!isLoggedIn ? <LoginPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!isLoggedIn ? <SignupPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
              />

              <Route path="/video/:videoId/summary" element={<SummaryPage />} />

              <Route
                path="/my-channel"
                element={isLoggedIn ? <MyChannel /> : <Navigate to="/login" />}
              />
              <Route
                path="/edit-profile"
                element={isLoggedIn ? <EditProfile /> : <Navigate to="/login" />}
              />
              <Route
                path="/history"
                element={isLoggedIn ? <HistoryPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/liked-videos"
                element={isLoggedIn ? <LikedVideosPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/my-subscriptions"
                element={isLoggedIn ? <SubscribedChannels /> : <Navigate to="/login" />}
              />

              <Route path="*" element={<div className="p-20 text-center text-2xl font-black">404 - Page Not Found</div>} />
            </Routes>

          </main>

        </div>

        {isUploadModalOpen && (
          <UploadVideoModal onClose={() => setIsUploadModalOpen(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;