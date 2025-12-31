import React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  showLabel?: boolean;
}

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

const colorStyles = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  yellow: "bg-yellow-600",
  red: "bg-red-600",
  purple: "bg-purple-600",
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = "md",
  color = "blue",
  showLabel = false,
  className = "",
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full bg-gray-200 overflow-hidden ${sizeStyles[size]}`}
      >
        <div
          className={`${colorStyles[color]} transition-all duration-300 ease-out ${sizeStyles[size]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};
