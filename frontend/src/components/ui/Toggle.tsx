import React, { useState } from "react";

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-5 w-9 after:h-3 after:w-3",
  md: "h-6 w-11 after:h-4 after:w-4",
  lg: "h-7 w-13 after:h-5 after:w-5",
};

const afterTranslateStyles = {
  sm: "translate-x-4",
  md: "translate-x-5",
  lg: "translate-x-6",
};

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${checked ? "bg-blue-600" : "bg-gray-200"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${sizeStyles[size]}
        `}
        role="switch"
        aria-checked={checked}
        {...props}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow ring-0
            transition-transform duration-200 ease-in-out
            ${checked ? afterTranslateStyles[size] : "translate-x-0"}
            ${sizeStyles[size].split(' ').find(s => s.startsWith('after:h'))?.replace('after:h', 'h')}
          `}
        />
      </button>
      {label && (
        <span className="ml-3 text-sm text-gray-700">{label}</span>
      )}
    </div>
  );
};
