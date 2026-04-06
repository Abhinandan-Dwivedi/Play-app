import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  ImagePlus,
  Lock,
  Mail,
  Upload,
  User,
  UserRound,
} from "lucide-react";
import api from "../Utils/axiosInstance.js";
import Input from "../Components/Input.jsx";
import Button from "../Components/Button.jsx";

function Signup({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!avatar) {
      setError("Avatar image is required");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("fullname", formData.fullname);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", avatar);

      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      const response = await api.post("/user/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("Account created successfully! Please sign in.");
        navigate("/login");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Registration failed. Try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F0F] px-4 py-10 flex items-center justify-center transition-colors">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">

        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#AE7AFF] via-[#9d69ff] to-[#7b5dff] text-black relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute bottom-0 -left-12 h-44 w-44 rounded-full bg-black/10" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/15">
                <UserRound className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wide">
                Create your account
              </span>
            </div>

            <h1 className="max-w-md text-4xl xl:text-5xl font-black leading-tight">
              Start sharing videos and build your own channel.
            </h1>

            <p className="mt-6 max-w-md text-sm xl:text-base text-black/70 leading-7 font-medium">
              Join the community, upload content, follow creators, and personalize your experience.
            </p>
          </div>

          <div className="relative z-10 rounded-3xl border border-black/10 bg-black/10 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold leading-7 text-black/75">
              “Your profile, subscriptions, uploads, and watch history will all be saved in one place.”
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Fill in your details to get started.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-4 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-6">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="jane_doe"
                    required
                    className="pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Full name
                </label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    className="pl-12"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  required
                  className="pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  required
                  className="pl-12"
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70 p-4">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <Upload className="h-4 w-4" />
                  Avatar Image *
                </div>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-600 px-4 py-6 text-center hover:border-[#AE7AFF] transition-all">
                  <ImagePlus className="h-7 w-7 text-zinc-400 mb-2" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    {avatar ? avatar.name : "Choose avatar"}
                  </span>
                  <span className="mt-1 text-xs text-zinc-400">
                    PNG, JPG or WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70 p-4">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <ImagePlus className="h-4 w-4" />
                  Cover Image
                </div>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-600 px-4 py-6 text-center hover:border-[#AE7AFF] transition-all">
                  <ImagePlus className="h-7 w-7 text-zinc-400 mb-2" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    {coverImage ? coverImage.name : "Choose cover image"}
                  </span>
                  <span className="mt-1 text-xs text-zinc-400">
                    Optional upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <Button
              text={
                <span className="flex items-center gap-2">
                  {isLoading ? "Creating Account..." : "Create Account"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </span>
              }
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2"
            />
          </form>

          <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 font-semibold text-[#AE7AFF] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;