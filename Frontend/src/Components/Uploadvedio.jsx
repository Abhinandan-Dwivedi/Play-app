import { useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    FileVideo,
    ImagePlus,
    Loader2,
    Upload,
    X,
} from "lucide-react";
import api from "../Utils/axiosInstance";
import Button from "./Button.jsx";

function UploadVideoModal({ onClose, onSuccess }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const [status, setStatus] = useState("idle");
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!videoFile || !thumbnail) {
            return alert("Please select both video and thumbnail");
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", videoFile);
        formData.append("thumbnail", thumbnail);
        formData.append("publiced", "true");

        try {
            setStatus("uploading");

            const devToken = localStorage.getItem("accessToken");
            const headers = devToken
                ? { Authorization: `Bearer ${devToken}` }
                : {};

            await api.post("/video/videoupload", formData, {
                headers,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            setStatus("success");
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0F] shadow-2xl">

                {status !== "uploading" && (
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-2xl text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                {status === "idle" && (
                    <form onSubmit={handleUpload} className="p-6 md:p-8">
                        <div className="mb-8 flex items-start gap-4 pr-12">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#AE7AFF]/15 text-[#AE7AFF]">
                                <Upload className="h-7 w-7" />
                            </div>

                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
                                    Upload New Video
                                </h2>
                                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-6 max-w-lg">
                                    Add a title, description, and upload your video with a thumbnail.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                            {/* Left */}
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        Video Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter a title for your video"
                                        className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none transition-all focus:border-[#AE7AFF] focus:ring-4 focus:ring-[#AE7AFF]/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        Description
                                    </label>
                                    <textarea
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Tell viewers what your video is about"
                                        className="min-h-[180px] w-full resize-none rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none transition-all focus:border-[#AE7AFF] focus:ring-4 focus:ring-[#AE7AFF]/10"
                                    />
                                </div>
                            </div>

                            {/* Right */}
                            <div className="space-y-5">
                                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-5">
                                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        <FileVideo className="h-4 w-4" />
                                        Video File
                                    </div>

                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-8 text-center transition-all hover:border-[#AE7AFF] hover:bg-[#AE7AFF]/5">
                                        <Upload className="mb-3 h-8 w-8 text-zinc-400" />
                                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                                            {videoFile ? videoFile.name : "Choose a video file"}
                                        </span>
                                        <span className="mt-1 text-xs text-zinc-400">
                                            MP4, MOV or WEBM
                                        </span>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            required
                                            onChange={(e) => setVideoFile(e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-5">
                                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        <ImagePlus className="h-4 w-4" />
                                        Thumbnail
                                    </div>

                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-8 text-center transition-all hover:border-[#AE7AFF] hover:bg-[#AE7AFF]/5">
                                        <ImagePlus className="mb-3 h-8 w-8 text-zinc-400" />
                                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                                            {thumbnail ? thumbnail.name : "Choose thumbnail image"}
                                        </span>
                                        <span className="mt-1 text-xs text-zinc-400">
                                            JPG, PNG or WEBP
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={(e) => setThumbnail(e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                            <Button
                                text="Cancel"
                                variant="outline"
                                onClick={onClose}
                            />

                            <Button
                                type="submit"
                                text={
                                    <span className="flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        Upload Video
                                    </span>
                                }
                                className="px-6"
                            />
                        </div>
                    </form>
                )}

                {status === "uploading" && (
                    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#AE7AFF]/10 text-[#AE7AFF]">
                            <Loader2 className="h-10 w-10 animate-spin" />
                        </div>

                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
                            Uploading your video...
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                            Please keep this window open while we upload and process your content.
                        </p>

                        <div className="mt-8 w-full max-w-md">
                            <div className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                <span>Progress</span>
                                <span>{uploadProgress}%</span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-[#AE7AFF] transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center justify-center px-8 py-20 text-center animate-in fade-in duration-300">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>

                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
                            Video uploaded successfully
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                            Your video has been uploaded and will appear on your channel shortly.
                        </p>

                        <div className="mt-8">
                            <Button
                                text="Back to Channel"
                                onClick={onClose}
                            />
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-red-500">
                            <AlertTriangle className="h-12 w-12" />
                        </div>

                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
                            Upload failed
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                            Something went wrong while uploading your video. Please try again or check your file size.
                        </p>

                        <div className="mt-8 flex gap-3">
                            <Button
                                text="Cancel"
                                variant="outline"
                                onClick={onClose}
                            />

                            <Button
                                text="Try Again"
                                onClick={() => setStatus("idle")}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploadVideoModal;