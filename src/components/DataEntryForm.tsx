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
    round_of_phone_calls: 1,
    days_in_treatment: 0,
    age: 0,
    sex: 'm' as const,
    have_you_been_abstinent_the_past_28_days: 'yes' as const,
    if_yes_how_long_have_you_been_abstinent: '0 days',
    phoneTime: 0,
    depression: 0,
    anxiety: 0,
    sleep: 0,
    recovery: 0,
    Mobile_Phone_Problematic_Use_Score: 0,
    Advanced_Warning_of_Relapse_Score: 0
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
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Entry</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Round of Phone Calls</label>
          <input
            type="number"
            value={formData.round_of_phone_calls || ''}
            onChange={(e) => handleInputChange('round_of_phone_calls', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Days in Treatment</label>
          <input
            type="number"
            value={formData.days_in_treatment || ''}
            onChange={(e) => handleInputChange('days_in_treatment', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
          <select
            value={formData.sex}
            onChange={(e) => handleInputChange('sex', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          >
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Abstinent Past 28 Days?</label>
          <select
            value={formData.have_you_been_abstinent_the_past_28_days}
            onChange={(e) => handleInputChange('have_you_been_abstinent_the_past_28_days', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Days Abstinent</label>
          <input
            type="text"
            value={formData.if_yes_how_long_have_you_been_abstinent}
            onChange={(e) => handleInputChange('if_yes_how_long_have_you_been_abstinent', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
            placeholder="e.g. 30 days"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Time (min)</label>
          <input
            type="number"
            value={formData.phoneTime || ''}
            onChange={(e) => handleInputChange('phoneTime', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Depression Score</label>
          <input
            type="number"
            value={formData.depression || ''}
            onChange={(e) => handleInputChange('depression', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anxiety Score</label>
          <input
            type="number"
            value={formData.anxiety || ''}
            onChange={(e) => handleInputChange('anxiety', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Score</label>
          <input
            type="number"
            value={formData.sleep || ''}
            onChange={(e) => handleInputChange('sleep', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recovery Score</label>
          <input
            type="number"
            value={formData.recovery || ''}
            onChange={(e) => handleInputChange('recovery', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone Problematic Use Score</label>
          <input
            type="number"
            value={formData.Mobile_Phone_Problematic_Use_Score || ''}
            onChange={(e) => handleInputChange('Mobile_Phone_Problematic_Use_Score', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Advanced Warning of Relapse Score</label>
          <input
            type="number"
            value={formData.Advanced_Warning_of_Relapse_Score || ''}
            onChange={(e) => handleInputChange('Advanced_Warning_of_Relapse_Score', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 text-sm"
          />
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
          >
            Add Entry
          </button>
        </div>
      </form>
    </div>
  );
} 