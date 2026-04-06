import { useState } from "react";

function Input({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    onKeyDown,
    name,
    error,
    disabled = false,
    className = "",
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className={`w-full`}>

            {label && (
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    type={isPassword && showPassword ? "text" : type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        w-full px-3 py-2 outline-none
                        transition duration-200
                        bg-white text-black
                        dark:bg-zinc-900 dark:text-white
                        ${disabled ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : ""}
                        focus:ring-2 focus:ring-blue-950
                        ${error ? "border-red-500" : ""}
                        ${className}
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

export default Input;