import { CONTROLLERS } from '../data/controllersData';
import {
  Controller,
  ProjectRequirements,
  RecommendationResult,
  WiringItem,
  BOMItem,
  HybridSetup
} from '../types/hardware';

/**
 * Parses freeform natural language text to extract key engineering constraints
 */
export function extractRequirementsFromText(text: string): ProjectRequirements {
  const lower = text.toLowerCase();

  // AI & Vision detection
  let aiVisionNeed: ProjectRequirements['aiVisionNeed'] = 'none';
  if (
    lower.includes('yolo') ||
    lower.includes('deep learning') ||
    lower.includes('tensorrt') ||
    lower.includes('cuda') ||
    lower.includes('neural') ||
    lower.includes('defect') ||
    lower.includes('face recogn') ||
    lower.includes('object detect') ||
    lower.includes('pose') ||
    lower.includes('slam') ||
    lower.includes('autonomous driving') ||
    lower.includes('gpu') ||
    lower.includes('ai vision')
  ) {
    aiVisionNeed = 'deep_learning_heavy';
  } else if (
    lower.includes('camera') ||
    lower.includes('opencv') ||
    lower.includes('video') ||
    lower.includes('qr code') ||
    lower.includes('barcode') ||
    lower.includes('doorbell') ||
    lower.includes('stream') ||
    lower.includes('webcam') ||
    lower.includes('image')
  ) {
    aiVisionNeed = 'basic_opencv';
  }

  // Compute tier
  let computeTier: ProjectRequirements['computeTier'] = 'micro';
  if (aiVisionNeed === 'deep_learning_heavy') {
    computeTier = 'edge_ai_gpu';
  } else if (
    aiVisionNeed === 'basic_opencv' ||
    lower.includes('linux') ||
    lower.includes('desktop') ||
    lower.includes('server') ||
    lower.includes('ros') ||
    lower.includes('emulator') ||
    lower.includes('arcade') ||
    lower.includes('game boy') ||
    lower.includes('hdmi') ||
    lower.includes('kiosk')
  ) {
    computeTier = 'linux_sbc';
  }

  // Real-time constraints
  let realTimeStrictness: ProjectRequirements['realTimeStrictness'] = 'non_critical';
  if (
    lower.includes('drone') ||
    lower.includes('flight controller') ||
    lower.includes('foc') ||
    lower.includes('esc') ||
    lower.includes('dshot') ||
    lower.includes('8khz') ||
    lower.includes('microsecond') ||
    lower.includes('hard real-time') ||
    lower.includes('balance') ||
    lower.includes('inverted pendulum')
  ) {
    realTimeStrictness = 'hard_realtime';
  } else if (
    lower.includes('motor') ||
    lower.includes('stepper') ||
    lower.includes('servo') ||
    lower.includes('encoder') ||
    lower.includes('cnc') ||
    lower.includes('rover') ||
    lower.includes('robot arm') ||
    lower.includes('actuator')
  ) {
    realTimeStrictness = 'soft_realtime';
  }

  // Power source
  let powerSource: ProjectRequirements['powerSource'] = 'mains_power';
  if (
    lower.includes('solar') ||
    lower.includes('coin cell') ||
    lower.includes('deep sleep') ||
    lower.includes('ultra low power') ||
    lower.includes('weather station') ||
    lower.includes('soil moisture') ||
    lower.includes('remote sensor')
  ) {
    powerSource = 'coin_or_solar';
  } else if (
    lower.includes('battery') ||
    lower.includes('lipo') ||
    lower.includes('18650') ||
    lower.includes('wearable') ||
    lower.includes('portable') ||
    lower.includes('handheld') ||
    lower.includes('drone') ||
    lower.includes('rover')
  ) {
    powerSource = 'rechargeable_battery';
  }

  // Connectivity
  let connectivity: ProjectRequirements['connectivity'] = 'none';
  if (lower.includes('lora') || lower.includes('cellular') || lower.includes('4g') || lower.includes('gsm')) {
    connectivity = 'lora_cellular';
  } else if (
    lower.includes('wifi') ||
    lower.includes('home assistant') ||
    lower.includes('mqtt') ||
    lower.includes('cloud') ||
    lower.includes('iot') ||
    lower.includes('web server') ||
    lower.includes('doorbell') ||
    lower.includes('stream')
  ) {
    connectivity = 'wifi';
  } else if (lower.includes('bluetooth') || lower.includes('ble') || lower.includes('wearable') || lower.includes('wristband')) {
    connectivity = 'bluetooth';
  }

  // Specific I/O needs
  const ioNeeds = {
    analogSensors:
      lower.includes('analog') ||
      lower.includes('moisture') ||
      lower.includes('current clamp') ||
      lower.includes('voltage') ||
      lower.includes('potentiometer') ||
      lower.includes('light sensor') ||
      lower.includes('weather'),
    highSpeedCamera:
      aiVisionNeed !== 'none' ||
      lower.includes('camera') ||
      lower.includes('mipi') ||
      lower.includes('csi') ||
      lower.includes('video'),
    multipleMotorsOrServos:
      lower.includes('4 motor') ||
      lower.includes('stepper') ||
      lower.includes('servo') ||
      lower.includes('cnc') ||
      lower.includes('3d printer') ||
      lower.includes('robot arm') ||
      lower.includes('rover'),
    displayOutput:
      lower.includes('hdmi') ||
      lower.includes('screen') ||
      lower.includes('display') ||
      lower.includes('oled') ||
      lower.includes('tft') ||
      lower.includes('lcd') ||
      lower.includes('gaming') ||
      lower.includes('console'),
    canBus:
      lower.includes('can bus') ||
      lower.includes('automotive') ||
      lower.includes('vehicle') ||
      lower.includes('obd'),
    audioInOrOut:
      lower.includes('audio') ||
      lower.includes('speaker') ||
      lower.includes('microphone') ||
      lower.includes('intercom') ||
      lower.includes('sound') ||
      lower.includes('voice') ||
      lower.includes('music')
  };

  // Budget priority
  let budgetPriority: ProjectRequirements['budgetPriority'] = 'balanced';
  if (lower.includes('cheap') || lower.includes('low cost') || lower.includes('budget') || lower.includes('$5') || lower.includes('$10')) {
    budgetPriority = 'budget_first';
  } else if (lower.includes('industrial') || lower.includes('enterprise') || lower.includes('high performance') || lower.includes('best fps') || lower.includes('40 tops')) {
    budgetPriority = 'performance_first';
  }

  // Overall Domain
  let domain: ProjectRequirements['domain'] = 'general';
  if (lower.includes('drone') || lower.includes('rover') || lower.includes('robot') || lower.includes('arm') || lower.includes('car')) {
    domain = 'robotics';
  } else if (lower.includes('smart home') || lower.includes('home assistant') || lower.includes('mqtt') || lower.includes('relay') || lower.includes('weather')) {
    domain = 'iot_smarthome';
  } else if (aiVisionNeed === 'deep_learning_heavy' || lower.includes('vision') || lower.includes('yolo') || lower.includes('defect')) {
    domain = 'vision_ai';
  } else if (lower.includes('game') || lower.includes('arcade') || lower.includes('retro') || lower.includes('display')) {
    domain = 'audio_display';
  } else if (lower.includes('wearable') || lower.includes('wristband') || lower.includes('fitness')) {
    domain = 'wearable';
  } else if (lower.includes('industrial') || lower.includes('factory') || lower.includes('plc') || lower.includes('conveyor')) {
    domain = 'industrial';
  }

  return {
    rawText: text,
    domain,
    aiVisionNeed,
    computeTier,
    realTimeStrictness,
    powerSource,
    connectivity,
    ioNeeds,
    budgetPriority
  };
}

