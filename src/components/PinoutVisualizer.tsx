import React, { useState } from 'react';
import { CONTROLLERS } from '../data/controllersData';
import { Controller } from '../types/hardware';
import { Layers, Zap, Info, ShieldAlert, Cpu } from 'lucide-react';

interface PinDefinition {
  pinNumber: string;
  name: string;
  type: 'power' | 'ground' | 'gpio' | 'analog' | 'comm' | 'special';
  voltage: '5V' | '3.3V' | '1.8V' | 'GND';
  functions: string[];
  notes: string;
}

const PINOUT_PREVIEWS: Record<string, { title: string; logicVoltage: string; maxPinCurrent: string; pins: PinDefinition[] }> = {
  arduino_uno_r4: {
    title: 'Arduino Uno R4 (RA4M1 ARM Cortex-M4)',
    logicVoltage: '5.0V Logic (Tolerant)',
    maxPinCurrent: '8 mA per GPIO (Absolute max)',
    pins: [
      { pinNumber: 'D0', name: 'RX0 / GPIO 0', type: 'comm', voltage: '5V', functions: ['UART RX', 'Interrupt'], notes: 'Hardware Serial Receive from PC or module' },
      { pinNumber: 'D1', name: 'TX0 / GPIO 1', type: 'comm', voltage: '5V', functions: ['UART TX', 'Interrupt'], notes: 'Hardware Serial Transmit' },
      { pinNumber: 'D2', name: 'INT0 / GPIO 2', type: 'gpio', voltage: '5V', functions: ['External Interrupt 0'], notes: 'Fast hardware interrupt pin' },
      { pinNumber: 'D3', name: 'PWM / GPIO 3', type: 'gpio', voltage: '5V', functions: ['PWM Timer', 'INT1'], notes: '490 Hz PWM output for motor speed control' },
      { pinNumber: 'D4', name: 'GPIO 4', type: 'gpio', voltage: '5V', functions: ['General I/O'], notes: 'Standard 5V digital I/O' },
      { pinNumber: 'D5', name: 'PWM / GPIO 5', type: 'gpio', voltage: '5V', functions: ['PWM Timer'], notes: '980 Hz PWM timer channel' },
      { pinNumber: 'D6', name: 'PWM / GPIO 6', type: 'gpio', voltage: '5V', functions: ['PWM Timer'], notes: '980 Hz PWM timer channel' },
      { pinNumber: 'D9', name: 'PWM / GPIO 9', type: 'gpio', voltage: '5V', functions: ['PWM Timer'], notes: 'Timer PWM output' },
      { pinNumber: 'D10', name: 'SS / PWM / GPIO 10', type: 'comm', voltage: '5V', functions: ['SPI CS / Slave Select', 'PWM'], notes: 'Hardware SPI Chip Select' },
      { pinNumber: 'D11', name: 'MOSI / PWM / GPIO 11', type: 'comm', voltage: '5V', functions: ['SPI MOSI', 'PWM'], notes: 'SPI Master Out Slave In' },
      { pinNumber: 'D12', name: 'MISO / GPIO 12', type: 'comm', voltage: '5V', functions: ['SPI MISO'], notes: 'SPI Master In Slave Out' },
      { pinNumber: 'D13', name: 'SCK / GPIO 13', type: 'comm', voltage: '5V', functions: ['SPI Clock', 'Built-in LED'], notes: 'Connected to on-board LED' },
      { pinNumber: 'A0', name: 'ADC0 / GPIO 14', type: 'analog', voltage: '5V', functions: ['14-bit ADC', 'Op-Amp In+'], notes: 'Configurable up to 14-bit analog resolution (0-16383)' },
      { pinNumber: 'A4', name: 'SDA / ADC4', type: 'comm', voltage: '5V', functions: ['I2C SDA', 'ADC'], notes: 'Primary I2C Data bus' },
      { pinNumber: 'A5', name: 'SCL / ADC5', type: 'comm', voltage: '5V', functions: ['I2C SCL', 'ADC'], notes: 'Primary I2C Clock bus' },
      { pinNumber: '5V', name: '5V Power Rail', type: 'power', voltage: '5V', functions: ['Power Out / Regulated'], notes: 'Supplies up to 500mA from USB or onboard regulator' },
      { pinNumber: '3.3V', name: '3.3V Power Rail', type: 'power', voltage: '3.3V', functions: ['3.3V LDO Output'], notes: 'Supplies up to 150mA for 3.3V sensors' },
      { pinNumber: 'GND', name: 'Ground', type: 'ground', voltage: 'GND', functions: ['Common Ground'], notes: 'Connect to ground of all external circuits' }
    ]
  },
  esp32_s3: {
    title: 'ESP32-S3 DevKit (Xtensa LX7 240MHz)',
    logicVoltage: '3.3V Strict (NOT 5V Tolerant!)',
    maxPinCurrent: '40 mA max (12 mA recommended)',
    pins: [
      { pinNumber: 'GPIO 1', name: 'ADC1_CH0', type: 'analog', voltage: '3.3V', functions: ['12-bit ADC', 'RTC IO'], notes: 'Safe analog pin usable during active WiFi transmission' },
      { pinNumber: 'GPIO 2', name: 'ADC1_CH1', type: 'analog', voltage: '3.3V', functions: ['12-bit ADC', 'Strapping Pin'], notes: 'Do not pull high at boot' },
      { pinNumber: 'GPIO 8', name: 'RGB LED', type: 'special', voltage: '3.3V', functions: ['WS2812 Built-in RGB'], notes: 'Controls onboard addressable NeoPixel' },
      { pinNumber: 'GPIO 17', name: 'UART1 TX', type: 'comm', voltage: '3.3V', functions: ['UART TX', 'PWM'], notes: 'High-speed serial transmitter' },
      { pinNumber: 'GPIO 18', name: 'UART1 RX', type: 'comm', voltage: '3.3V', functions: ['UART RX', 'PWM'], notes: 'High-speed serial receiver' },
      { pinNumber: 'GPIO 19', name: 'USB D-', type: 'comm', voltage: '3.3V', functions: ['Native USB D-'], notes: 'Direct USB OTG data connection' },
      { pinNumber: 'GPIO 20', name: 'USB D+', type: 'comm', voltage: '3.3V', functions: ['Native USB D+'], notes: 'Direct USB OTG data connection' },
      { pinNumber: 'GPIO 43', name: 'TX0 (Debug)', type: 'comm', voltage: '3.3V', functions: ['UART0 TX'], notes: 'Default boot and programming serial log' },
      { pinNumber: 'GPIO 44', name: 'RX0 (Debug)', type: 'comm', voltage: '3.3V', functions: ['UART0 RX'], notes: 'Default boot and programming serial in' },
      { pinNumber: '3V3', name: '3.3V Rail', type: 'power', voltage: '3.3V', functions: ['Power Rail'], notes: 'Powers ESP32 chip. Add 100uF cap for RF spikes' },
      { pinNumber: 'GND', name: 'Ground', type: 'ground', voltage: 'GND', functions: ['Ground'], notes: 'Common ground rail' }
    ]
  },
  raspberry_pi_5: {
    title: 'Raspberry Pi 5 (Quad Cortex-A76 @ 2.4GHz)',
    logicVoltage: '3.3V Strict (40-Pin Header)',
    maxPinCurrent: '16 mA per pin (50 mA sum across all pins)',
    pins: [
      { pinNumber: 'Pin 1', name: '3.3V Power', type: 'power', voltage: '3.3V', functions: ['3.3V DC Out'], notes: 'Regulated 3.3V up to 500mA' },
      { pinNumber: 'Pin 2', name: '5V Power', type: 'power', voltage: '5V', functions: ['5V Direct Supply'], notes: 'Direct link to USB-C 5V rail' },
      { pinNumber: 'Pin 3', name: 'GPIO 2 / I2C1 SDA', type: 'comm', voltage: '3.3V', functions: ['I2C Data'], notes: 'Hardware 1.8k pull-up resistor onboard' },
      { pinNumber: 'Pin 5', name: 'GPIO 3 / I2C1 SCL', type: 'comm', voltage: '3.3V', functions: ['I2C Clock'], notes: 'Hardware 1.8k pull-up resistor onboard' },
      { pinNumber: 'Pin 6', name: 'Ground', type: 'ground', voltage: 'GND', functions: ['Common Ground'], notes: 'Ground' },
      { pinNumber: 'Pin 8', name: 'GPIO 14 / UART0 TX', type: 'comm', voltage: '3.3V', functions: ['Serial TX'], notes: 'Hardware serial console transmit' },
      { pinNumber: 'Pin 10', name: 'GPIO 15 / UART0 RX', type: 'comm', voltage: '3.3V', functions: ['Serial RX'], notes: 'Hardware serial console receive' },
      { pinNumber: 'Pin 12', name: 'GPIO 18 / PWM0', type: 'gpio', voltage: '3.3V', functions: ['Hardware PWM0'], notes: 'RP1 southbridge generated PWM' },
      { pinNumber: 'Pin 35', name: 'GPIO 19 / PWM1', type: 'gpio', voltage: '3.3V', functions: ['Hardware PWM1'], notes: 'Hardware PWM channel 1' },
      { pinNumber: 'PCIe', name: 'PCIe 2.0 x1 FFC', type: 'special', voltage: '3.3V', functions: ['High-Speed NVMe / AI Hat'], notes: '500 MB/s bandwidth for NVMe SSD or Hailo AI' },
      { pinNumber: 'CAM0', name: 'MIPI CSI 4-lane', type: 'special', voltage: '3.3V', functions: ['High-Res Sony IMX Camera'], notes: 'Direct high-speed camera ingestion' }
    ]
  },
  jetson_nano: {
    title: 'NVIDIA Jetson Nano (128-core Maxwell GPU)',
    logicVoltage: '3.3V Strict (40-Pin Header)',
    maxPinCurrent: '1 mA - 4 mA per pin (Extremely sensitive!)',
    pins: [
      { pinNumber: 'Pin 1', name: '3.3V DC Power', type: 'power', voltage: '3.3V', functions: ['Power Out'], notes: '3.3V reference power' },
      { pinNumber: 'Pin 2', name: '5V DC Power', type: 'power', voltage: '5V', functions: ['5V In/Out'], notes: 'Can power board or power 5V fans' },
      { pinNumber: 'Pin 3', name: 'I2C2 SDA', type: 'comm', voltage: '3.3V', functions: ['I2C Data'], notes: 'Hardware I2C bus' },
      { pinNumber: 'Pin 5', name: 'I2C2 SCL', type: 'comm', voltage: '3.3V', functions: ['I2C Clock'], notes: 'Hardware I2C clock' },
      { pinNumber: 'Pin 6', name: 'Ground', type: 'ground', voltage: 'GND', functions: ['GND'], notes: 'Ground' },
      { pinNumber: 'Pin 8', name: 'UART1 TX', type: 'comm', voltage: '3.3V', functions: ['UART TX'], notes: 'Connects to Arduino RX for hybrid robotics' },
      { pinNumber: 'Pin 10', name: 'UART1 RX', type: 'comm', voltage: '3.3V', functions: ['UART RX'], notes: 'Connects to Arduino TX (Must use 3.3V logic level!)' },
      { pinNumber: 'Pin 32', name: 'PWM0 / GPIO 12', type: 'gpio', voltage: '3.3V', functions: ['Hardware PWM'], notes: '40mm PWM cooling fan speed control' },
      { pinNumber: 'J48', name: 'Power Select Jumper', type: 'special', voltage: '5V', functions: ['Barrel Jack Enable'], notes: 'MANDATORY: Close jumper to enable 5V 4A DC Barrel Jack' },
      { pinNumber: 'CSI 0', name: 'MIPI CSI-2 2-lane', type: 'special', voltage: '3.3V', functions: ['IMX219 / Raspberry Pi Cam v2'], notes: 'Hardware video capture with zero CPU copy' }
    ]
  },
  raspberry_pi_pico_2: {
    title: 'Raspberry Pi Pico 2 (Dual Cortex-M33 / RISC-V)',
    logicVoltage: '3.3V Strict',
    maxPinCurrent: '12 mA recommended per pin',
    pins: [
      { pinNumber: 'Pin 1', name: 'GP0 / UART0 TX', type: 'comm', voltage: '3.3V', functions: ['UART0 TX', 'I2C0 SDA', 'PIO'], notes: 'PIO assignable to any custom protocol' },
      { pinNumber: 'Pin 2', name: 'GP1 / UART0 RX', type: 'comm', voltage: '3.3V', functions: ['UART0 RX', 'I2C0 SCL', 'PIO'], notes: 'PIO assignable' },
      { pinNumber: 'Pin 3', name: 'Ground', type: 'ground', voltage: 'GND', functions: ['GND'], notes: 'Ground' },
      { pinNumber: 'Pin 21', name: 'GP16 / PWM 0A', type: 'gpio', voltage: '3.3V', functions: ['PWM 0A', 'SPI0 RX'], notes: 'Hardware PWM slice 0' },
      { pinNumber: 'Pin 31', name: 'GP26 / ADC0', type: 'analog', voltage: '3.3V', functions: ['12-bit ADC0'], notes: 'Analog channel 0 (0 to 3.3V)' },
      { pinNumber: 'Pin 32', name: 'GP27 / ADC1', type: 'analog', voltage: '3.3V', functions: ['12-bit ADC1'], notes: 'Analog channel 1' },
      { pinNumber: 'Pin 36', name: '3V3(OUT)', type: 'power', voltage: '3.3V', functions: ['Regulator Out'], notes: 'Up to 300mA from onboard buck-boost regulator' },
      { pinNumber: 'Pin 39', name: 'VSYS', type: 'power', voltage: '5V', functions: ['Main Power In (1.8V - 5.5V)'], notes: 'Accepts AA batteries, LiPo, or 5V USB' }
    ]
  }
};

