import React from 'react';
import { PredictionResult } from '../types';
import { CheckCircle2, AlertCircle, Info, Droplets, Clock, FlaskConical, CalendarDays, Leaf, AlertTriangle, ListChecks } from 'lucide-react';
import { motion } from 'motion/react';

const ALL_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const FULL_MONTHS: Record<string, string> = {
  January:'Jan', February:'Feb', March:'Mar', April:'Apr', May:'May', June:'Jun',
  July:'Jul', August:'Aug', September:'Sep', October:'Oct', November:'Nov', December:'Dec'
};

export default function ResultCard({ result }: { result: PredictionResult }) {
  const [activeStep, setActiveStep] = React.useState<number | null>(null);
  const plantSet = new Set(result.bestPlantingMonths.map(m => FULL_MONTHS[m] ?? m));
  const harvestSet = new Set(result.harvestMonths.map(m => FULL_MONTHS[m] ?? m));

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Hero Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-green-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-green-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-5 sm:mb-6 gap-3">
            <div className="min-w-0">
              <span className="text-green-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Best {result.category === 'Trees' ? 'Tree' : 'Crop'} Recommendation
              </span>
              <h2 className="text-3xl sm:text-5xl font-black mt-1 truncate">{result.bestCrop}</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center shrink-0">
              <div className="text-2xl sm:text-3xl font-black">{result.suitabilityScore}%</div>
              <div className="text-[9px] sm:text-[10px] font-bold uppercase opacity-80">Match</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {[
              { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />, label: 'Duration', value: `${result.growthDuration}d` },
              { icon: <Droplets className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />, label: 'Water', value: result.waterRequirement },
              { icon: <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />, label: 'Fertilizer', value: result.fertilizerSuggestion },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-4">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">{item.icon}
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase opacity-60">{item.label}</div>
                </div>
                <div className="font-bold text-xs sm:text-sm truncate">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Why this {result.category === 'Trees' ? 'tree' : 'crop'}?
            </h4>
            <p className="text-sm sm:text-base leading-relaxed font-medium italic opacity-90">"{result.reason}"</p>
          </div>
        </div>
        <div className="absolute -right-16 -bottom-16 w-64 h-64 sm:w-80 sm:h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* Seasonal Calendar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2 text-gray-800">
          <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> Seasonal Calendar
        </h3>
        <div className="grid grid-cols-12 gap-1 sm:gap-1.5">
          {ALL_MONTHS.map(m => {
            const isPlant = plantSet.has(m);
            const isHarvest = harvestSet.has(m);
            return (
              <div key={m} className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-[9px] sm:text-xs font-bold transition-all ${
                isPlant && isHarvest ? 'bg-purple-500 text-white' :
                isPlant ? 'bg-green-500 text-white' :
                isHarvest ? 'bg-amber-400 text-white' :
                'bg-gray-100 text-gray-400'
              }`}>{m}</div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-3 sm:mt-4">
          {[['bg-green-500','Planting'],['bg-amber-400','Harvest'],['bg-purple-500','Both']].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${c}`} /> {l}
            </div>
          ))}
        </div>
      </div>

      {/* Growing Guide */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2 text-gray-800">
          <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> Step-by-Step Growing Guide
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {result.growingSteps.map((step, i) => (
            <button key={i} onClick={() => setActiveStep(activeStep === i ? null : i)}
              className={`w-full text-left flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${
                activeStep === i ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'
              }`}>
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 mt-0.5 ${
                activeStep === i ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>{i + 1}</div>
              <span className={`text-xs sm:text-sm font-medium leading-relaxed ${activeStep === i ? 'text-green-800' : 'text-gray-700'}`}>
                {step}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Risk Warnings */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-bold text-orange-800 mb-3 sm:mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" /> Risk Warnings
        </h3>
        <ul className="space-y-2 sm:space-y-3">
          {result.risks.map((risk, i) => (
            <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-orange-700">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 sm:mt-2 shrink-0" />
              {risk}
            </li>
          ))}
        </ul>
      </div>

      {/* AI Insights + Alternatives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> AI Insights
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <InsightItem label="Soil pH matches requirement" active={result.explainability.phMatch} />
            <InsightItem label="Temperature suitable" active={result.explainability.tempMatch} />
            <InsightItem label="Rainfall adequate" active={result.explainability.rainfallMatch} />
            <InsightItem label="NPK levels compatible" active={result.explainability.npkMatch} />
          </div>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" /> Top Alternatives
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {result.alternatives.map((alt, i) => (
              <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 text-gray-600 text-[10px] sm:text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="font-bold text-gray-700 text-xs sm:text-sm truncate">{alt.name}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <div className="w-14 sm:w-20 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: `${alt.score}%` }} />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-gray-400 w-9 sm:w-12 text-right">{alt.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${active ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
      {active ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> : <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
      <span className="font-medium text-xs sm:text-sm">{label}</span>
    </div>
  );
}
