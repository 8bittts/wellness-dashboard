interface MetricsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
}

export function MetricsCard({ title, value, subtitle }: MetricsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-600 mb-2">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
} 