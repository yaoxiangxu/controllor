import React, { useState } from 'react';
import { RecommendationResult } from '../types/hardware';
import { askGeminiArchitect, GeminiAdviceResponse } from '../services/geminiService';
import {
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Sparkles,
  Copy,
  Check,
  Zap,
  ArrowRight,
  ShieldAlert,
  Code2,
  Network,
  DollarSign,
  CircuitBoard,
  Bot
} from 'lucide-react';

interface RecommendationViewProps {
  result: RecommendationResult;
  projectIdea: string;
  apiKey: string;
}

export const RecommendationView: React.FC<RecommendationViewProps> = ({
  result,
  projectIdea,
  apiKey
}) => {
  const { primary, secondary, hybridSetup, isHybridRecommended } = result;

  const [activeCodeTab, setActiveCodeTab] = useState<'primary' | 'companion' | 'alt'>('primary');
  const [copied, setCopied] = useState(false);
  const [isAskingGemini, setIsAskingGemini] = useState(false);
  const [geminiAdvice, setGeminiAdvice] = useState<GeminiAdviceResponse | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFetchGemini = async () => {
    setIsAskingGemini(true);
    try {
      const advice = await askGeminiArchitect(projectIdea, primary.name, apiKey);
      if (advice) {
        setGeminiAdvice(advice);
      }
    } finally {
      setIsAskingGemini(false);
    }
  };

  const currentCode =
    activeCodeTab === 'primary'
      ? primary.starterCode
      : activeCodeTab === 'companion' && hybridSetup
      ? hybridSetup.companionMcu.starterCode
      : secondary.starterCode;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ================= 1. PRIMARY RECOMMENDATION HERO ================= */}
      <div className="bg-gradient-to-b from-[#111322] to-[#0c0d17] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glowing badge background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono-telemetry font-bold tracking-wide uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                #1 Recommended Controller
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-telemetry text-zinc-400 bg-zinc-800/80 border border-zinc-700">
                {primary.category.toUpperCase().replace('_', ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-telemetry text-emerald-400 bg-emerald-950/60 border border-emerald-800/50">
                Est. {primary.priceRange}
              </span>
            </div>

            <h1 className="font-tech text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-wide mb-2">
              {primary.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
              {primary.tagline}
            </p>
          </div>

          {/* Match Score Gauge */}
          <div className="flex items-center gap-4 bg-[#090a10]/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 lg:min-w-[200px] justify-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-zinc-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400"
                  strokeDasharray={`${result.primaryMatchScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-tech text-lg sm:text-xl font-bold text-zinc-100">
                  {result.primaryMatchScore}%
                </span>
                <span className="text-[9px] font-mono-telemetry uppercase text-cyan-400">Match</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-mono-telemetry uppercase text-zinc-400">Verdict</div>
              <div className="text-sm font-bold text-emerald-400">Ideal Fit</div>
              <div className="text-[11px] text-zinc-500 font-mono-telemetry">By {primary.manufacturer}</div>
            </div>
          </div>
        </div>

        {/* Hardware Specifications Snapshot Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="bg-[#090a12] border border-zinc-800/80 rounded-xl p-3">
            <div className="text-[10px] font-mono-telemetry uppercase text-zinc-500 mb-1">Processor / CPU</div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-200 line-clamp-2">{primary.specs.cpu}</div>
          </div>
          <div className="bg-[#090a12] border border-zinc-800/80 rounded-xl p-3">
            <div className="text-[10px] font-mono-telemetry uppercase text-zinc-500 mb-1">Memory / RAM</div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-200">{primary.specs.ram}</div>
            <div className="text-[11px] text-zinc-400 font-mono-telemetry">{primary.specs.storage}</div>
          </div>
          <div className="bg-[#090a12] border border-zinc-800/80 rounded-xl p-3">
            <div className="text-[10px] font-mono-telemetry uppercase text-zinc-500 mb-1">AI / Accelerator</div>
            <div className="text-xs sm:text-sm font-semibold text-cyan-300">
              {primary.specs.aiTops || primary.specs.gpu || 'Microcontroller ALU / FPU'}
            </div>
          </div>
          <div className="bg-[#090a12] border border-zinc-800/80 rounded-xl p-3">
            <div className="text-[10px] font-mono-telemetry uppercase text-zinc-500 mb-1">Power & Logic</div>
            <div className="text-xs sm:text-sm font-semibold text-amber-300">{primary.specs.operatingVoltage}</div>
            <div className="text-[11px] text-zinc-400 font-mono-telemetry">{primary.specs.powerDrawTypical}</div>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-4">
            <h4 className="text-xs font-mono-telemetry uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Why This Controller Wins:
            </h4>
            <ul className="space-y-2">
              {result.primaryPros.map((pro, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-4">
            <h4 className="text-xs font-mono-telemetry uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Critical Bottlenecks & Trade-offs:
            </h4>
            <ul className="space-y-2">
              {result.primaryCons.map((con, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ================= 2. HYBRID DUAL-BOARD ARCHITECTURE (If recommended) ================= */}
      {isHybridRecommended && hybridSetup && (
        <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-[#0d0e19] border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-900/60 border border-indigo-600/50 text-indigo-300">
              <Bot className="w-5 h-5 text-indigo-400" />
            </span>
            <span className="text-xs font-mono-telemetry uppercase tracking-wider text-indigo-400 font-bold">
              Engineering Best Practice
            </span>
          </div>

          <h2 className="font-tech text-xl sm:text-2xl font-bold text-zinc-100 mb-2">
            Recommended Architecture: Hybrid Dual-Controller Setup
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed">
            {hybridSetup.rationale}
          </p>

          {/* Visual Architecture Diagram */}
          <div className="bg-[#080912] border border-indigo-900/60 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Brain Board */}
              <div className="bg-indigo-950/30 border border-indigo-700/60 rounded-xl p-4 text-center">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-telemetry uppercase bg-indigo-500/20 text-indigo-300 mb-2 inline-block">
                  High-Level Brain (Linux OS)
                </span>
                <h4 className="font-tech font-bold text-base text-zinc-100 mb-1">{hybridSetup.brainBoard.name}</h4>
                <p className="text-[11px] text-zinc-400 mb-3">{hybridSetup.brainBoard.specs.cpu}</p>
                <div className="text-left text-xs text-zinc-300 space-y-1">
                  {hybridSetup.responsibilities.brain.map((resp, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-indigo-400">✓</span>
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interconnect Bus */}
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <div className="hidden md:flex items-center gap-2 text-indigo-400 w-full justify-center">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />
                  <Network className="w-5 h-5 animate-pulse" />
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-cyan-500 to-indigo-500" />
                </div>
                <div className="my-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-[11px] font-mono-telemetry text-zinc-300">
                  {hybridSetup.interfaceProtocol}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono-telemetry">Zero OS Jitter Isolated Bus</div>
              </div>

              {/* Real-Time Companion MCU */}
              <div className="bg-cyan-950/30 border border-cyan-700/60 rounded-xl p-4 text-center">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-telemetry uppercase bg-cyan-500/20 text-cyan-300 mb-2 inline-block">
                  Nervous System (Hard Real-Time MCU)
                </span>
                <h4 className="font-tech font-bold text-base text-zinc-100 mb-1">{hybridSetup.companionMcu.name}</h4>
                <p className="text-[11px] text-zinc-400 mb-3">{hybridSetup.companionMcu.specs.cpu}</p>
                <div className="text-left text-xs text-zinc-300 space-y-1">
                  {hybridSetup.responsibilities.mcu.map((resp, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-cyan-400">✓</span>
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
              <span className="font-mono-telemetry text-amber-400 font-semibold">Wiring Tip:</span>
              <span>{hybridSetup.interconnectGuide}</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. SECONDARY ALTERNATIVE CARD ================= */}
      <div className="bg-[#0e0f1a] border border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono-telemetry uppercase text-zinc-400">Runner-Up Alternative:</span>
            <span className="font-tech font-bold text-lg text-zinc-200">{secondary.name}</span>
            <span className="text-xs font-mono-telemetry px-2 py-0.5 bg-zinc-800 rounded text-zinc-300">
              {result.secondaryMatchScore}% Match
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">{result.secondaryRationale}</p>
        </div>
        <div className="text-xs font-mono-telemetry text-emerald-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg whitespace-nowrap">
          Price: {secondary.priceRange}
        </div>
      </div>

      {/* ================= 4. WIRING & INTERFACING BLUEPRINT ================= */}
      <div className="bg-[#0f101a] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <CircuitBoard className="w-5 h-5 text-cyan-400" />
          <h3 className="font-tech text-lg sm:text-xl font-bold text-zinc-100 uppercase">
            Hardware Interfacing & Pinout Blueprint
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#090a10] text-zinc-400 font-mono-telemetry uppercase text-[11px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Peripheral / Component</th>
                <th className="py-3 px-4">Controller Interface / Pin</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">Engineering Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {result.wiringBlueprint.map((wire, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-3 px-4 font-semibold text-zinc-200">{wire.component}</td>
                  <td className="py-3 px-4 font-mono-telemetry text-cyan-300">{wire.controllerPin}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-telemetry font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {wire.protocol}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400 text-xs">{wire.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 5. ESTIMATED BILL OF MATERIALS (BOM) ================= */}
      <div className="bg-[#0f101a] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="font-tech text-lg sm:text-xl font-bold text-zinc-100 uppercase">
              Estimated Bill of Materials (BOM)
            </h3>
          </div>
          <span className="text-xs font-mono-telemetry text-zinc-400">
            Estimated Total: <strong className="text-emerald-400">${primary.approxUsd + 35} - ${primary.approxUsd + 85}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {result.billOfMaterials.map((bom, idx) => (
            <div key={idx} className="bg-[#090a12] border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono-telemetry uppercase text-zinc-500">{bom.category}</span>
                  <span className="text-xs font-mono-telemetry font-bold text-emerald-400">{bom.estimatedCost}</span>
                </div>
                <h5 className="font-semibold text-xs sm:text-sm text-zinc-200 mb-1">{bom.item}</h5>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">{bom.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 6. PRODUCTION-READY STARTER CODE ================= */}
      <div className="bg-[#0a0b12] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-tech text-lg sm:text-xl font-bold text-zinc-100 uppercase">
              Production Starter Code
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers if hybrid exists */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveCodeTab('primary')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeCodeTab === 'primary' ? 'bg-cyan-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {primary.name.split(' ')[0]} ({primary.starterCode.language.toUpperCase()})
              </button>

              {isHybridRecommended && hybridSetup && (
                <button
                  onClick={() => setActiveCodeTab('companion')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    activeCodeTab === 'companion' ? 'bg-cyan-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {hybridSetup.companionMcu.name.split(' ')[0]} (Companion MCU)
                </button>
              )}

              <button
                onClick={() => setActiveCodeTab('alt')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeCodeTab === 'alt' ? 'bg-cyan-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {secondary.name.split(' ')[0]} (Alt)
              </button>
            </div>

            <button
              onClick={() => handleCopyCode(currentCode.code)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono-telemetry text-zinc-200 border border-zinc-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono-telemetry text-zinc-400 bg-zinc-900/80 px-4 py-2 rounded-t-xl border-t border-x border-zinc-800">
          <span>{currentCode.filename}</span>
          <span>{currentCode.title}</span>
        </div>

        <div className="bg-[#06070d] border border-zinc-800 rounded-b-xl p-4 overflow-x-auto font-mono-telemetry text-xs sm:text-sm text-zinc-300 leading-relaxed max-h-96">
          <pre>
            <code>{currentCode.code}</code>
          </pre>
        </div>
      </div>

      {/* ================= 7. CRITICAL PITFALLS & WARNINGS ================= */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="font-tech text-lg font-bold text-amber-200 uppercase">
            Critical Engineering Pitfalls & Hardware Warnings
          </h3>
        </div>

        <div className="space-y-2.5">
          {result.criticalWarnings.map((warn, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              <span className="text-amber-400 font-bold mt-0.5">⚠</span>
              <span>{warn}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 8. GEMINI AI ARCHITECT DEEP SYNTHESIS ================= */}
      <div className="bg-gradient-to-r from-blue-950/30 to-indigo-950/20 border border-indigo-800/50 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-900/60 border border-indigo-700/50 text-indigo-300">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-tech text-lg font-bold text-zinc-100 uppercase">
                Gemini AI Hardware Architect Review
              </h3>
              <p className="text-xs text-zinc-400">
                AI verification of thermal boundaries, power budget, and recommended shield ICs
              </p>
            </div>
          </div>

          <button
            onClick={handleFetchGemini}
            disabled={isAskingGemini}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-950 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isAskingGemini ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Consulting Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{geminiAdvice ? 'Re-Evaluate with AI' : 'Run Deep AI Review'}</span>
              </>
            )}
          </button>
        </div>

        {geminiAdvice ? (
          <div className="space-y-4 pt-2">
            <div className="bg-[#090a12] border border-indigo-900/60 rounded-2xl p-4 text-xs sm:text-sm text-zinc-200 leading-relaxed">
              <div className="font-mono-telemetry uppercase text-[10px] text-indigo-400 mb-1 font-bold">
                Custom Architecture Assessment:
              </div>
              {geminiAdvice.customArchitectureReview}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#090a12] border border-indigo-900/60 rounded-2xl p-4">
                <div className="font-mono-telemetry uppercase text-[10px] text-cyan-400 mb-2 font-bold">
                  Recommended Companion ICs & Shields:
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {geminiAdvice.recommendedShields.map((sh, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{sh}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#090a12] border border-indigo-900/60 rounded-2xl p-4">
                <div className="font-mono-telemetry uppercase text-[10px] text-emerald-400 mb-2 font-bold">
                  Recommended Firmware Stack:
                </div>
                <p className="text-xs text-zinc-300">{geminiAdvice.firmwareStackRecommendation}</p>

                <div className="font-mono-telemetry uppercase text-[10px] text-rose-400 mt-3 mb-1 font-bold">
                  Hardware Safety Cautions:
                </div>
                <ul className="space-y-1 text-xs text-zinc-400">
                  {geminiAdvice.safetyCautions.map((c, idx) => (
                    <li key={idx}>- {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#090a12]/60 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 text-center">
            Click <strong>"Run Deep AI Review"</strong> to generate bespoke AI analysis for your specific setup.
          </div>
        )}
      </div>
    </div>
  );
};
