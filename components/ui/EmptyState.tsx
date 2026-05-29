export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="material-symbols-outlined mb-3 text-4xl text-primary/50">
        {icon}
      </span>
      <p className="font-medium text-on-surface">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-on-surface-variant">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
