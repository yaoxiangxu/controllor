import React, { useState } from 'react';
import { Bot, Sun, Gamepad2, Camera, Plane, Zap, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';

interface GuidedWizardProps {
  onComplete: (generatedDescription: string) => void;
  onCancel: () => void;
}

export const GuidedWizard: React.FC<GuidedWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);

  // Selections
  const [domain, setDomain] = useState<string>('robotics');
  const [visionNeed, setVisionNeed] = useState<string>('yolo');
  const [powerSource, setPowerSource] = useState<string>('battery');
  const [connectivity, setConnectivity] = useState<string>('wifi');
  const [budgetPriority, setBudgetPriority] = useState<string>('balanced');
  const [extraDetails, setExtraDetails] = useState<string>('');

  const handleFinish = () => {
    // Synthesize natural language prompt
    let prompt = `I am building a ${domain} project. `;

    if (visionNeed === 'yolo') {
      prompt += `It requires deep learning computer vision and object detection (YOLO / TensorRT) using a camera at high frame rates. `;
    } else if (visionNeed === 'opencv') {
      prompt += `It needs basic computer vision and video streaming using OpenCV or a camera module. `;
    } else {
      prompt += `It does not require video; it focuses on sensors, motors, and numerical telemetry. `;
    }

    if (powerSource === 'solar') {
      prompt += `The device is powered by a small solar panel and battery, needing ultra-low power deep sleep (<20µA) to run for months. `;
    } else if (powerSource === 'battery') {
      prompt += `It is powered by a rechargeable LiPo/18650 battery pack. `;
    } else {
      prompt += `It is powered via a wall power adapter / mains electricity. `;
    }

    if (connectivity === 'wifi') {
      prompt += `It connects to the local network via WiFi and reports data via MQTT or web server. `;
    } else if (connectivity === 'ble') {
      prompt += `It communicates with a smartphone app over Bluetooth Low Energy (BLE). `;
    } else if (connectivity === 'lora') {
      prompt += `It uses long-range LoRa or cellular communication for remote transmission. `;
    } else {
      prompt += `It is a standalone offline device with no wireless radio. `;
    }

    if (budgetPriority === 'budget') {
      prompt += `Budget is very tight, so prioritize the lowest cost microcontroller under $10. `;
    } else if (budgetPriority === 'performance') {
      prompt += `Performance and AI TOPS are top priority regardless of cost. `;
    }

    if (extraDetails.trim()) {
      prompt += `Additional requirements: ${extraDetails.trim()}.`;
    }

    onComplete(prompt);
  };

  return (
    <div className="bg-[#0f101a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto">
      {/* Wizard Progress Header */}
      <div className="flex items-center justify-between pb-5 border-b border-zinc-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-950/70 border border-amber-800/50 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-tech text-lg sm:text-xl font-bold text-zinc-100 uppercase">
              Hardware Architecture Guided Wizard
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">Answer 5 quick questions to size your ideal controller</p>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-lg text-xs font-mono-telemetry flex items-center justify-center font-bold transition-all ${
                step === s
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-950 scale-105'
                  : step > s
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
              }`}
            >
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Domain */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="font-tech text-base font-bold text-zinc-200 uppercase">
            Step 1: What domain does your project fall under?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'robotics', title: 'Robotics & Autonomous Vehicles', desc: 'Rovers, robot arms, drones, motor control', icon: '🤖' },
              { id: 'iot_smarthome', title: 'Smart Home & IoT Sensors', desc: 'Home Assistant, weather stations, relays', icon: '🏠' },
              { id: 'vision_ai', title: 'Computer Vision & AI Surveillance', desc: 'Face recognition, defect scanning, YOLO', icon: '👁️' },
              { id: 'audio_display', title: 'Handheld Gaming & Multimedia', desc: 'Retro consoles, digital kiosks, audio players', icon: '🕹️' },
              { id: 'wearable', title: 'Wearables & Health Tech', desc: 'Wristbands, heart rate monitors, smart badges', icon: '⌚' },
              { id: 'industrial', title: 'Industrial & Factory Automation', desc: 'CAN bus, PLCs, assembly line actuators', icon: '🏭' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setDomain(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  domain === item.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-zinc-100 ring-1 ring-cyan-500/50'
                    : 'bg-[#090a12] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="text-2xl mb-1.5">{item.icon}</div>
                <div className="font-tech font-bold text-sm text-zinc-100 mb-0.5">{item.title}</div>
                <div className="text-xs text-zinc-400">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Compute & Vision */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="font-tech text-base font-bold text-zinc-200 uppercase">
            Step 2: What level of computing or camera processing is required?
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                id: 'none',
                title: 'No Camera / Standard Electronics',
                desc: 'Reading analog sensors, driving motors, switching relays, reading buttons with microsecond timing.'
              },
              {
                id: 'opencv',
                title: 'Basic Video Streaming & OpenCV (10-30 FPS)',
                desc: 'Reading QR codes, motion detection, webcam streaming, color tracking.'
              },
              {
                id: 'yolo',
                title: 'Deep Learning & Neural Networks (TensorRT / YOLO / PyTorch)',
                desc: 'Real-time multi-object detection, facial recognition, SLAM mapping, autonomous driving (Jetson / GPU tier).'
              }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setVisionNeed(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  visionNeed === item.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-zinc-100 ring-1 ring-cyan-500/50'
                    : 'bg-[#090a12] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="font-tech font-bold text-sm text-zinc-100 mb-1">{item.title}</div>
                <div className="text-xs text-zinc-400 leading-relaxed">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Power Source */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="font-tech text-base font-bold text-zinc-200 uppercase">
            Step 3: How will your hardware be powered?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'mains', title: 'Wall Adapter / Mains Power', desc: 'Plugged into wall outlet via 5V/12V DC power brick continuously.' },
              { id: 'battery', title: 'Rechargeable LiPo / 18650 Battery', desc: 'Mobile operation lasting 2 to 12 hours before recharge.' },
              { id: 'solar', title: 'Solar / Coin Cell Deep Sleep', desc: 'Ultra-low power (<20µA) waking up periodically to survive for months.' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setPowerSource(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  powerSource === item.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-zinc-100 ring-1 ring-cyan-500/50'
                    : 'bg-[#090a12] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="font-tech font-bold text-sm text-zinc-100 mb-1">{item.title}</div>
                  <div className="text-xs text-zinc-400 leading-relaxed">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Connectivity */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="font-tech text-base font-bold text-zinc-200 uppercase">
            Step 4: What wireless communication is required?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'wifi', title: 'WiFi (2.4 GHz / 5 GHz)', desc: 'Home network, MQTT, web dashboard, cloud APIs' },
              { id: 'ble', title: 'Bluetooth Low Energy (BLE)', desc: 'Direct connection to smartphone apps and beacons' },
              { id: 'lora', title: 'LoRa / 4G Cellular', desc: 'Long distance (kilometers) or remote off-grid telemetry' },
              { id: 'none', title: 'None / Standalone Offline', desc: 'No radio needed; works purely via local cables or standalone' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setConnectivity(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  connectivity === item.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-zinc-100 ring-1 ring-cyan-500/50'
                    : 'bg-[#090a12] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="font-tech font-bold text-sm text-zinc-100 mb-1">{item.title}</div>
                <div className="text-xs text-zinc-400 leading-relaxed">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Budget & Summary */}
      {step === 5 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="font-tech text-base font-bold text-zinc-200 uppercase">
            Step 5: Budget Priority & Final Notes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { id: 'budget', title: 'Lowest Cost (< $10)', desc: 'Prioritize ultra-cheap microcontrollers (ESP32, Pico, Arduino)' },
              { id: 'balanced', title: 'Balanced & Standard', desc: 'Best trade-off between community support, speed, and cost' },
              { id: 'performance', title: 'Maximum AI Performance', desc: 'High TOPS, GPU inference speed, TensorRT acceleration' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setBudgetPriority(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  budgetPriority === item.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-zinc-100 ring-1 ring-cyan-500/50'
                    : 'bg-[#090a12] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="font-tech font-bold text-sm text-zinc-100 mb-1">{item.title}</div>
                <div className="text-xs text-zinc-400 leading-relaxed">{item.desc}</div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-mono-telemetry uppercase text-zinc-400 mb-1.5">
              Any specific sensors or actuators? (Optional)
            </label>
            <input
              type="text"
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              placeholder="e.g. 4 stepper motors, MPU6050 gyro, LiDAR, 0.96 OLED screen"
              className="w-full px-3.5 py-2.5 bg-[#080910] border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-800">
        <button
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else onCancel();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step === 1 ? 'Cancel Wizard' : 'Back'}</span>
        </button>

        {step < 5 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-950"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-950"
          >
            <Check className="w-4 h-4" />
            <span>Generate Recommendation</span>
          </button>
        )}
      </div>
    </div>
  );
};
