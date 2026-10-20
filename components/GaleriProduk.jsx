"use client";

import { useState } from "react";

export default function GaleriProduk({ fotoUtama, fotoTambahan = [], nama }) {
  const semuaFoto = [
    fotoUtama,
    ...(Array.isArray(fotoTambahan) ? fotoTambahan : []),
  ].filter(Boolean);

  const [indeksAktif, setIndeksAktif] = useState(0);

  const fotoAktif = semuaFoto[indeksAktif] || fotoUtama;

  return (
    <div className="flex flex-col gap-3">
      {/* Foto Utama Besar */}
      <div className="overflow-hidden rounded-2xl border border-garis bg-permukaan">
        <img
          src={fotoAktif}
          alt={nama}
          className="aspect-square w-full object-cover transition-all duration-200"
        />
      </div>

      {/* Baris Thumbnail (hanya jika ada lebih dari 1 foto - US-18) */}
      {semuaFoto.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-1" aria-label="Galeri foto produk">
          {semuaFoto.map((foto, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setIndeksAktif(idx)}
              aria-label={`Lihat foto ${idx + 1}`}
              className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                indeksAktif === idx
                  ? "border-utama ring-2 ring-utama/20 scale-105"
                  : "border-garis opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={foto}
                alt=""
                className="h-full w-full object-cover bg-permukaan"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}