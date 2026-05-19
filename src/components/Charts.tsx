import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { PredictionResult, CropInput } from '../types';
import { TrendingUp, IndianRupee } from 'lucide-react';

interface ChartsProps {
  result: PredictionResult;
  input: CropInput;
}

export default function Charts({ result, input }: ChartsProps) {
  const suitabilityData = [
    { name: result.bestCrop, score: result.suitabilityScore, color: '#16a34a' },
    ...result.alternatives.map(alt => ({ name: alt.name, score: alt.score, color: '#94a3b8' }))
  ];

  const radarData = [
    { subject: 'Nitrogen', value: Math.min(100, (input.nitrogen / 200) * 100) },
    { subject: 'Phosphorus', value: Math.min(100, (input.phosphorus / 100) * 100) },
    { subject: 'Potassium', value: Math.min(100, (input.potassium / 100) * 100) },
    { subject: 'pH', value: Math.min(100, ((input.ph - 3) / 9) * 100) },
    { subject: 'Moisture', value: Math.min(100, input.moisture) },
    { subject: 'Humidity', value: Math.min(100, input.humidity) },
  ];

  const yieldMatch = result.yieldPerAcre.match(/(\d+)[–\-](\d+)/);
  const avgYield = yieldMatch ? (parseInt(yieldMatch[1]) + parseInt(yieldMatch[2])) / 2 : 0;
  const grossRevenue = Math.round(avgYield * 100 * result.marketPricePerKg);
  const estimatedCost = Math.round(grossRevenue * 0.45);
  const netProfit = grossRevenue - estimatedCost;

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Suitability Bar Chart */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-gray-800">Suitability Comparison (%)</h3>
        <div className="h-[180px] sm:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={suitabilityData} barSize={28} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} domain={[0, 100]} />
              <Tooltip cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {suitabilityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Soil Health Radar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-gray-800">Soil Health Profile</h3>
        <div className="h-[200px] sm:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Soil" dataKey="value" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Estimator */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-lg">
        <h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> Profit Estimator (per acre)
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {[
            { label: 'Expected Yield', value: result.yieldPerAcre, cls: '' },
            { label: 'Market Price', value: `₹${result.marketPricePerKg}/kg`, cls: '' },
            { label: 'Gross Revenue', value: `₹${grossRevenue.toLocaleString('en-IN')}`, cls: '' },
            { label: 'Est. Input Cost (~45%)', value: `- ₹${estimatedCost.toLocaleString('en-IN')}`, cls: 'text-red-200' },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center bg-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3">
              <span className="text-xs sm:text-sm font-medium opacity-80">{row.label}</span>
              <span className={`font-bold text-xs sm:text-sm ${row.cls}`}>{row.value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center bg-white/20 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5 border border-white/20">
            <span className="text-sm font-bold">Net Profit</span>
            <span className="text-lg sm:text-xl font-black flex items-center gap-0.5">
              <IndianRupee className="w-4 h-4" />{netProfit.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
