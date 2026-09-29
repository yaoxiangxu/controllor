import React from 'react';
import { ProjectRequirements, ProjectPreset } from '../types/hardware';
import { PROJECT_PRESETS } from '../data/controllersData';
import { 
  Sparkles, 
  Send, 
  Bot, 
  Sun, 
  Gamepad2, 
  Camera, 
  Plane, 
  Zap, 
  Factory, 
  HeartPulse, 
  RotateCcw,
  SlidersHorizontal,
  HelpCircle,
  Cpu,
  Wifi,
  Battery,
  Timer,
  Eye
} from 'lucide-react';

interface ProjectInputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  requirements: ProjectRequirements;
  setRequirements: React.Dispatch<React.SetStateAction<ProjectRequirements>>;
  onAnalyze: () => void;
  onOpenWizard: () => void;
  isAnalyzing: boolean;
}

const PRESET_ICONS: Record<string, React.ReactNode> = {
  Bot: <Bot className="w-4 h-4 text-emerald-400" />,
  Sun: <Sun className="w-4 h-4 text-amber-400" />,
  Gamepad2: <Gamepad2 className="w-4 h-4 text-purple-400" />,
  Camera: <Camera className="w-4 h-4 text-blue-400" />,
  Plane: <Plane className="w-4 h-4 text-sky-400" />,
  Zap: <Zap className="w-4 h-4 text-yellow-400" />,
  Factory: <Factory className="w-4 h-4 text-orange-400" />,
  HeartPulse: <HeartPulse className="w-4 h-4 text-rose-400" />
};

