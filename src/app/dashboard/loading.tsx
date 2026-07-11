export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-white/10 rounded-xl mb-2" />
      <div className="h-4 w-32 bg-white/10 rounded-xl mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/10 h-28" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl bg-white/10 h-64" />
        <div className="rounded-2xl bg-white/10 h-64" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/10 h-48" />
        <div className="rounded-2xl bg-white/10 h-48" />
      </div>
    </div>
  );
}