/**
 * Computes recommendation result based on extracted requirements
 */
export function analyzeAndRecommend(req: ProjectRequirements): RecommendationResult {
  const scores: Record<string, { score: number; pros: string[]; cons: string[] }> = {};

  // Initialize scores for all boards
  for (const id of Object.keys(CONTROLLERS)) {
    scores[id] = { score: 65, pros: [], cons: [] };
  }

  // ================= 1. AI & Vision Evaluation =================
  if (req.aiVisionNeed === 'deep_learning_heavy') {
    // Jetson Nano & Orin Nano are top choices
    scores['jetson_orin_nano'].score += 32;
    scores['jetson_orin_nano'].pros.push('40 TOPS Ampere GPU Tensor Cores deliver real-time 60+ FPS deep neural network inference (YOLO/Transformers)');
    
    scores['jetson_nano'].score += 26;
    scores['jetson_nano'].pros.push('128-core CUDA Maxwell GPU runs TensorRT accelerated models natively at 20-30 FPS');

    scores['raspberry_pi_5'].score += 12;
    scores['raspberry_pi_5'].pros.push('Fast quad-core 2.4 GHz CPU can run lightweight MobileNet/YOLOv8n (or connect to Hailo-8 AI Hat)');
    scores['raspberry_pi_5'].cons.push('No dedicated onboard CUDA GPU; sustained heavy inference warms up the CPU');

    // Penalize microcontrollers heavily for deep learning
    scores['arduino_uno_r4'].score -= 45;
    scores['arduino_uno_r4'].cons.push('Cannot run deep learning / YOLO object detection due to 32 KB RAM and lack of GPU');
    scores['arduino_mega_2560'].score -= 50;
    scores['raspberry_pi_pico_2'].score -= 40;
    scores['stm32_f401'].score -= 40;
    scores['beaglebone_black'].score -= 25;
    scores['raspberry_pi_zero_2_w'].score -= 20;
    scores['raspberry_pi_zero_2_w'].cons.push('512 MB RAM is too constrained for deep neural networks');
  } else if (req.aiVisionNeed === 'basic_opencv') {
    scores['raspberry_pi_5'].score += 26;
    scores['raspberry_pi_5'].pros.push('Exceptional OpenCV performance and native dual MIPI-CSI camera interfaces');

    scores['raspberry_pi_zero_2_w'].score += 18;
    scores['raspberry_pi_zero_2_w'].pros.push('Compact CSI camera streaming with quad-core Linux');

    scores['jetson_nano'].score += 15;
    scores['esp32_s3'].score += 10;
    scores['esp32_s3'].pros.push('Supports low-cost DVP camera (OV2640) for basic snapshot streaming at fractional cost');

    scores['arduino_uno_r4'].score -= 30;
    scores['arduino_mega_2560'].score -= 35;
  }

  // ================= 2. Real-Time & Motor Control =================
  if (req.realTimeStrictness === 'hard_realtime') {
    scores['stm32_f401'].score += 28;
    scores['stm32_f401'].pros.push('Hardware Cortex-M4F FPU executes PID & gyro filters in single-cycle microsecond loops');

    scores['arduino_uno_r4'].score += 20;
    scores['arduino_uno_r4'].pros.push('Deterministic bare-metal timing with zero operating system jitter');

    scores['raspberry_pi_pico_2'].score += 22;
    scores['raspberry_pi_pico_2'].pros.push('Dual-core MCU with 12 hardware PIO state machines enables jitter-free waveform generation');

    // Penalize Linux SBCs for hard real-time ONLY if standalone
    scores['raspberry_pi_5'].score -= 15;
    scores['raspberry_pi_5'].cons.push('Linux kernel scheduling jitter prevents deterministic microsecond motor/signal pulsing alone');
    scores['jetson_nano'].score -= 15;
    scores['jetson_nano'].cons.push('Non-deterministic Linux OS makes standalone high-frequency motor timing risky');
  } else if (req.realTimeStrictness === 'soft_realtime') {
    scores['arduino_uno_r4'].score += 10;
    scores['raspberry_pi_pico_2'].score += 12;
    scores['stm32_f401'].score += 12;
    if (req.ioNeeds.multipleMotorsOrServos) {
      scores['arduino_mega_2560'].score += 15;
      scores['arduino_mega_2560'].pros.push('15 PWM pins and 54 digital I/O easily drive multiple motor drivers without port expanders');
    }
  }

  // ================= 3. Power Source & Energy Efficiency =================
  if (req.powerSource === 'coin_or_solar') {
    scores['esp32_s3'].score += 26;
    scores['esp32_s3'].pros.push('Industry-leading deep sleep (<15 µA) allows months of solar or battery life with periodic wakeups');

    scores['raspberry_pi_pico_2'].score += 18;
    scores['raspberry_pi_pico_2'].pros.push('Low sleep current (~18 µA dormant mode) and flexible 1.8V - 5.5V supply regulator');

    scores['arduino_uno_r4'].score += 10;

    // Heavily penalize power-hungry Linux SBCs & Edge AI
    scores['jetson_nano'].score -= 35;
    scores['jetson_nano'].cons.push('Draws 5W - 10W; impossible to run for more than an hour on small solar panels or coin cells');
    scores['jetson_orin_nano'].score -= 40;
    scores['jetson_orin_nano'].cons.push('High peak power (15W+) requires heavy wall brick or 4S LiPo');
    scores['raspberry_pi_5'].score -= 30;
    scores['raspberry_pi_5'].cons.push('Consumes 5W - 12W, making continuous solar/battery operation bulky and expensive');
  } else if (req.powerSource === 'rechargeable_battery') {
    scores['esp32_s3'].score += 12;
    scores['raspberry_pi_zero_2_w'].score += 14;
    scores['raspberry_pi_zero_2_w'].pros.push('Draws only ~1W-2W, making it easily rechargeable from small single-cell LiPo packs');
    scores['raspberry_pi_pico_2'].score += 12;
  }

  // ================= 4. Connectivity =================
  if (req.connectivity === 'wifi') {
    scores['esp32_s3'].score += 24;
    scores['esp32_s3'].pros.push('Built-in 2.4 GHz 802.11 b/g/n WiFi and Bluetooth 5.0 Mesh with native ESPHome/MQTT support');

    scores['raspberry_pi_5'].score += 16;
    scores['raspberry_pi_5'].pros.push('Dual-band 802.11ac WiFi and Gigabit Ethernet for high-throughput streaming');

    scores['raspberry_pi_zero_2_w'].score += 15;
    scores['arduino_uno_r4'].score += 12; // Uno R4 WiFi model

    // Penalize boards with zero wireless
    scores['arduino_mega_2560'].score -= 15;
    scores['arduino_mega_2560'].cons.push('No onboard WiFi/Bluetooth; requires external ESP8266 or wireless shield');
    scores['stm32_f401'].score -= 15;
    scores['stm32_f401'].cons.push('No onboard wireless transceiver');
    scores['jetson_nano'].score -= 8;
    scores['jetson_nano'].cons.push('Does not include onboard WiFi; requires separate M.2 Key E card or USB adapter');
  } else if (req.connectivity === 'bluetooth') {
    scores['esp32_s3'].score += 22;
    scores['esp32_s3'].pros.push('BLE 5.0 with Long Range (Coded PHY) and low-energy advertising');
    scores['raspberry_pi_zero_2_w'].score += 14;
    scores['raspberry_pi_5'].score += 10;
  }

  // ================= 5. Display & GUI Requirements =================
  if (req.ioNeeds.displayOutput) {
    if (req.computeTier !== 'micro') {
      scores['raspberry_pi_5'].score += 20;
      scores['raspberry_pi_5'].pros.push('Dual 4Kp60 HDMI outputs with hardware OpenGL ES 3.1 & Vulkan graphics');
      scores['raspberry_pi_zero_2_w'].score += 18;
      scores['raspberry_pi_zero_2_w'].pros.push('Mini HDMI output renders full 1080p retro games and interfaces');
      scores['jetson_nano'].score += 12;
    } else {
      scores['esp32_s3'].score += 10;
      scores['esp32_s3'].pros.push('Supports SPI/I2C/Parallel RGB displays via LVGL GUI library');
      scores['raspberry_pi_pico_2'].score += 10;
    }
  }

  // ================= 6. Budget & Cost Priority =================
  if (req.budgetPriority === 'budget_first') {
    scores['esp32_s3'].score += 18;
    scores['raspberry_pi_pico_2'].score += 18;
    scores['raspberry_pi_zero_2_w'].score += 12;
    scores['stm32_f401'].score += 14;

    scores['jetson_nano'].score -= 22;
    scores['jetson_nano'].cons.push('High board cost ($129+) plus power supply and cooler exceeds tight hobby budgets');
    scores['jetson_orin_nano'].score -= 35;
    scores['jetson_orin_nano'].cons.push('High component cost ($299+) requires significant budget');
    scores['raspberry_pi_5'].score -= 12;
  } else if (req.budgetPriority === 'performance_first') {
    scores['jetson_orin_nano'].score += 20;
    scores['raspberry_pi_5'].score += 12;
  }

  // ================= 7. Domain Bonus & Fine Tuning =================
  if (req.domain === 'iot_smarthome') {
    scores['esp32_s3'].score += 14;
    scores['arduino_uno_r4'].score += 8;
  } else if (req.domain === 'wearable') {
    scores['raspberry_pi_zero_2_w'].score += 15;
    scores['esp32_s3'].score += 14;
    scores['raspberry_pi_pico_2'].score += 14;
    scores['jetson_nano'].score -= 25;
  } else if (req.domain === 'industrial') {
    scores['beaglebone_black'].score += 25;
    scores['beaglebone_black'].pros.push('Dual 200 MHz PRU real-time units + CAN bus ideal for industrial automation');
    scores['stm32_f401'].score += 16;
  }

  // Rank boards
  const sortedBoardIds = Object.keys(scores).sort((a, b) => scores[b].score - scores[a].score);

  const primaryId = sortedBoardIds[0];
  const secondaryId = sortedBoardIds[1];

  const primaryController = CONTROLLERS[primaryId];
  const secondaryController = CONTROLLERS[secondaryId];

  // Clamp match scores to realistic 70-98%
  const primaryMatchScore = Math.min(98, Math.max(76, Math.round(scores[primaryId].score)));
  const secondaryMatchScore = Math.min(primaryMatchScore - 4, Math.max(68, Math.round(scores[secondaryId].score)));

  // ================= 8. Hybrid Architecture Detection =================
  // Check if the project is a complex robot/system needing BOTH high-level intelligence and real-time actuation
  const needsHighLevelBrain = req.aiVisionNeed !== 'none' || req.computeTier !== 'micro';
  const needsDeterministicMotors = req.realTimeStrictness !== 'non_critical' || req.ioNeeds.multipleMotorsOrServos;
  const isHybridRecommended = needsHighLevelBrain && needsDeterministicMotors;

  let hybridSetup: HybridSetup | undefined;
  if (isHybridRecommended) {
    const brain = (primaryController.category === 'edge_ai' || primaryController.category === 'sbc')
      ? primaryController
      : (req.aiVisionNeed === 'deep_learning_heavy' ? CONTROLLERS['jetson_nano'] : CONTROLLERS['raspberry_pi_5']);

    const companion = req.realTimeStrictness === 'hard_realtime'
      ? CONTROLLERS['stm32_f401']
      : (req.ioNeeds.multipleMotorsOrServos ? CONTROLLERS['arduino_mega_2560'] : CONTROLLERS['arduino_uno_r4']);

    hybridSetup = {
      brainBoard: brain,
      companionMcu: companion,
      interfaceProtocol: 'USB Serial (CDC) or High-Speed UART @ 115200 / 921600 Baud with CRC8 framing',
      rationale:
        'Professional robotics separation of concerns: The SBC/Jetson runs Linux for computer vision, AI path planning, and wireless telemetry, while the dedicated microcontroller executes microsecond PID motor control and reads encoders with zero jitter.',
      responsibilities: {
        brain: [
          'High-resolution camera capture & neural network inference (YOLO / TensorRT)',
          'LiDAR scan processing, SLAM navigation, and obstacle avoidance mapping',
          'Web dashboard streaming, ROS 2 nodes, and wireless cloud telemetry',
          'Sending high-level velocity commands (vx, vy, omega) to the MCU'
        ],
        mcu: [
          'Deterministic 1 kHz PID motor speed loops using quadrature encoder interrupts',
          'Smooth PWM acceleration ramping to prevent current spikes',
          'Emergency bump sensor & ultrasonic hard-stop interlocks (<1ms reaction)',
          'Sending odometry and battery voltage telemetry back to the brain'
        ]
      },
      interconnectGuide:
        `Connect TX/RX pins (with level-shifter if 3.3V to 5V) or plug the ${companion.name} directly into the ${brain.name}'s USB 3.0 port for plug-and-play serial communication.`
    };
  }

  // ================= 9. Wiring & Interfacing Blueprint =================
  const wiringBlueprint: WiringItem[] = [];

  if (primaryController.category === 'edge_ai' || primaryController.category === 'sbc') {
    if (req.ioNeeds.highSpeedCamera) {
      wiringBlueprint.push({
        component: 'High-Definition MIPI CSI Camera Module (Sony IMX219 / IMX477)',
        controllerPin: 'MIPI CSI-2 Port (15-pin / 22-pin ribbon cable)',
        protocol: 'CSI',
        notes: 'Enables direct zero-copy GPU video ingestion without USB bus latency'
      });
    }
    if (req.ioNeeds.multipleMotorsOrServos) {
      wiringBlueprint.push({
        component: 'PCA9685 16-Channel 12-bit PWM I2C Servo/Motor Driver',
        controllerPin: 'Pin 3 (SDA), Pin 5 (SCL), Pin 2 (5V), Pin 6 (GND)',
        protocol: 'I2C',
        notes: 'Offloads PWM timing generation from the Linux CPU; power servo rails externally'
      });
    }
    if (req.ioNeeds.displayOutput) {
      wiringBlueprint.push({
        component: 'HDMI or Touchscreen Display (DSI / HDMI)',
        controllerPin: 'HDMI Port 0',
        protocol: 'Power',
        notes: 'Supports up to 4K resolution with hardware acceleration'
      });
    }
  } else {
    // Microcontroller wiring
    if (req.ioNeeds.analogSensors) {
      wiringBlueprint.push({
        component: 'Analog Moisture / Current / Gas Sensor',
        controllerPin: primaryController.id === 'esp32_s3' ? 'GPIO 1 (ADC1_CH0)' : 'Analog Pin A0',
        protocol: 'ADC',
        notes: primaryController.id === 'esp32_s3' ? 'Use ADC1 channels; ADC2 is disabled when WiFi radio transmits' : 'Read via 10-bit or 14-bit analogRead()'
      });
    }
    if (req.ioNeeds.multipleMotorsOrServos) {
      wiringBlueprint.push({
        component: 'Dual H-Bridge Motor Driver (L298N / TB6612FNG)',
        controllerPin: 'Digital PWM Pins D5, D6, D9, D10',
        protocol: 'PWM',
        notes: 'Connect common GND between logic supply and motor battery pack'
      });
    }
    if (req.ioNeeds.displayOutput) {
      wiringBlueprint.push({
        component: 'SSD1306 0.96-inch OLED Screen (128x64)',
        controllerPin: 'I2C Pins (SDA & SCL)',
        protocol: 'I2C',
        notes: 'Standard 4-wire interface (VCC 3.3V/5V, GND, SDA, SCL)'
      });
    }
  }

  // Power wiring
  if (primaryController.id === 'jetson_nano') {
    wiringBlueprint.push({
      component: '5V 4A DC Power Supply (2.1mm Barrel Jack)',
      controllerPin: 'J28 Barrel Jack + J48 Power Select Jumper Closed',
      protocol: 'Power',
      notes: 'CRITICAL: Close jumper J48 to disable Micro-USB power and prevent GPU throttling'
    });
  } else if (primaryController.id === 'raspberry_pi_5') {
    wiringBlueprint.push({
      component: '5V 5A USB-C Power Adapter (with Power Delivery)',
      controllerPin: 'USB Type-C Power In',
      protocol: 'Power',
      notes: 'Provides full 1.6A downstream current to USB peripherals and NVMe drives'
    });
  } else if (primaryController.id === 'esp32_s3') {
    wiringBlueprint.push({
      component: '3.7V 18650 Li-ion Battery with TP4056 Charger & 3.3V LDO',
      controllerPin: 'VIN / 5V or 3.3V Pin',
      protocol: 'Power',
      notes: 'Add 100uF electrolytic capacitor across 3.3V rail to suppress WiFi TX current spikes'
    });
  }

  // ================= 10. Bill of Materials (BOM) =================
  const billOfMaterials: BOMItem[] = [
    {
      item: primaryController.name,
      category: 'Controller',
      estimatedCost: `$${primaryController.approxUsd}`,
      purpose: 'Primary processing unit & controller'
    }
  ];

  if (isHybridRecommended && hybridSetup) {
    billOfMaterials.push({
      item: hybridSetup.companionMcu.name,
      category: 'Controller',
      estimatedCost: `$${hybridSetup.companionMcu.approxUsd}`,
      purpose: 'Real-time companion MCU for jitter-free motor actuation'
    });
  }

  if (req.ioNeeds.highSpeedCamera) {
    billOfMaterials.push({
      item: 'Sony IMX219 / OV5647 8MP Camera Module',
      category: 'Sensor/Actuator',
      estimatedCost: '$15 - $25',
      purpose: 'Video feed & computer vision ingestion'
    });
  }

  if (req.ioNeeds.multipleMotorsOrServos) {
    billOfMaterials.push({
      item: 'Motor Driver Board (TB6612FNG or L298N) / Servo Controller',
      category: 'Interface/Shield',
      estimatedCost: '$6 - $12',
      purpose: 'Power amplification and H-Bridge motor direction control'
    });
  }

  if (req.powerSource === 'coin_or_solar') {
    billOfMaterials.push({
      item: '5V 2W Solar Cell + TP4056 LiPo Charge Management Board',
      category: 'Power/Regulator',
      estimatedCost: '$8 - $14',
      purpose: 'Harvest solar energy and safely charge 18650 cell'
    });
  } else if (req.powerSource === 'rechargeable_battery') {
    billOfMaterials.push({
      item: '11.1V 3S LiPo Battery Pack (2200mAh) + 5V 5A UBEC Step-Down',
      category: 'Power/Regulator',
      estimatedCost: '$25 - $35',
      purpose: 'High discharge battery for motors + clean 5V regulated rail'
    });
  } else {
    billOfMaterials.push({
      item: 'Regulated AC-to-DC Wall Adapter (5V / 3A-5A)',
      category: 'Power/Regulator',
      estimatedCost: '$10 - $18',
      purpose: 'Stable mains power supply'
    });
  }

  // ================= 11. Pitfalls & Critical Warnings =================
  const criticalWarnings = [...primaryController.gotchas];
  if (isHybridRecommended) {
    criticalWarnings.push(
      'Voltage Level Mismatch: Ensure you do NOT connect a 5V Arduino TX pin directly to a 3.3V Raspberry Pi/Jetson RX pin without a bidirectional logic level shifter ($1.50) or simple resistor divider.'
    );
  }
  if (req.ioNeeds.multipleMotorsOrServos) {
    criticalWarnings.push(
      'Flyback Inductive Spikes: Motors and solenoids create large reverse-voltage spikes when turned off. Always ensure your driver has flyback diodes and a common ground with the controller.'
    );
  }

  // Execution Plan steps
  const executionPlan = [
    `Stage 1: Flash initial test firmware to ${primaryController.name} and verify serial telemetry output.`,
    req.ioNeeds.highSpeedCamera
      ? 'Stage 2: Connect camera and verify frame capture rate (FPS) and exposure settings.'
      : 'Stage 2: Wire primary sensors on a breadboard and log calibrated data over serial.',
    isHybridRecommended
      ? `Stage 3: Establish bidirectional UART protocol between ${hybridSetup?.brainBoard.name} and ${hybridSetup?.companionMcu.name}.`
      : 'Stage 3: Implement core application state machine and fail-safe watchdog timer.',
    'Stage 4: Perform load testing under full electrical load to monitor thermal status and power voltage sag.',
    'Stage 5: Finalize enclosure design, cable strain relief, and deploy!'
  ];

  return {
    primary: primaryController,
    primaryMatchScore,
    primaryPros: scores[primaryId].pros.length ? scores[primaryId].pros : primaryController.strengths.slice(0, 3),
    primaryCons: scores[primaryId].cons.length ? scores[primaryId].cons : primaryController.limitations.slice(0, 2),
    secondary: secondaryController,
    secondaryMatchScore,
    secondaryRationale: `A viable ${secondaryController.category.toUpperCase()} alternative if you prefer ${secondaryController.strengths[0].toLowerCase()}.`,
    isHybridRecommended,
    hybridSetup,
    keyFactorsSummary: {
      aiCapability: {
        score: req.aiVisionNeed === 'deep_learning_heavy' ? 95 : req.aiVisionNeed === 'basic_opencv' ? 80 : 40,
        verdict: req.aiVisionNeed === 'deep_learning_heavy' ? 'Requires TensorRT GPU or Hailo accelerator' : req.aiVisionNeed === 'basic_opencv' ? 'Handled smoothly via OpenCV / SBC' : 'Standard sensor logic'
      },
      realTimePrecision: {
        score: req.realTimeStrictness === 'hard_realtime' ? 95 : req.realTimeStrictness === 'soft_realtime' ? 80 : 50,
        verdict: req.realTimeStrictness === 'hard_realtime' ? 'Dedicated hardware timers / FPU mandatory' : 'Standard PWM motor control'
      },
      powerEfficiency: {
        score: req.powerSource === 'coin_or_solar' ? 95 : req.powerSource === 'rechargeable_battery' ? 80 : 55,
        verdict: req.powerSource === 'coin_or_solar' ? 'Sub-20µA deep sleep mandatory' : 'Battery/Mains compatible'
      },
      connectivityFit: {
        score: req.connectivity === 'wifi' || req.connectivity === 'bluetooth' ? 90 : 50,
        verdict: req.connectivity !== 'none' ? `${req.connectivity.toUpperCase()} enabled` : 'Offline / Self-contained'
      },
      costEfficiency: {
        score: req.budgetPriority === 'budget_first' ? 95 : 75,
        verdict: `Target BOM range: $${primaryController.approxUsd + 20} - $${primaryController.approxUsd + 60}`
      }
    },
    wiringBlueprint,
    billOfMaterials,
    criticalWarnings,
    executionPlan
  };
}
