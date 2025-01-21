interface MetricsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
}

export function MetricsCard({ title, value, subtitle }: MetricsCardProps) {
  return (
    <div className="bg-white rounded-md shadow-sm p-3 sm:p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-xl sm:text-2xl font-bold text-slate-600 mb-1">{value}</p>
      <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
    </div>
  );
} 