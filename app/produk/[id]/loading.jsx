export default function LoadingDetailProduk() {
  return (
    <article className="grid gap-8 py-8 animate-pulse md:grid-cols-2 md:py-12">
      {/* Skeleton Foto Produk */}
      <div className="aspect-square w-full rounded-2xl border border-garis bg-permukaan" />

      {/* Skeleton Detail Info */}
      <div className="flex flex-col gap-4">
        <div className="h-4 w-28 rounded bg-garis/60" />
        <div className="h-3 w-20 rounded bg-garis/40" />
        <div className="h-8 w-4/5 rounded bg-garis" />
        <div className="h-7 w-32 rounded bg-harga-latar/50" />
        <div className="flex flex-col gap-2 pt-2">
          <div className="h-4 w-full rounded bg-garis/50" />
          <div className="h-4 w-5/6 rounded bg-garis/50" />
          <div className="h-4 w-2/3 rounded bg-garis/50" />
        </div>
        <div className="mt-4 h-12 w-48 rounded-lg bg-garis" />
      </div>
    </article>
  );
}