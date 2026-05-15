type EmptyStateProps = {
  title: string;
  description: string;
  buttonText?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title,
  description,
  buttonText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <span className="text-2xl">📭</span>
      </div>

      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>

      {buttonText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
