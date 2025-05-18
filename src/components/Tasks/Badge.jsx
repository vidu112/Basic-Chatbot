import React from "react";

export default function Badge({ text, colorClass, textColorClass = "text-black/70" }) {
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${colorClass} ${textColorClass}`}>
      {text}
    </span>
  );
}
