export default function LoadingKategori() {
  return (
    <section className="flex flex-col gap-6 py-8 animate-pulse">
      <div className="h-4 w-32 rounded bg-garis/60" />
      <div className="h-10 w-64 rounded-xl bg-garis" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
          >
            <div className="aspect-square w-full bg-permukaan" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-4 w-3/4 rounded bg-garis" />
              <div className="mt-2 h-5 w-24 rounded bg-garis/70" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}