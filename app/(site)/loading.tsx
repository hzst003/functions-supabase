export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-4 max-w-xl animate-pulse rounded bg-slate-200" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {["a", "b", "c"].map((key) => (
          <div key={key} className="h-48 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
