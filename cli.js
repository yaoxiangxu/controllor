#!/usr/bin/env node
/**
 * ControllerAdvisor CLI
 * Embedded & Edge AI Hardware Recommendation Engine
 * Usage:
 *   node cli.js "autonomous rover with object detection and lidar"
 *   node cli.js
 */

import readline from 'node:readline';
import process from 'node:process';

// Controller profiles
const CONTROLLERS = {
  arduino_uno_r4: {
    id: 'arduino_uno_r4',
    name: 'Arduino Uno R4 (RA4M1 ARM Cortex-M4 @ 48MHz)',
    category: 'Microcontroller (MCU)',
    price: '$22',
    power: '150 mW (5V 30mA)',
    voltage: '5V Logic',
    bestFor: 'Beginner electronics, hard real-time motor control, 5V sensors/relays, educational robotics',
    pros: [
      '5V logic prevents damaging legacy sensors and relay modules',
      'Deterministic microsecond execution with zero OS scheduling jitter',
      'Vast library ecosystem and plug-and-play shields'
    ],
    cons: [
      '32 KB RAM cannot run video processing or deep learning',
      'No HDMI or native camera interface'
    ]
  },
  arduino_mega_2560: {
    id: 'arduino_mega_2560',
    name: 'Arduino Mega 2560 Rev3 (54 I/O Pins, 4 UARTs)',
    category: 'High-I/O Microcontroller',
    price: '$40',
    power: '250 mW',
    voltage: '5V Logic',
    bestFor: '3D printers, multi-axis CNCs, robots requiring dozens of endstops, servos, and sensors',
    pros: [
      '54 digital I/O pins and 16 analog ADC inputs',
      '4 hardware serial ports (UARTs) for multiple telemetry modules simultaneously'
    ],
    cons: [
      'Older 8-bit 16MHz architecture with low computational power',
      'No native WiFi or Bluetooth'
    ]
  },
  esp32_s3: {
    id: 'esp32_s3',
    name: 'ESP32-S3 (Dual-Core 240MHz, WiFi 4 + BLE 5.0)',
    category: 'Connected IoT MCU',
    price: '$5',
    power: '260 mW (active) / <15 µA (deep sleep)',
    voltage: '3.3V Logic (Strict)',
    bestFor: 'Smart home, WiFi/MQTT sensor nodes, battery/solar devices, TinyML audio/wake-word',
    pros: [
      'Unbeatable price-to-performance ($5 for dual 240MHz cores + WiFi + BLE)',
      'Sub-15 µA deep sleep allows months of runtime on single 18650 cell',
      'Hardware vector instructions for edge TinyML'
    ],
    cons: [
      '3.3V logic: Connecting 5V signals directly will fry GPIO pins',
      'Not a full Linux OS'
    ]
  },
  raspberry_pi_pico_2: {
    id: 'raspberry_pi_pico_2',
    name: 'Raspberry Pi Pico 2 (Dual ARM Cortex-M33 / RISC-V @ 150MHz)',
    category: 'Precision Microcontroller',
    price: '$5',
    power: '90 mW',
    voltage: '3.3V Logic',
    bestFor: 'Custom protocols, dual-core motor loops, MicroPython, precision USB HID devices',
    pros: [
      '12 Programmable I/O (PIO) state machines emulate custom protocols with zero CPU overhead',
      'Dual-core architecture lets core 1 run motor PID while core 0 handles USB/telemetry',
      'Low cost ($5) with wide 1.8V - 5.5V supply regulator'
    ],
    cons: [
      'Base model lacks wireless radio (Pico 2 W needed for WiFi)',
      'Only 3 analog ADC channels'
    ]
  },
  stm32_f401: {
    id: 'stm32_f401',
    name: 'STM32F401 / F411 BlackPill (ARM Cortex-M4F @ 100MHz)',
    category: 'High-Performance Real-Time MCU',
    price: '$6',
    power: '120 mW',
    voltage: '3.3V (5V Tolerant on most pins)',
    bestFor: 'Quadcopter drone flight controllers (Betaflight), gimbal motor FOC, high-speed DSP',
    pros: [
      'Hardware Floating Point Unit (FPU) executes PID filters in single-cycle microsecond loops',
      'Hardware timers support complementary high-speed PWM with dead-time for motor inverters',
      'Fast 2.4 MSPS ADC with DMA'
    ],
    cons: [
      'Steeper learning curve (STM32CubeIDE / registers)',
      'No built-in wireless'
    ]
  },
  raspberry_pi_5: {
    id: 'raspberry_pi_5',
    name: 'Raspberry Pi 5 (Quad-Core Cortex-A76 @ 2.4GHz, 4GB/8GB)',
    category: 'Linux Single Board Computer (SBC)',
    price: '$70',
    power: '5 W - 12 W',
    voltage: '5V DC (USB-C 5V 5A PD)',
    bestFor: 'ROS 2 robotics brain, OpenCV computer vision (30-60 FPS), home servers, media kiosks',
    pros: [
      'Flagship 2.4 GHz quad-core processor runs full 64-bit Linux, Python, Docker, and ROS 2',
      'PCIe 2.0 interface for ultra-fast NVMe SSDs or Hailo-8 AI accelerator hats',
      'Dual 4-lane MIPI camera transceivers and dual 4K HDMI'
    ],
    cons: [
      'High power draw (requires 5V 5A adapter and active cooler fan)',
      'Linux scheduling jitter prevents microsecond deterministic motor pulsing alone'
    ]
  },
  raspberry_pi_zero_2_w: {
    id: 'raspberry_pi_zero_2_w',
    name: 'Raspberry Pi Zero 2 W (Quad Cortex-A53 @ 1.0GHz, 512MB RAM)',
    category: 'Ultra-Compact Linux SBC',
    price: '$15',
    power: '700 mW - 2.5 W',
    voltage: '5V DC via Micro USB',
    bestFor: 'Retro handheld gaming, pocket dashcams, portable audio servers, wearable Linux gadgets',
    pros: [
      'Full quad-core 64-bit Linux in a 65x30mm form factor weighing just 9 grams',
      'Low power draw allows reasonable battery life on small LiPos',
      'CSI-2 camera connector'
    ],
    cons: [
      '512 MB RAM limits desktop apps and heavy compilation',
      'Requires adapter cables for HDMI and USB'
    ]
  },
  jetson_nano: {
    id: 'jetson_nano',
    name: 'NVIDIA Jetson Nano (128-core Maxwell GPU, 4GB RAM)',
    category: 'Edge AI & Deep Learning Computer',
    price: '$129',
    power: '5 W (5W mode) / 10 W - 15 W (MAXN)',
    voltage: '5V DC (Barrel Jack 5V 4A Recommended)',
    bestFor: 'Real-time YOLO object detection (20-30 FPS), autonomous mobile robots (AMR), AI surveillance',
    pros: [
      'Dedicated 128 CUDA core Maxwell GPU with TensorRT hardware acceleration',
      'Native dual MIPI-CSI camera interfaces for low-latency stereo vision',
      'Pre-configured JetPack SDK with CUDA, cuDNN, and TensorRT'
    ],
    cons: [
      'Requires 5V 4A DC power supply (Micro-USB causes brownout crashes under GPU load)',
      'Linux OS non-determinism means companion MCU is recommended for motors'
    ]
  },
  jetson_orin_nano: {
    id: 'jetson_orin_nano',
    name: 'NVIDIA Jetson Orin Nano (Ampere GPU, up to 40 TOPS AI)',
    category: 'High-End Edge AI Platform',
    price: '$299',
    power: '7 W - 15 W',
    voltage: '9V - 20V DC Barrel Jack',
    bestFor: 'Industrial AI defect inspection, quadruped robot dogs, Vision Transformers, Isaac ROS',
    pros: [
      '40 TOPS AI throughput with 32 Tensor Cores runs YOLOv8/v10 at 60+ FPS',
      'Runs modern JetPack 6 on Ubuntu 22.04 LTS with ROS 2 Humble',
      'PCIe Gen4 NVMe storage'
    ],
    cons: [
      'Higher price point ($299+)',
      'Requires separate M.2 NVMe SSD to boot'
    ]
  }
};

