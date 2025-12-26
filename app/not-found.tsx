export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
      <a href="/" className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-white">Go Home</a>
    </div>
  );
}
