import React from 'react';
import { CropInput, PredictionResult } from './types';
import CropForm from './components/CropForm';
import ResultCard from './components/ResultCard';
import Charts from './components/Charts';
import { useCropRecommendation } from './hooks/useCropRecommendation';
import { Sprout, AlertTriangle, Download, RefreshCw, History, X, TreePine, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STATS = [
  { value: '30+', label: 'Crops & Trees' },
  { value: 'AI', label: 'Powered Analysis' },
  { value: '8', label: 'Parameters' },
  { value: '100%', label: 'Free to Use' },
];

interface HistoryEntry {
  id: number;
  crop: string;
  category: string;
  score: number;
  time: string;
  result: PredictionResult;
  input: CropInput;
}

export default function App() {
  const { result, loading, error, getRecommendation, reset } = useCropRecommendation();
  const resultRef = React.useRef<HTMLDivElement>(null);
  const [currentInput, setCurrentInput] = React.useState<CropInput | null>(null);
  const [history, setHistory] = React.useState<HistoryEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('smartcrop_history') || '[]'); } catch { return []; }
  });
  const [showHistory, setShowHistory] = React.useState(false);

  React.useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      if (currentInput) {
        const entry: HistoryEntry = {
          id: Date.now(), crop: result.bestCrop, category: result.category,
          score: result.suitabilityScore, time: new Date().toLocaleTimeString(),
          result, input: currentInput
        };
        setHistory(prev => {
          const updated = [entry, ...prev].slice(0, 5);
          localStorage.setItem('smartcrop_history', JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, [result]);

  const handleSubmit = (data: CropInput) => {
    setCurrentInput(data);
    getRecommendation(data);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const report = `SMARTCROP AI — RECOMMENDATION REPORT
=====================================
Crop: ${result.bestCrop} (${result.category})
Suitability: ${result.suitabilityScore}%
Duration: ${result.growthDuration} Days
Water: ${result.waterRequirement}
Fertilizer: ${result.fertilizerSuggestion}
Yield/Acre: ${result.yieldPerAcre}
Market Price: ₹${result.marketPricePerKg}/kg

PLANTING MONTHS: ${result.bestPlantingMonths.join(', ')}
HARVEST MONTHS:  ${result.harvestMonths.join(', ')}

REASONING:
${result.reason}

GROWING GUIDE:
${result.growingSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

RISK WARNINGS:
${result.risks.map(r => `• ${r}`).join('\n')}

ALTERNATIVES:
${result.alternatives.map(a => `- ${a.name} (${a.score}% Match)`).join('\n')}

AI INSIGHTS:
- pH Match:       ${result.explainability.phMatch ? '✓' : '✗'}
- Temp Match:     ${result.explainability.tempMatch ? '✓' : '✗'}
- Rainfall Match: ${result.explainability.rainfallMatch ? '✓' : '✗'}
- NPK Match:      ${result.explainability.npkMatch ? '✓' : '✗'}

Generated: ${new Date().toLocaleString()}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `SmartCrop_${result.bestCrop}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-green-100 selection:text-green-900">

      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={reset}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-100 shrink-0">
              <Sprout className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-black tracking-tight leading-tight">SmartCrop AI</h1>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none hidden sm:block">Agricultural Decision Support</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs sm:text-sm font-bold transition-all"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Stats Banner */}
      <div className="bg-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="grid grid-cols-4 gap-2 sm:gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl sm:text-3xl font-black">{s.value}</div>
                <div className="text-green-100 text-[9px] sm:text-xs font-bold uppercase tracking-wider mt-0.5 sm:mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Crop Recommendation</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Enter your soil and environmental parameters to get an AI-powered recommendation.</p>
        </div>

        <CropForm onSubmit={handleSubmit} loading={loading} />

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && currentInput && (
            <motion.div ref={resultRef} key="results"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: 'easeOut' }} className="space-y-6 sm:space-y-8">

              {/* Results header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">Analysis Results</h3>
                <div className="flex items-center gap-2">
                  <button onClick={reset}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-500 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> New Analysis
                  </button>
                  <button onClick={handleDownloadReport}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-500 transition-colors">
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Download
                  </button>
                </div>
              </div>

              <ResultCard result={result} />
              <Charts result={result} input={currentInput} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 border-t border-slate-100 mt-6 sm:mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 opacity-30">
            <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest">SmartCrop AI</span>
          </div>
          <div className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center">
            © 2026 Agricultural Decision Support • Built for Farmers
          </div>
        </div>
      </footer>

      {/* History Drawer */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-xs sm:max-w-sm bg-white z-50 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-black">Analysis History</h3>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="text-center text-gray-400 font-medium mt-12 text-sm">No history yet</div>
                ) : history.map(entry => (
                  <div key={entry.id} className="p-4 bg-gray-50 rounded-2xl border border-transparent">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {entry.category === 'Trees'
                          ? <TreePine className="w-4 h-4 text-green-600 shrink-0" />
                          : <Sprout className="w-4 h-4 text-green-600 shrink-0" />}
                        <span className="font-bold text-gray-800 text-sm">{entry.crop}</span>
                      </div>
                      <span className="text-sm font-black text-green-600">{entry.score}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <Clock className="w-3 h-3" /> {entry.time}
                    </div>
                  </div>
                ))}
              </div>
              {history.length > 0 && (
                <div className="p-3 sm:p-4 border-t border-gray-100">
                  <button onClick={() => { setHistory([]); localStorage.removeItem('smartcrop_history'); }}
                    className="w-full py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    Clear History
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
