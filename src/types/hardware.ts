export type BoardCategory = 'mcu' | 'connected_mcu' | 'sbc' | 'edge_ai' | 'industrial';

export interface BoardSpecs {
  cpu: string;
  architecture: string;
  clockSpeed: string;
  ram: string;
  storage: string;
  gpu?: string;
  aiTops?: string;
  operatingSystem: string;
  gpioCount: number;
  adcChannels: number;
  pwmPins: number;
  interfaces: string[];
  wireless: string[];
  powerDrawTypical: string;
  powerDrawPeak: string;
  operatingVoltage: string;
  formFactor: string;
}

export interface StarterCode {
  language: string;
  title: string;
  filename: string;
  code: string;
}

export interface Controller {
  id: string;
  name: string;
  manufacturer: string;
  tagline: string;
  category: BoardCategory;
  badgeColor: string;
  approxUsd: number;
  priceRange: string;
  specs: BoardSpecs;
  strengths: string[];
  limitations: string[];
  bestFor: string[];
  idealDomains: string[];
  gotchas: string[];
  starterCode: StarterCode;
}

export interface ProjectRequirements {
  rawText: string;
  domain: 'robotics' | 'iot_smarthome' | 'vision_ai' | 'audio_display' | 'wearable' | 'industrial' | 'general';
  aiVisionNeed: 'none' | 'basic_opencv' | 'deep_learning_heavy';
  computeTier: 'micro' | 'linux_sbc' | 'edge_ai_gpu';
  realTimeStrictness: 'hard_realtime' | 'soft_realtime' | 'non_critical';
  powerSource: 'coin_or_solar' | 'rechargeable_battery' | 'mains_power';
  connectivity: 'none' | 'bluetooth' | 'wifi' | 'lora_cellular';
  ioNeeds: {
    analogSensors: boolean;
    highSpeedCamera: boolean;
    multipleMotorsOrServos: boolean;
    displayOutput: boolean;
    canBus: boolean;
    audioInOrOut: boolean;
  };
  budgetPriority: 'budget_first' | 'balanced' | 'performance_first';
}

export interface WiringItem {
  component: string;
  controllerPin: string;
  protocol: 'GPIO' | 'I2C' | 'SPI' | 'UART' | 'PWM' | 'ADC' | 'USB' | 'CSI' | 'Power';
  notes: string;
}

export interface BOMItem {
  item: string;
  category: 'Controller' | 'Sensor/Actuator' | 'Power/Regulator' | 'Interface/Shield';
  estimatedCost: string;
  purpose: string;
}

export interface HybridSetup {
  brainBoard: Controller;
  companionMcu: Controller;
  interfaceProtocol: string;
  rationale: string;
  responsibilities: {
    brain: string[];
    mcu: string[];
  };
  interconnectGuide: string;
}

export interface RecommendationResult {
  primary: Controller;
  primaryMatchScore: number;
  primaryPros: string[];
  primaryCons: string[];
  secondary: Controller;
  secondaryMatchScore: number;
  secondaryRationale: string;
  isHybridRecommended: boolean;
  hybridSetup?: HybridSetup;
  keyFactorsSummary: {
    aiCapability: { score: number; verdict: string };
    realTimePrecision: { score: number; verdict: string };
    powerEfficiency: { score: number; verdict: string };
    connectivityFit: { score: number; verdict: string };
    costEfficiency: { score: number; verdict: string };
  };
  wiringBlueprint: WiringItem[];
  billOfMaterials: BOMItem[];
  criticalWarnings: string[];
  executionPlan: string[];
}

export interface ProjectPreset {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  tags: string[];
  suggestedText: string;
}
