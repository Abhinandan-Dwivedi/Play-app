import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Lock,
  Mail,
  User,
} from "lucide-react";
import api from "../Utils/axiosInstance.js";
import Input from "../Components/Input.jsx";
import Button from "../Components/Button.jsx";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        username: loginData.username || loginData.email,
        email: loginData.email || loginData.username,
        password: loginData.password,
      };

      const response = await api.post("/user/login", payload, {
        withCredentials: true,
      });

      if (response.data.success) {
        setIsLoggedIn(true);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.data.user)
        );

        if (response.data.data.accessToken)
          localStorage.setItem(
            "accessToken",
            response.data.data.accessToken
          );

        if (response.data.data.refreshToken)
          localStorage.setItem(
            "refreshToken",
            response.data.data.refreshToken
          );

        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Invalid credentials. Please try again.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F0F] px-4 py-10 flex items-center justify-center transition-colors">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#AE7AFF] via-[#9d69ff] to-[#7a5cff] text-black relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-white/10" />
          <div className="absolute bottom-0 -left-10 h-40 w-40 rounded-full bg-black/10" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/15">
                <Lock className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">
                Welcome back
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black leading-tight max-w-md">
              Sign in to continue watching and creating.
            </h1>

            <p className="mt-6 max-w-md text-sm xl:text-base text-black/70 leading-7 font-medium">
              Access your subscriptions, uploads, watch history, and everything you’ve saved.
            </p>
          </div>

          <div className="relative z-10 rounded-3xl bg-black/10 p-5 backdrop-blur-sm border border-black/10">
            <p className="text-sm font-semibold leading-7 text-black/75">
              “Keep your account secure and pick up right where you left off.”
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Use your account to continue.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-4 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-6">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  name="username"
                  type="text"
                  value={loginData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  className="pl-12"
                />
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
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-semibold text-[#AE7AFF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="pl-12"
                />
              </div>
            </div>

            <Button
              text={
                <span className="flex items-center gap-2">
                  {isLoading ? "Signing in..." : "Sign in"}
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
              Don’t have an account?
              <Link
                to="/signup"
                className="ml-2 font-semibold text-[#AE7AFF] hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
