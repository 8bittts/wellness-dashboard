interface ChartControlsProps {
  activeView: string;
  onViewChange: (view: string) => void;
  views: {
    id: string;
    label: string;
    icon?: string;
  }[];
}

export function ChartControls({ activeView, onViewChange, views }: ChartControlsProps) {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          onClick={() => onViewChange(view.id)}
          className={`
            px-4 py-2 text-sm font-medium
            ${
              activeView === view.id
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }
            ${view.id === views[0].id ? 'rounded-l-lg' : ''}
            ${view.id === views[views.length - 1].id ? 'rounded-r-lg' : ''}
            border border-gray-200
            focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-700
            transition-colors duration-200
          `}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
} 