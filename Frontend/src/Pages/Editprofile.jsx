import { useState, useEffect } from "react";
import api from "../Utils/axiosInstance.js";
import Input from "../Components/Input.jsx";
import Button from "../Components/Button.jsx";
import {
  User,
  Lock,
  Image,
  ImagePlus,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Camera,
} from "lucide-react";

function EditProfile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const tabs = [
    {
      id: "personal",
      label: "Profile",
      description: "Name and username",
      icon: User,
    },
    {
      id: "password",
      label: "Security",
      description: "Password settings",
      icon: ShieldCheck,
    },
    {
      id: "avatar",
      label: "Avatar",
      description: "Profile picture",
      icon: Image,
    },
    {
      id: "cover",
      label: "Cover",
      description: "Channel banner",
      icon: ImagePlus,
    },
  ];

  const PersonalInfo = () => {
    const [formData, setFormData] = useState({ fullname: "", username: "" });

    useEffect(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("user"));
        if (saved) {
          setFormData({
            fullname: saved.fullname || "",
            username: saved.username || "",
          });
        }
      } catch (e) {
        console.log(e);
      }
    }, []);

    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const res = await api.patch("/user/account", formData);
        setStatus({ type: "success", message: res.data.message });
        localStorage.setItem("user", JSON.stringify(res.data.data));
      } catch (err) {
        setStatus({
          type: "error",
          message: err.response?.data?.message || "Update failed",
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleUpdate} className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
            Personal Information
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Update how your profile appears across your channel.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5">
            <label className="mb-3 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <Input
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
                placeholder="Enter your full name"
                className="pl-12"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5">
            <label className="mb-3 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Choose a unique username"
                className="pl-12"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <Button
            text={loading ? "Saving..." : "Save Changes"}
            className="px-6"
          />
        </div>
      </form>
    );
  };

  const PasswordSettings = () => {
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

    const handlePasswordChange = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        await api.patch("/user/password", {
          currentPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        });
        setStatus({ type: "success", message: "Password updated successfully!" });
        setPasswords({ oldPassword: "", newPassword: "" });
      } catch (err) {
        setStatus({
          type: "error",
          message: err.response?.data?.message || "Password change failed",
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handlePasswordChange} className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
            Security Settings
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Keep your account protected with a stronger password.
          </p>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5">
            <label className="mb-3 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <Input
                type="password"
                value={passwords.oldPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, oldPassword: e.target.value })
                }
                className="pl-12"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5">
            <label className="mb-3 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <Input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="pl-12"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <Button
            text={loading ? "Updating..." : "Update Password"}
            variant="danger"
            className="px-6"
          />
        </div>
      </form>
    );
  };

  const ImageUploader = ({ type }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleImageUpload = async (e) => {
      e.preventDefault();
      if (!selectedFile) return;

      const data = new FormData();
      data.append(type === "avatar" ? "avatar" : "coverImage", selectedFile);

      try {
        setLoading(true);
        const endpoint = type === "avatar" ? "/user/avatar" : "/user/coverimage";
        const res = await api.patch(endpoint, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setStatus({ type: "success", message: `${type} updated!` });
        localStorage.setItem("user", JSON.stringify(res.data.data));
      } catch {
        setStatus({ type: "error", message: "Upload failed" });
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleImageUpload} className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
            {type === "avatar" ? "Profile Picture" : "Channel Cover"}
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Upload a new {type === "avatar" ? "avatar" : "cover image"} for your channel.
          </p>
        </div>

        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-[32px] border border-dashed border-zinc-300 dark:border-zinc-700 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 px-6 py-14 text-center transition-all hover:border-[#AE7AFF] hover:shadow-xl">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#AE7AFF]/10 text-[#AE7AFF] transition-all group-hover:scale-110">
            {type === "avatar" ? <Camera className="h-9 w-9" /> : <Upload className="h-9 w-9" />}
          </div>

          <p className="text-lg font-bold text-zinc-900 dark:text-white break-all">
            {selectedFile ? selectedFile.name : `Choose ${type} image`}
          </p>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Drag and drop or click to browse • PNG, JPG, WEBP
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        <div className="flex justify-end border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <Button
            text={loading ? "Uploading..." : `Update ${type}`}
            className="px-6"
          />
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-[#0B0B0D] pt-24 pb-16 px-4 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 overflow-hidden rounded-[40px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl">
          <div className="relative border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-[#AE7AFF] via-[#9a6dff] to-[#7d5fff] p-8 lg:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <h1 className="relative text-4xl lg:text-5xl font-black text-black">
              Account Settings
            </h1>
            <p className="relative mt-3 max-w-2xl text-sm lg:text-base font-semibold text-black/70">
              Manage your profile, password, avatar and channel appearance from one place.
            </p>
          </div>

          <div className="grid lg:grid-cols-[320px_1fr]">
            <aside className="border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-5">
              <div className="space-y-3 sticky top-24">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setStatus({ type: "", message: "" });
                      }}
                      className={`w-full rounded-3xl p-4 text-left transition-all duration-200 ${activeTab === tab.id
                          ? "bg-[#AE7AFF] text-black shadow-xl"
                          : "hover:bg-white dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${activeTab === tab.id
                            ? "bg-black/10"
                            : "bg-zinc-200 dark:bg-zinc-800"
                          }`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-black">{tab.label}</p>
                          <p className={`mt-1 text-xs ${activeTab === tab.id ? "text-black/70" : "text-zinc-500"
                            }`}>
                            {tab.description}
                          </p>
                        </div>

                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <main className="p-6 lg:p-10 bg-white dark:bg-zinc-950">
              {status.message && (
                <div
                  className={`mb-8 flex items-start gap-3 rounded-3xl border px-5 py-4 text-sm font-bold ${status.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
                    }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              {activeTab === "personal" && <PersonalInfo />}
              {activeTab === "password" && <PasswordSettings />}
              {activeTab === "avatar" && <ImageUploader type="avatar" />}
              {activeTab === "cover" && <ImageUploader type="cover" />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;