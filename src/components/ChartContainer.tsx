interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export function ChartContainer({ title, children, controls }: ChartContainerProps) {
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
        <h2 className="text-sm sm:text-base font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-2 sm:p-3">
        <div className="min-h-[400px] h-auto w-full">
          {children}
        </div>
        {controls && (
          <div className="mt-2 flex justify-center gap-2 border-t border-gray-100 pt-2">
            {controls}
          </div>
        )}
      </div>
    </div>
  );
} 