function analyzeIdea(text) {
  const lower = text.toLowerCase();

  const isDeepLearning =
    lower.includes('yolo') ||
    lower.includes('deep learning') ||
    lower.includes('tensorrt') ||
    lower.includes('cuda') ||
    lower.includes('neural') ||
    lower.includes('defect') ||
    lower.includes('face recogn') ||
    lower.includes('object detect') ||
    lower.includes('slam') ||
    lower.includes('gpu') ||
    lower.includes('ai vision');

  const isOpencv =
    !isDeepLearning &&
    (lower.includes('camera') ||
      lower.includes('opencv') ||
      lower.includes('video') ||
      lower.includes('qr code') ||
      lower.includes('barcode') ||
      lower.includes('doorbell') ||
      lower.includes('stream'));

  const isHardRealtime =
    lower.includes('drone') ||
    lower.includes('flight controller') ||
    lower.includes('foc') ||
    lower.includes('esc') ||
    lower.includes('8khz') ||
    lower.includes('microsecond');

  const isMotorActuation =
    isHardRealtime ||
    lower.includes('motor') ||
    lower.includes('stepper') ||
    lower.includes('servo') ||
    lower.includes('rover') ||
    lower.includes('robot arm') ||
    lower.includes('cnc');

  const isSolarDeepSleep =
    lower.includes('solar') ||
    lower.includes('coin cell') ||
    lower.includes('deep sleep') ||
    lower.includes('ultra low power') ||
    lower.includes('weather station') ||
    lower.includes('soil moisture');

  const isWifiMqtt =
    lower.includes('wifi') ||
    lower.includes('home assistant') ||
    lower.includes('mqtt') ||
    lower.includes('cloud') ||
    lower.includes('iot');

  const isDisplay =
    lower.includes('hdmi') ||
    lower.includes('screen') ||
    lower.includes('display') ||
    lower.includes('gaming') ||
    lower.includes('arcade') ||
    lower.includes('game boy');

  // Decision logic
  let primaryId = 'arduino_uno_r4';
  let secondaryId = 'esp32_s3';
  let matchScore = 88;

  if (isDeepLearning) {
    if (lower.includes('industrial') || lower.includes('40 fps') || lower.includes('orin') || lower.includes('transformer')) {
      primaryId = 'jetson_orin_nano';
      secondaryId = 'jetson_nano';
      matchScore = 96;
    } else {
      primaryId = 'jetson_nano';
      secondaryId = 'raspberry_pi_5';
      matchScore = 94;
    }
  } else if (isSolarDeepSleep) {
    primaryId = 'esp32_s3';
    secondaryId = 'raspberry_pi_pico_2';
    matchScore = 95;
  } else if (isDisplay && !isDeepLearning) {
    if (lower.includes('retro') || lower.includes('portable') || lower.includes('handheld')) {
      primaryId = 'raspberry_pi_zero_2_w';
      secondaryId = 'raspberry_pi_5';
      matchScore = 93;
    } else {
      primaryId = 'raspberry_pi_5';
      secondaryId = 'raspberry_pi_zero_2_w';
      matchScore = 92;
    }
  } else if (isOpencv) {
    primaryId = 'raspberry_pi_5';
    secondaryId = 'esp32_s3';
    matchScore = 91;
  } else if (isHardRealtime) {
    primaryId = 'stm32_f401';
    secondaryId = 'arduino_uno_r4';
    matchScore = 95;
  } else if (isWifiMqtt) {
    primaryId = 'esp32_s3';
    secondaryId = 'arduino_uno_r4';
    matchScore = 96;
  } else if (isMotorActuation && (lower.includes('cnc') || lower.includes('3d printer'))) {
    primaryId = 'arduino_mega_2560';
    secondaryId = 'arduino_uno_r4';
    matchScore = 90;
  }

  // Check hybrid architecture requirement
  const isHybrid = (isDeepLearning || isOpencv || isDisplay) && isMotorActuation;
  let companionId = 'arduino_uno_r4';
  if (isHardRealtime) companionId = 'stm32_f401';
  else if (lower.includes('many motor') || lower.includes('4 motor') || lower.includes('cnc')) companionId = 'arduino_mega_2560';

  return {
    primary: CONTROLLERS[primaryId],
    secondary: CONTROLLERS[secondaryId],
    matchScore,
    isHybrid,
    companion: CONTROLLERS[companionId],
    flags: { isDeepLearning, isOpencv, isHardRealtime, isMotorActuation, isSolarDeepSleep, isWifiMqtt, isDisplay }
  };
}

