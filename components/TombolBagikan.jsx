"use client";

import { useState } from "react";

export default function TombolBagikan({ nama, deskripsi }) {
  const [tersalin, setTersalin] = useState(false);

  async function handleBagikan() {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: nama,
          text: deskripsi || nama,
          url,
        });
        return;
      } catch (err) {
        // Jika dibatalkan user (AbortError), jangan lakukan apa-apa
        if (err.name === "AbortError") {
          return;
        }
      }
    }

    // Fallback ke salin link di clipboard
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback untuk browser lama
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }

      setTersalin(true);
      setTimeout(() => setTersalin(false), 2500);
    } catch {
      alert("Gagal menyalin tautan.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleBagikan}
      aria-live="polite"
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama sm:self-start"
    >
      {tersalin ? (
        <>
          <span className="text-utama">✓</span>
          <span className="text-utama">Link tersalin!</span>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Bagikan</span>
        </>
      )}
    </button>
  );
}