import React from 'react';
import { CropInput } from '../types';
import { Sprout, Droplets, Thermometer, Wind, CloudRain, Clock, FlaskConical, TreePine } from 'lucide-react';

interface CropFormProps {
  onSubmit: (data: CropInput) => void;
  loading: boolean;
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all";
const labelClass = "block text-sm font-medium text-gray-700 mb-2";
const smallLabelClass = "block text-xs font-medium text-gray-500 mb-1.5";
const sectionTitle = "text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100";

export default function CropForm({ onSubmit, loading }: CropFormProps) {
  const [formData, setFormData] = React.useState<CropInput>({
    category: 'Crops',
    soilType: 'Loamy',
    nitrogen: 80,
    phosphorus: 40,
    potassium: 40,
    ph: 6.5,
    moisture: 50,
    temperature: 25,
    humidity: 60,
    rainfall: 800,
    waterAvailability: 'Medium',
    irrigation: true,
    duration: 'Medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
               type === 'number' ? parseFloat(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Category Toggle */}
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Select Type</p>
        <div className="grid grid-cols-2 gap-2">
          {(['Crops', 'Trees'] as const).map(cat => (
            <button key={cat} type="button" onClick={() => setFormData(p => ({ ...p, category: cat }))}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                formData.category === cat
                  ? 'bg-green-600 text-white shadow-md shadow-green-100'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-green-300'
              }`}>
              {cat === 'Crops' ? <Sprout className="w-4 h-4" /> : <TreePine className="w-4 h-4" />}
              {cat === 'Trees' ? 'Trees / Fruits' : 'Crops'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Soil Parameters */}
        <div>
          <h3 className={sectionTitle}><Sprout className="w-3.5 h-3.5" /> Soil Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Soil Type</label>
              <select name="soilType" value={formData.soilType} onChange={handleChange} className={inputClass}>
                {['Clay', 'Sandy', 'Loamy', 'Black', 'Red'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={smallLabelClass}>NPK Values</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'nitrogen', label: 'N' },
                  { name: 'phosphorus', label: 'P' },
                  { name: 'potassium', label: 'K' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 text-center">{f.label}</label>
                    <input type="number" name={f.name} value={(formData as any)[f.name]}
                      onChange={handleChange} className={inputClass + " text-center px-1"} />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1.5">
                  <FlaskConical className="w-3 h-3" /> Soil pH
                </label>
                <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1.5">
                  <Droplets className="w-3 h-3" /> Moisture %
                </label>
                <input type="number" name="moisture" value={formData.moisture} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Climate Parameters */}
        <div>
          <h3 className={sectionTitle}><Thermometer className="w-3.5 h-3.5" /> Climate Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                <Thermometer className="w-3.5 h-3.5 text-orange-400" /> Temperature (°C)
              </label>
              <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                <Wind className="w-3.5 h-3.5 text-blue-400" /> Humidity (%)
              </label>
              <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                <CloudRain className="w-3.5 h-3.5 text-blue-500" /> Rainfall (mm/year)
              </label>
              <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Water & Time */}
        <div>
          <h3 className={sectionTitle}><Clock className="w-3.5 h-3.5" /> Water & Time</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Water Availability</label>
              <select name="waterAvailability" value={formData.waterAvailability} onChange={handleChange} className={inputClass}>
                {['Low', 'Medium', 'High'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Desired Duration</label>
              <select name="duration" value={formData.duration} onChange={handleChange} className={inputClass}>
                {['Short', 'Medium', 'Long'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
              <input type="checkbox" name="irrigation" checked={formData.irrigation} onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 shrink-0" />
              <span className="text-sm font-medium text-gray-700">Irrigation Available</span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <button type="submit" disabled={loading}
          className="w-full py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-base sm:text-lg">
          {loading ? (
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {formData.category === 'Trees' ? <TreePine className="w-5 h-5 sm:w-6 sm:h-6" /> : <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />}
              Get {formData.category === 'Trees' ? 'Tree' : 'Crop'} Recommendation
            </>
          )}
        </button>
      </div>
    </form>
  );
}
