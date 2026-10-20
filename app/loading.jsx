export default function LoadingKatalog() {
  return (
    <div className="flex flex-col gap-8 py-10 animate-pulse sm:py-14">
      {/* Skeleton Header Toko */}
      <div className="flex flex-col gap-3">
        <div className="h-10 w-3/4 max-w-md rounded-xl bg-garis sm:h-12" />
        <div className="h-5 w-full max-w-lg rounded-lg bg-garis/60" />
        <div className="h-4 w-40 rounded-lg bg-garis/40" />
      </div>

      {/* Skeleton Filter */}
      <div className="h-20 w-full rounded-2xl border border-garis bg-permukaan" />

      {/* Skeleton Grid Produk */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
          >
            <div className="aspect-square w-full bg-permukaan" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-3 w-16 rounded bg-garis/60" />
              <div className="h-4 w-3/4 rounded bg-garis" />
              <div className="mt-2 h-5 w-24 rounded bg-garis/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}