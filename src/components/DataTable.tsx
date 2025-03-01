import { useState } from 'react';
import { ParticipantData } from '../types/research';

interface DataTableProps {
  data: ParticipantData[];
  onDelete: (id: number) => void;
}

/**
 * Data table component for displaying participant records
 */
export function DataTable({ data, onDelete }: DataTableProps) {
  // State for sorting
  const [sortKey, setSortKey] = useState<keyof ParticipantData>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Default visible columns
  const DEFAULT_COLUMNS: (keyof ParticipantData)[] = [
    'id',
    'date',
    'age', 
    'sex',
    'have_you_been_abstinent_the_past_28_days',
    'phoneTime',
    'depression',
    'anxiety',
    'sleep',
    'recovery',
    'Mobile_Phone_Problematic_Use_Score',
    'Advanced_Warning_of_Relapse_Score'
  ];
  
  // Column formatting
  const COLUMN_LABELS: Record<keyof ParticipantData, string> = {
    id: 'ID',
    createdAt: 'Created',
    updatedAt: 'Updated',
    date: 'Date',
    round_of_phone_calls: 'Call Round',
    days_in_treatment: 'Days in Treatment',
    age: 'Age',
    sex: 'Sex',
    have_you_been_abstinent_the_past_28_days: 'Abstinent (28d)',
    if_yes_how_long_have_you_been_abstinent: 'Abstinence Duration',
    phoneTime: 'Phone Time (min)',
    depression: 'Depression',
    anxiety: 'Anxiety',
    sleep: 'Sleep',
    recovery: 'Recovery',
    Mobile_Phone_Problematic_Use_Score: 'MPPUS',
    Advanced_Warning_of_Relapse_Score: 'AWARE',
  };
  
  // Sorting function
  const handleSort = (key: keyof ParticipantData) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  // Sort the data
  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    
    // Handle undefined values
    if (valA === undefined) return 1;
    if (valB === undefined) return -1;
    
    // Handle different types
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    }
    
    // Default numeric comparison
    const numA = Number(valA);
    const numB = Number(valB);
    
    return sortDirection === 'asc' ? numA - numB : numB - numA;
  });
  
  // Only show data if we have records
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-center text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {DEFAULT_COLUMNS.map((column) => (
              <th
                key={column}
                onClick={() => handleSort(column)}
                className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  {COLUMN_LABELS[column]}
                  {sortKey === column && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {DEFAULT_COLUMNS.map((column) => (
                <td key={`${row.id}-${column}`} className="px-2 py-3 whitespace-nowrap text-sm text-gray-700">
                  {formatCellValue(row[column])}
                </td>
              ))}
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-700">
                <button
                  onClick={() => onDelete(row.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Helper function to format cell values for display
 */
function formatCellValue(value: any): string {
  if (value === null || value === undefined) {
    return '-';
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  return String(value);
} 