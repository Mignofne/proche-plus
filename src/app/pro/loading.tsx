export default function ProLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse p-6">
      <div className="mb-6 h-14 rounded-2xl bg-cream-dark" />
      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <div className="h-20 rounded-2xl bg-cream-dark" />
        <div className="h-20 rounded-2xl bg-cream-dark" />
        <div className="h-20 rounded-2xl bg-cream-dark" />
        <div className="h-20 rounded-2xl bg-cream-dark" />
      </div>
      <div className="space-y-3">
        <div className="h-24 rounded-2xl bg-cream-dark" />
        <div className="h-24 rounded-2xl bg-cream-dark" />
      </div>
    </div>
  );
}
