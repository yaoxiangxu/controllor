import React, { useState } from 'react';
import { CONTROLLERS } from '../data/controllersData';
import { Controller, BoardCategory } from '../types/hardware';
import { Check, X, Cpu, Zap, DollarSign, Filter, Layers } from 'lucide-react';

interface ComparisonMatrixProps {
  recommendedBoardId?: string;
  onSelectBoard: (board: Controller) => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  recommendedBoardId,
  onSelectBoard
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | BoardCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const boards = Object.values(CONTROLLERS).filter((b) => {
    if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.specs.cpu.toLowerCase().includes(q) ||
        b.specs.operatingSystem.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-[#0f101a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-950/70 border border-indigo-800/50 text-indigo-400">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="font-tech text-xl sm:text-2xl font-bold tracking-wide text-zinc-100 uppercase">
              Controller Hardware Comparison Matrix
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Compare CPU architectures, RAM, AI TOPS, real-time determinism, power, and price side-by-side.
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Filter by name or CPU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3.5 py-1.5 bg-[#080910] border border-zinc-700 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 w-full sm:w-64"
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 border-b border-zinc-800">
        <span className="text-xs font-mono-telemetry uppercase text-zinc-500 flex items-center gap-1 mr-2">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {[
          { id: 'all', label: 'All Boards (10)' },
          { id: 'mcu', label: 'Microcontrollers (MCU)' },
          { id: 'connected_mcu', label: 'Connected IoT (WiFi/BLE)' },
          { id: 'sbc', label: 'Single Board Computers (Linux)' },
          { id: 'edge_ai', label: 'Edge AI & GPU (Jetson)' },
          { id: 'industrial', label: 'Industrial (BeagleBone)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              categoryFilter === tab.id
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Responsive Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080910] text-zinc-400 font-mono-telemetry uppercase text-[11px] border-b border-zinc-800 sticky top-0">
            <tr>
              <th className="py-3.5 px-4 min-w-[200px]">Board & Category</th>
              <th className="py-3.5 px-4 min-w-[160px]">CPU & Clock</th>
              <th className="py-3.5 px-4 min-w-[120px]">RAM & Storage</th>
              <th className="py-3.5 px-4 min-w-[140px]">AI / GPU TOPS</th>
              <th className="py-3.5 px-4 min-w-[130px]">OS & Real-Time</th>
              <th className="py-3.5 px-4 min-w-[110px]">Power Draw</th>
              <th className="py-3.5 px-4 min-w-[90px]">Est. Cost</th>
              <th className="py-3.5 px-4 min-w-[110px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {boards.map((b) => {
              const isRecommended = b.id === recommendedBoardId;

              return (
                <tr
                  key={b.id}
                  className={`transition-colors ${
                    isRecommended
                      ? 'bg-cyan-950/30 hover:bg-cyan-950/40'
                      : 'hover:bg-zinc-800/30'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {isRecommended && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      )}
                      <div>
                        <div className="font-tech font-bold text-sm text-zinc-100 flex items-center gap-1.5">
                          <span>{b.name}</span>
                          {isRecommended && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 font-mono-telemetry uppercase">
                              Winner
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono-telemetry text-zinc-500">
                          {b.manufacturer} • {b.category.toUpperCase().replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-zinc-200">{b.specs.clockSpeed}</div>
                    <div className="text-[11px] text-zinc-400 line-clamp-1">{b.specs.cpu}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-zinc-200">{b.specs.ram}</div>
                    <div className="text-[11px] text-zinc-400">{b.specs.storage}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    {b.specs.aiTops ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-telemetry font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                        {b.specs.aiTops}
                      </span>
                    ) : b.specs.gpu ? (
                      <span className="text-zinc-300 text-xs">{b.specs.gpu}</span>
                    ) : (
                      <span className="text-zinc-500 text-xs">CPU Only (No GPU)</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-zinc-200 line-clamp-1 text-xs">{b.specs.operatingSystem}</div>
                    <div className="text-[10px] font-mono-telemetry text-zinc-400 mt-0.5">
                      {b.category === 'mcu' || b.category === 'connected_mcu'
                        ? 'Hard Real-Time (µs)'
                        : 'Linux (Multi-tasking)'}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono-telemetry">
                    <div className="text-amber-300 text-xs">{b.specs.powerDrawTypical}</div>
                    <div className="text-[10px] text-zinc-500">Peak: {b.specs.powerDrawPeak}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono-telemetry font-semibold text-emerald-400 text-xs">
                    {b.priceRange}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSelectBoard(b)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-cyan-600 text-zinc-300 hover:text-white transition-all border border-zinc-700 hover:border-cyan-500"
                    >
                      View Specs
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
