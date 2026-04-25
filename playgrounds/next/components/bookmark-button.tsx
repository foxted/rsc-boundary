"use client";

import { useState } from "react";

interface BookmarkButtonProps {
  articleId: string;
}

export function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setSaved((v) => !v)}
      className={`bookmark-btn${saved ? " bookmark-btn-saved" : ""}`}
      aria-label={
        saved
          ? `Remove bookmark for ${articleId}`
          : `Bookmark article ${articleId}`
      }
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill={saved ? "currentColor" : "none"}>
        <path
          d="M2 1.5A.5.5 0 0 1 2.5 1h7a.5.5 0 0 1 .5.5v9.207a.5.5 0 0 1-.854.353L6 7.914l-3.146 3.146A.5.5 0 0 1 2 10.707V1.5z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
