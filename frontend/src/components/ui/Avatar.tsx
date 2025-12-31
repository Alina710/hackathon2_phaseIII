import React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  initials,
  size = "md",
  className = "",
  ...props
}) => {
  const backgroundColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-cyan-500",
  ];

  // Generate consistent color based on initials
  const getColorIndex = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % backgroundColors.length;
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || "Avatar"}
        className={`${sizeStyles[size]} rounded-full object-cover ${className}`}
        {...props}
      />
    );
  }

  const bgColor = initials ? backgroundColors[getColorIndex(initials)] : "bg-gray-400";

  return (
    <div
      className={`${sizeStyles[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-medium ${className}`}
      {...props}
    >
      {initials}
    </div>
  );
};
