"use client";

import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

export default function TombolHapusProduk({ id }) {
  return (
    <form
      action={hapusProduk}
      onSubmit={(event) => {
        if (!window.confirm("Hapus produk ini? Tindakan tidak bisa dibatalkan.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Tombol type="submit" varian="bahaya">
        Hapus
      </Tombol>
    </form>
  );
}