import { useState } from 'react';
import { ParticipantData } from '../types/research';

interface DataEntryFormProps {
  onSubmit: (data: ParticipantData) => void;
  nextId: number;
}

export function DataEntryForm({ onSubmit, nextId }: DataEntryFormProps) {
  const initialState: ParticipantData = {
    id: nextId,
    date: new Date().toLocaleDateString(),
    age: 0,
    sex: 'm' as const,
    phoneTime: 0,
    depression: 0,
    anxiety: 0,
    sleep: 0,
    recovery: 0
  };

  const [formData, setFormData] = useState<ParticipantData>(initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(prev => ({
      ...initialState,
      id: prev.id + 1
    }));
  };

  const handleInputChange = (field: keyof ParticipantData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sex</label>
          <select
            value={formData.sex}
            onChange={(e) => handleInputChange('sex', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          >
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Time (min)</label>
          <input
            type="number"
            value={formData.phoneTime || ''}
            onChange={(e) => handleInputChange('phoneTime', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Depression Score</label>
          <input
            type="number"
            value={formData.depression || ''}
            onChange={(e) => handleInputChange('depression', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Anxiety Score</label>
          <input
            type="number"
            value={formData.anxiety || ''}
            onChange={(e) => handleInputChange('anxiety', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sleep Score</label>
          <input
            type="number"
            value={formData.sleep || ''}
            onChange={(e) => handleInputChange('sleep', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Recovery Score</label>
          <input
            type="number"
            value={formData.recovery || ''}
            onChange={(e) => handleInputChange('recovery', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        <div className="col-span-2 md:col-span-4">
          <button
            type="submit"
            className="w-full bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Add Entry
          </button>
        </div>
      </form>
    </div>
  );
} 