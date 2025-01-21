import { ParticipantData } from '../types/research';

interface DataTableProps {
  data: ParticipantData[];
  onDelete: (id: number) => void;
}

export function DataTable({ data, onDelete }: DataTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold">Raw Data</h2>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(data[0]).map((header) => (
                  <th
                    key={header}
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {Object.values(row).map((value, j) => (
                    <td key={j} className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {value}
                    </td>
                  ))}
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    <button
                      onClick={() => onDelete(row.id)}
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 