function printBanner() {
  console.log('\x1b[36m====================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[36m   CONTROLLER ADVISOR — Hardware Architecture & Board Recommender\x1b[0m');
  console.log('\x1b[36m====================================================================\x1b[0m');
}

function runAnalysis(promptText) {
  printBanner();
  console.log(`\n\x1b[33m[Project Idea Input]:\x1b[0m\n"${promptText}"\n`);

  const res = analyzeIdea(promptText);
  const p = res.primary;

  console.log('\x1b[32m✔ Analysis Complete!\x1b[0m\n');
  console.log(`\x1b[1m\x1b[36m#1 RECOMMENDED CONTROLLER:\x1b[0m  \x1b[1m\x1b[37m${p.name}\x1b[0m`);
  console.log(`   Category:        ${p.category}`);
  console.log(`   Match Score:     \x1b[32m${res.matchScore}% Optimal Fit\x1b[0m`);
  console.log(`   Approx Price:    ${p.price}`);
  console.log(`   Power & Logic:   ${p.power} | ${p.voltage}`);
  console.log(`   Ideal For:       ${p.bestFor}\n`);

  console.log('\x1b[32mKey Reasons Why This Board Wins:\x1b[0m');
  p.pros.forEach((pro) => console.log(`   • ${pro}`));

  console.log('\n\x1b[31mCritical Bottlenecks & Gotchas:\x1b[0m');
  p.cons.forEach((con) => console.log(`   ! ${con}`));

  // Hybrid setup check
  if (res.isHybrid) {
    console.log('\n\x1b[35m--------------------------------------------------------------------\x1b[0m');
    console.log('\x1b[1m\x1b[35m🤖 RECOMMENDED ARCHITECTURE: HYBRID DUAL-CONTROLLER SETUP\x1b[0m');
    console.log('\x1b[35m--------------------------------------------------------------------\x1b[0m');
    console.log(`   High-Level Brain:    \x1b[36m${p.name}\x1b[0m (Vision, AI, SLAM, Linux OS)`);
    console.log(`   Nervous System MCU:  \x1b[32m${res.companion.name}\x1b[0m (1kHz PID Motors, Encoders)`);
    console.log(`   Interconnect Bus:    High-Speed USB Serial or UART @ 115200 Baud`);
    console.log(`   Engineering Reason:  Linux has scheduler jitter (1-10ms) that causes jerky`);
    console.log(`                        motor steps, while MCUs lack GPU/RAM for camera processing.`);
    console.log(`                        Splitting vision & real-time actuation gives zero jitter!`);
  }

  // Secondary
  console.log('\n\x1b[34m--------------------------------------------------------------------\x1b[0m');
  console.log(`\x1b[1m\x1b[34mRUNNER-UP / BUDGET ALTERNATIVE:\x1b[0m \x1b[37m${res.secondary.name}\x1b[0m (${res.secondary.price})`);
  console.log(`   ${res.secondary.bestFor}`);
  console.log('\x1b[36m====================================================================\x1b[0m\n');
}

// Execution
const args = process.argv.slice(2);
if (args.length > 0) {
  runAnalysis(args.join(' '));
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  printBanner();
  console.log('Enter your project idea below (or press Enter for default autonomous rover demo):');
  rl.question('> ', (answer) => {
    const input = answer.trim() || 'I want to build an autonomous rover with computer vision to detect weeds and spray them, with 4 DC motors, obstacle avoidance sensors, running on a 3S LiPo battery.';
    runAnalysis(input);
    rl.close();
  });
}
