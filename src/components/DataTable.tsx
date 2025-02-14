import { useState } from 'react';
import { ParticipantData } from '../types/research';

interface DataTableProps {
  data: ParticipantData[];
  onDelete: (id: number) => void;
}

type SortConfig = {
  key: keyof ParticipantData;
  direction: 'asc' | 'desc';
};

export function DataTable({ data, onDelete }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'asc' });

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === 'date') {
      const dateA = new Date(aValue as string);
      const dateB = new Date(bValue as string);
      return sortConfig.direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return sortConfig.direction === 'asc' ? 
      (aValue as number) - (bValue as number) : 
      (bValue as number) - (aValue as number);
  });

  const handleSort = (key: keyof ParticipantData) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Reorder columns to show date first, then id, then the rest
  const orderedKeys = ['date', 'id', ...Object.keys(data[0]).filter(key => !['date', 'id'].includes(key))] as (keyof ParticipantData)[];

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
                {orderedKeys.map((header) => (
                  <th
                    key={header}
                    onClick={() => handleSort(header)}
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      {header}
                      {sortConfig.key === header && (
                        <span className="text-gray-400">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {orderedKeys.map((key) => (
                    <td key={key} className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {row[key]}
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