export const PinoutVisualizer: React.FC = () => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>('arduino_uno_r4');
  const [selectedPin, setSelectedPin] = useState<PinDefinition | null>(
    PINOUT_PREVIEWS['arduino_uno_r4'].pins[0]
  );

  const currentPreview = PINOUT_PREVIEWS[selectedBoardId] || PINOUT_PREVIEWS['arduino_uno_r4'];

  const handleSelectBoard = (id: string) => {
    setSelectedBoardId(id);
    setSelectedPin(PINOUT_PREVIEWS[id]?.pins[0] || null);
  };

  const getPinColor = (type: PinDefinition['type']) => {
    switch (type) {
      case 'power':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30';
      case 'ground':
        return 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700';
      case 'analog':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      case 'comm':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30';
      case 'special':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
    }
  };

  return (
    <div className="bg-[#0f101a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800/50 text-emerald-400">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="font-tech text-xl sm:text-2xl font-bold tracking-wide text-zinc-100 uppercase">
              Controller Pinout & Hardware Anatomy
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Interactive pin inspection, voltage tolerance levels, and peripheral interface definitions.
          </p>
        </div>

        {/* Board Selector */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(PINOUT_PREVIEWS).map(([id, p]) => (
            <button
              key={id}
              onClick={() => handleSelectBoard(id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedBoardId === id
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {p.title.split(' ')[0]} {p.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Board Summary Header */}
      <div className="bg-[#090a12] border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-tech font-bold text-lg text-zinc-100">{currentPreview.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs font-mono-telemetry">
            <span className="text-amber-400">⚡ Logic Level: {currentPreview.logicVoltage}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-cyan-400">🔌 Max GPIO Current: {currentPreview.maxPinCurrent}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono-telemetry">
          <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">Power</span>
          <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">GND</span>
          <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Comm</span>
          <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">ADC</span>
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">GPIO</span>
          <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">Special</span>
        </div>
      </div>

      {/* Pin Grid & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pin Buttons Map */}
        <div className="lg:col-span-2 bg-[#090a12] border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <div className="text-xs font-mono-telemetry uppercase text-zinc-400 mb-3 flex items-center justify-between">
            <span>Select Pin to Inspect:</span>
            <span className="text-[11px] text-zinc-500">{currentPreview.pins.length} Key Pins</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {currentPreview.pins.map((pin, idx) => {
              const isSelected = selectedPin?.pinNumber === pin.pinNumber;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPin(pin)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${getPinColor(
                    pin.type
                  )} ${isSelected ? 'ring-2 ring-cyan-400 scale-[1.02]' : 'opacity-90'}`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono-telemetry font-bold text-xs">{pin.pinNumber}</span>
                    <span className="text-[9px] uppercase font-mono-telemetry opacity-75">{pin.voltage}</span>
                  </div>
                  <div className="text-xs font-semibold truncate text-zinc-200">{pin.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Pin Deep Inspector */}
        <div className="bg-[#090a12] border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between">
          {selectedPin ? (
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-800">
                <div>
                  <span className="text-[10px] font-mono-telemetry uppercase text-zinc-500">Pin Inspector</span>
                  <h4 className="font-tech font-bold text-xl text-cyan-300">{selectedPin.pinNumber}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono-telemetry font-bold uppercase border ${getPinColor(selectedPin.type)}`}>
                  {selectedPin.type}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono-telemetry uppercase text-zinc-500 mb-1">Signal Name</div>
                  <div className="text-sm font-semibold text-zinc-200">{selectedPin.name}</div>
                </div>

                <div>
                  <div className="text-[10px] font-mono-telemetry uppercase text-zinc-500 mb-1">Operating Voltage</div>
                  <div className="text-sm font-mono-telemetry font-bold text-amber-300">{selectedPin.voltage}</div>
                </div>

                <div>
                  <div className="text-[10px] font-mono-telemetry uppercase text-zinc-500 mb-1">Hardware Functions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPin.functions.map((fn, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-xs font-mono-telemetry bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {fn}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#12131d] border border-zinc-800 rounded-xl p-3">
                  <div className="text-[10px] font-mono-telemetry uppercase text-cyan-400 mb-1 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Engineering Guidance:
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedPin.notes}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-zinc-500 text-center my-auto">
              Select any pin to view voltage safety thresholds and connection advice.
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Never drive 5V into a 3.3V GPIO without a level shifter!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