export const ProjectInputSection: React.FC<ProjectInputSectionProps> = ({
  inputText,
  setInputText,
  requirements,
  setRequirements,
  onAnalyze,
  onOpenWizard,
  isAnalyzing
}) => {
  const handleSelectPreset = (preset: ProjectPreset) => {
    setInputText(preset.suggestedText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      onAnalyze();
    }
  };

  return (
    <div className="bg-[#0f101a] border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden mb-8">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-950/70 border border-cyan-800/50 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-tech text-lg sm:text-xl font-bold tracking-wide text-zinc-100 uppercase">
              Describe Your Hardware Project
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Tell us what your device should do. Our engine parses computer vision, real-time timing, power, I/O, and wireless needs.
          </p>
        </div>

        <button
          onClick={onOpenWizard}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700 transition-all hover:border-amber-500/50 group"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Don't know where to start? Try Wizard</span>
        </button>
      </div>

      {/* Input Text Area */}
      <div className="relative mb-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={4}
          placeholder="e.g. I want to build an autonomous mobile robot with a camera for object tracking using YOLO, 4 DC motors with encoders for differential drive, a LiDAR sensor for obstacle avoidance, powered by a 3S LiPo battery, and controlled via a web interface..."
          className="w-full bg-[#080910] border border-zinc-700/80 rounded-2xl p-4 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-y font-sans leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 text-[11px] font-mono-telemetry text-zinc-500 hidden sm:block">
          Ctrl + Enter to recommend
        </div>
      </div>

      {/* Quick Project Presets Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono-telemetry uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            Quick Inspiration Presets:
          </span>
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="text-[11px] font-mono-telemetry text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Clear Input
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {PROJECT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              {PRESET_ICONS[preset.icon] || <Cpu className="w-3.5 h-3.5 text-zinc-400" />}
              <span className="font-medium group-hover:text-zinc-100">{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Detected Requirements Matrix & Manual Overrides */}
      <div className="bg-[#090a0f] border border-zinc-800/90 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono-telemetry uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Extracted Project Constraints (Click to adjust):
          </span>
          <span className="text-[10px] font-mono-telemetry text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            Live Heuristics Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* AI & Vision */}
          <div className="bg-[#12131e] border border-zinc-800 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
              <Eye className="w-3 h-3 text-cyan-400" />
              <span className="font-mono-telemetry uppercase">Vision & AI</span>
            </div>
            <select
              value={requirements.aiVisionNeed}
              onChange={(e) =>
                setRequirements((prev) => ({
                  ...prev,
                  aiVisionNeed: e.target.value as ProjectRequirements['aiVisionNeed'],
                  computeTier: e.target.value === 'deep_learning_heavy' ? 'edge_ai_gpu' : e.target.value === 'basic_opencv' ? 'linux_sbc' : prev.computeTier
                }))
              }
              className="w-full bg-[#080910] border border-zinc-700 text-xs text-zinc-200 rounded px-2 py-1 font-mono-telemetry focus:outline-none focus:border-cyan-500"
            >
              <option value="none">No Camera / Vision</option>
              <option value="basic_opencv">Basic OpenCV / Cam</option>
              <option value="deep_learning_heavy">YOLO / Deep Learning</option>
            </select>
          </div>

          {/* Real-Time Timing */}
          <div className="bg-[#12131e] border border-zinc-800 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
              <Timer className="w-3 h-3 text-sky-400" />
              <span className="font-mono-telemetry uppercase">Real-Time Strict</span>
            </div>
            <select
              value={requirements.realTimeStrictness}
              onChange={(e) =>
                setRequirements((prev) => ({
                  ...prev,
                  realTimeStrictness: e.target.value as ProjectRequirements['realTimeStrictness']
                }))
              }
              className="w-full bg-[#080910] border border-zinc-700 text-xs text-zinc-200 rounded px-2 py-1 font-mono-telemetry focus:outline-none focus:border-cyan-500"
            >
              <option value="non_critical">Non-Critical / High-Level</option>
              <option value="soft_realtime">Motor PWM / Servos</option>
              <option value="hard_realtime">Hard Real-Time (8kHz/Drone)</option>
            </select>
          </div>

          {/* Power Source */}
          <div className="bg-[#12131e] border border-zinc-800 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
              <Battery className="w-3 h-3 text-emerald-400" />
              <span className="font-mono-telemetry uppercase">Power Source</span>
            </div>
            <select
              value={requirements.powerSource}
              onChange={(e) =>
                setRequirements((prev) => ({
                  ...prev,
                  powerSource: e.target.value as ProjectRequirements['powerSource']
                }))
              }
              className="w-full bg-[#080910] border border-zinc-700 text-xs text-zinc-200 rounded px-2 py-1 font-mono-telemetry focus:outline-none focus:border-cyan-500"
            >
              <option value="mains_power">Wall Adapter / Mains</option>
              <option value="rechargeable_battery">LiPo / 18650 Battery</option>
              <option value="coin_or_solar">Solar / Deep Sleep (&lt;20µA)</option>
            </select>
          </div>

          {/* Wireless */}
          <div className="bg-[#12131e] border border-zinc-800 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
              <Wifi className="w-3 h-3 text-amber-400" />
              <span className="font-mono-telemetry uppercase">Connectivity</span>
            </div>
            <select
              value={requirements.connectivity}
              onChange={(e) =>
                setRequirements((prev) => ({
                  ...prev,
                  connectivity: e.target.value as ProjectRequirements['connectivity']
                }))
              }
              className="w-full bg-[#080910] border border-zinc-700 text-xs text-zinc-200 rounded px-2 py-1 font-mono-telemetry focus:outline-none focus:border-cyan-500"
            >
              <option value="none">None / Offline</option>
              <option value="bluetooth">Bluetooth / BLE</option>
              <option value="wifi">WiFi / Web Server / MQTT</option>
              <option value="lora_cellular">LoRa / 4G Cellular</option>
            </select>
          </div>

          {/* Budget Priority */}
          <div className="bg-[#12131e] border border-zinc-800 rounded-xl p-2.5 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
              <Zap className="w-3 h-3 text-rose-400" />
              <span className="font-mono-telemetry uppercase">Priority</span>
            </div>
            <select
              value={requirements.budgetPriority}
              onChange={(e) =>
                setRequirements((prev) => ({
                  ...prev,
                  budgetPriority: e.target.value as ProjectRequirements['budgetPriority']
                }))
              }
              className="w-full bg-[#080910] border border-zinc-700 text-xs text-zinc-200 rounded px-2 py-1 font-mono-telemetry focus:outline-none focus:border-cyan-500"
            >
              <option value="budget_first">Lowest Cost (&lt; $10)</option>
              <option value="balanced">Balanced / Standard</option>
              <option value="performance_first">Maximum AI / High TOPS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-zinc-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Supports Arduino, Raspberry Pi, Jetson Nano/Orin, ESP32, STM32 & Hybrid Architectures</span>
        </div>

        <button
          onClick={onAnalyze}
          disabled={!inputText.trim() || isAnalyzing}
          className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-tech font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all ${
            !inputText.trim() || isAnalyzing
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-950/60 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Analyzing Architecture...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Recommend Controller</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
