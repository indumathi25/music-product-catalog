interface EmptyStateProps {
    title: string;
    description: string;
    action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center" role="status">
            <div className="mb-4 text-6xl" aria-hidden="true">🎵</div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="mt-6 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
