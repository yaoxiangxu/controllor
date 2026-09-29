import React, { useState } from 'react';
import { Cpu, Layers, HelpCircle, TableProperties, Sparkles, Key, Check } from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyzer' | 'matrix' | 'pinouts' | 'wizard';
  setActiveTab: (tab: 'analyzer' | 'matrix' | 'pinouts' | 'wizard') => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  apiKey,
  setApiKey
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [savedKeyNotification, setSavedKeyNotification] = useState(false);

  const handleSaveKey = () => {
    setApiKey(tempKey);
    setShowKeyModal(false);
    setSavedKeyNotification(true);
    setTimeout(() => setSavedKeyNotification(false), 3000);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('analyzer')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-950/40 group-hover:shadow-cyan-500/20 transition-all">
            <div className="w-full h-full bg-[#0d0e15] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech text-xl font-bold tracking-wider text-zinc-100 uppercase">
                Controller<span className="text-cyan-400">Advisor</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono-telemetry font-semibold uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded">
                v2.5
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono-telemetry hidden sm:block">
              Embedded & Edge AI Hardware Recommendation Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'analyzer'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Advisor</span>
          </button>

          <button
            onClick={() => setActiveTab('wizard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'wizard'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>5-Step Wizard</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'matrix'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <TableProperties className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Compare</span>
            <span className="md:hidden">Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('pinouts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'pinouts'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Pinouts</span>
          </button>

          {/* AI Settings button */}
          <button
            onClick={() => setShowKeyModal(true)}
            title="Optional Gemini AI API Key"
            className="ml-1 p-2 rounded-lg text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800/60 transition-all border border-transparent hover:border-zinc-700"
          >
            <Key className="w-4 h-4" />
          </button>
        </nav>
      </div>

      {/* Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12131c] border border-zinc-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-tech font-bold text-lg text-zinc-100">Gemini AI Settings</h3>
                <p className="text-xs text-zinc-400">Optional deep hardware architectural synthesis</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              ControllerAdvisor works <strong className="text-cyan-300">100% offline</strong> with built-in embedded engineering heuristics. Adding a Gemini API key enables custom conversational architecture reviews and tailored schematic tips.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-mono-telemetry text-zinc-400 mb-1.5">
                GEMINI_API_KEY (Stored in session)
              </label>
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-[#090a0f] border border-zinc-700 rounded-lg text-sm text-zinc-100 font-mono-telemetry focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {savedKeyNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Gemini API Key configuration updated.</span>
        </div>
      )}
    </header>
  );
};
