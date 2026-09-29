import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProjectInputSection } from './components/ProjectInputSection';
import { RecommendationView } from './components/RecommendationView';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { PinoutVisualizer } from './components/PinoutVisualizer';
import { GuidedWizard } from './components/GuidedWizard';
import { extractRequirementsFromText, analyzeAndRecommend } from './utils/recommenderEngine';
import { ProjectRequirements, RecommendationResult, Controller } from './types/hardware';
import { CONTROLLERS } from './data/controllersData';
import { Cpu, Terminal, Sparkles, CheckCircle2, ChevronRight, Layers, ArrowUpRight } from 'lucide-react';

const DEFAULT_IDEA =
  'I am building an autonomous mobile rover with computer vision to detect humans and track objects using a camera, plus LiDAR for 2D mapping and obstacle avoidance. It needs to drive 4 gear motors with wheel encoders in real-time, communicate over WiFi, and run on a 3S LiPo battery.';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'matrix' | 'pinouts' | 'wizard'>('analyzer');
  const [inputText, setInputText] = useState<string>(DEFAULT_IDEA);
  const [apiKey, setApiKey] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Requirements & Recommendation state
  const [requirements, setRequirements] = useState<ProjectRequirements>(() =>
    extractRequirementsFromText(DEFAULT_IDEA)
  );

  const [result, setResult] = useState<RecommendationResult>(() =>
    analyzeAndRecommend(extractRequirementsFromText(DEFAULT_IDEA))
  );

  // When text changes, update extracted requirements automatically
  useEffect(() => {
    if (inputText.trim()) {
      const extracted = extractRequirementsFromText(inputText);
      setRequirements(extracted);
    }
  }, [inputText]);

  // Main recommendation handler
  const handleRecommend = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeAndRecommend(requirements);
      setResult(res);
      setIsAnalyzing(false);
      if (activeTab !== 'analyzer') {
        setActiveTab('analyzer');
      }
    }, 250);
  };

  const handleWizardComplete = (generatedText: string) => {
    setInputText(generatedText);
    const extracted = extractRequirementsFromText(generatedText);
    setRequirements(extracted);
    const res = analyzeAndRecommend(extracted);
    setResult(res);
    setActiveTab('analyzer');
  };

  const handleSelectBoardFromMatrix = (board: Controller) => {
    // Switch to pinout visualizer or analyzer
    setActiveTab('pinouts');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner Quick Switcher (If in other tabs) */}
        {activeTab === 'wizard' ? (
          <GuidedWizard
            onComplete={handleWizardComplete}
            onCancel={() => setActiveTab('analyzer')}
          />
        ) : activeTab === 'matrix' ? (
          <div className="space-y-6">
            <ComparisonMatrix
              recommendedBoardId={result.primary.id}
              onSelectBoard={handleSelectBoardFromMatrix}
            />
          </div>
        ) : activeTab === 'pinouts' ? (
          <div className="space-y-6">
            <PinoutVisualizer />
          </div>
        ) : (
          /* Main Analyzer Tab */
          <div className="space-y-8">
            {/* Input & NLP Constraint Extractor */}
            <ProjectInputSection
              inputText={inputText}
              setInputText={setInputText}
              requirements={requirements}
              setRequirements={setRequirements}
              onAnalyze={handleRecommend}
              onOpenWizard={() => setActiveTab('wizard')}
              isAnalyzing={isAnalyzing}
            />

            {/* Results Section */}
            {result && (
              <RecommendationView
                result={result}
                projectIdea={inputText}
                apiKey={apiKey}
              />
            )}
          </div>
        )}

        {/* CLI Terminal Tip Card */}
        <section className="mt-12 bg-[#0d0e17] border border-zinc-800/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-tech font-bold text-sm text-zinc-100">
                Command Line Interface (CLI) Ready
              </h4>
              <p className="text-xs text-zinc-400">
                You can also run this advisor directly from your terminal or scripts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <code className="px-3 py-1.5 bg-[#07080e] border border-zinc-700/80 rounded-lg text-xs font-mono-telemetry text-cyan-300">
              node cli.js "your project idea"
            </code>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#07080e] border-t border-zinc-800/80 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>ControllerAdvisor • Intelligent Embedded & Edge AI Architecture Sizing</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Arduino • Raspberry Pi • NVIDIA Jetson • ESP32 • STM32</span>
            <span>Real-Time Heuristics Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
