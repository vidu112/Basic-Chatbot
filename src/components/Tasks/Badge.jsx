import React from "react";

export default function Badge({ text, colorClass, textColorClass = "text-black/70", fullSize = false }) {
  return (
    <span className={`px-2 ${fullSize ? 'py-2 w-full h-full flex justify-center items-stretch' : 'py-0.5'} text-xs font-semibold rounded-md ${colorClass} ${textColorClass}`}>
      {text}
    </span>
  );
}
