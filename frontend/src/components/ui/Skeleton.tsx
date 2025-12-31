import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

const variantStyles = {
  text: "rounded",
  rectangular: "rounded-lg",
  circular: "rounded-full",
};

const animationStyles = {
  pulse: "animate-pulse",
  wave: "animate-shimmer",
  none: "",
};

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-gray-200 ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={{
        width: width || "100%",
        height: height || variant === "text" ? "1em" : "auto",
      }}
      {...props}
    />
  );
};

// Pre-built skeleton components for common patterns
export const CardSkeleton: React.FC = () => (
  <div className="p-6 border border-gray-200 rounded-xl">
    <div className="flex items-start justify-between mb-4">
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={80} height={24} />
    </div>
    <Skeleton variant="text" width="80%" height={24} className="mb-2" />
    <Skeleton variant="text" width="60%" height={20} className="mb-4" />
    <div className="flex gap-2 mt-4">
      <Skeleton variant="rectangular" width={60} height={28} />
      <Skeleton variant="rectangular" width={60} height={28} />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <tr className="border-b border-gray-100">
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" width={200} />
      </div>
    </td>
    <td className="py-4 px-6">
      <Skeleton variant="rectangular" width={80} height={24} />
    </td>
    <td className="py-4 px-6">
      <Skeleton variant="rectangular" width={80} height={24} />
    </td>
    <td className="py-4 px-6">
      <Skeleton variant="text" width={120} />
    </td>
    <td className="py-4 px-6">
      <Skeleton variant="text" width={120} />
    </td>
    <td className="py-4 px-6">
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={32} height={32} />
        <Skeleton variant="rectangular" width={32} height={32} />
      </div>
    </td>
  </tr>
);
