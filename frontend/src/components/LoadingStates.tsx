export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white p-6 shadow">
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="mt-4 h-8 w-16 rounded bg-slate-200" />
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse rounded border p-4">
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-1/2 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-1/4 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white p-6 shadow">
      <div className="mb-6 h-5 w-40 rounded bg-slate-200" />
      <div className="h-[260px] rounded bg-slate-100" />
    </div>
  );
}
