import { Controller, ProjectPreset } from '../types/hardware';

export const CONTROLLERS: Record<string, Controller> = {
  arduino_uno_r4: {
    id: 'arduino_uno_r4',
    name: 'Arduino Uno R4 (WiFi / Minima)',
    manufacturer: 'Arduino LLC',
    tagline: 'The modern 32-bit evolution of the world standard educational MCU',
    category: 'mcu',
    badgeColor: 'emerald',
    approxUsd: 22,
    priceRange: '$18 - $28',
    specs: {
      cpu: 'Renesas RA4M1 (Arm Cortex-M4 with FPU)',
      architecture: '32-bit ARM Cortex-M4',
      clockSpeed: '48 MHz',
      ram: '32 KB SRAM',
      storage: '256 KB Flash',
      operatingSystem: 'Bare-metal / FreeRTOS (Deterministic Hard Real-Time)',
      gpioCount: 14,
      adcChannels: 6,
      pwmPins: 6,
      interfaces: ['I2C', 'SPI', 'UART', 'CAN bus', '12-bit DAC', 'Op-Amp'],
      wireless: ['WiFi 802.11 b/g/n (WiFi model)', 'Bluetooth 5.0 (WiFi model)'],
      powerDrawTypical: '150 mW (30 mA @ 5V)',
      powerDrawPeak: '400 mW',
      operatingVoltage: '5V Logic (6-24V Input via Barrel Jack)',
      formFactor: 'Standard Arduino Shield (68.6 x 53.4 mm)'
    },
    strengths: [
      '5V logic tolerance avoids damaging legacy 5V sensors and relay boards',
      'True deterministic hard real-time execution with microsecond pulse timing',
      'Vast ecosystem of thousands of beginner-friendly libraries and shields',
      'Built-in 12x8 LED matrix on the WiFi version for instant visual debug',
      'Hardware CAN bus and 12-bit DAC included natively'
    ],
    limitations: [
      '32 KB RAM cannot buffer video, high-res audio, or deep neural networks',
      'No HDMI/Display output or high-speed USB host for webcams',
      'Not suitable for multi-process desktop OS or complex web servers'
    ],
    bestFor: [
      'Beginner to intermediate electronics & sensor prototyping',
      'Hard real-time motor/servo PWM pulsing without jitter',
      '5V relay switching, home automation switches, and physical actuators',
      'Classroom robotics (line tracking, obstacle avoidance, robotic grippers)'
    ],
    idealDomains: ['robotics', 'iot_smarthome', 'general'],
    gotchas: [
      'Ensure you purchase the WiFi version if network connectivity is required; Minima lacks radio.',
      'Max output current per pin is 8 mA (lower than the older Uno R3 20 mA AVR limits).'
    ],
    starterCode: {
      language: 'cpp',
      title: 'Arduino Uno R4 Sensor Loop & Motor Control',
      filename: 'arduino_controller.ino',
      code: `// Arduino Uno R4 Starter Firmware
// Reads analog sensor with 14-bit ADC & drives PWM motor
#include <Arduino.h>

const int SENSOR_PIN = A0;
const int MOTOR_PWM_PIN = 9;
const int STATUS_LED = 13;

void setup() {
  Serial.begin(115200);
  analogReadResolution(14); // RA4M1 supports up to 14-bit resolution
  pinMode(MOTOR_PWM_PIN, OUTPUT);
  pinMode(STATUS_LED, OUTPUT);
  Serial.println("[SYSTEM READY] Arduino Uno R4 Real-Time Control Loop Active");
}

void loop() {
  // Read analog input (0 - 16383)
  int rawValue = analogRead(SENSOR_PIN);
  float voltage = (rawValue * 5.0) / 16383.0;

  // Scale to PWM (0 - 255)
  int pwmValue = map(rawValue, 0, 16383, 0, 255);
  analogWrite(MOTOR_PWM_PIN, pwmValue);

  // Status telemetry
  digitalWrite(STATUS_LED, (rawValue > 8000) ? HIGH : LOW);

  Serial.print("Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 3);
  Serial.print("V | PWM: ");
  Serial.println(pwmValue);

  delay(20); // 50 Hz deterministic loop
}`
    }
  },

  arduino_mega_2560: {
    id: 'arduino_mega_2560',
    name: 'Arduino Mega 2560 Rev3',
    manufacturer: 'Arduino LLC',
    tagline: 'High-I/O workhorse with 54 digital pins and 4 hardware serial ports',
    category: 'mcu',
    badgeColor: 'teal',
    approxUsd: 40,
    priceRange: '$35 - $48',
    specs: {
      cpu: 'Microchip ATmega2560',
      architecture: '8-bit AVR',
      clockSpeed: '16 MHz',
      ram: '8 KB SRAM',
      storage: '256 KB Flash (8 KB for bootloader)',
      operatingSystem: 'Bare-metal Hard Real-Time',
      gpioCount: 54,
      adcChannels: 16,
      pwmPins: 15,
      interfaces: ['4x Hardware UART', 'I2C', 'SPI', '16-channel 10-bit ADC'],
      wireless: ['None (Requires external shield / ESP8266)'],
      powerDrawTypical: '250 mW (50 mA @ 5V)',
      powerDrawPeak: '600 mW',
      operatingVoltage: '5V Logic (7-12V Input)',
      formFactor: 'Mega Form Factor (101.5 x 53.3 mm)'
    },
    strengths: [
      'Huge pin count: 54 digital I/O pins and 16 analog inputs',
      '4 hardware serial ports (UART) for simultaneously talking to GPS, Bluetooth, sensors, and PC',
      'Industry standard for 3D printers (RAMPS shields) and complex multi-stepper machines',
      'Very rugged 5V logic with 20-40 mA per pin current capacity'
    ],
    limitations: [
      'Older 8-bit architecture with low 16 MHz clock speed',
      'No native WiFi/Bluetooth (needs external module)',
      'Relatively high price for low computational power compared to 32-bit chips'
    ],
    bestFor: [
      'Multi-axis CNC machines and 3D printers requiring dozens of endstops & stepper drivers',
      'Robotics with multiple serial peripherals (LiDAR, GPS, telemetry transceiver)',
      'Large physical switchboards or instrument panels'
    ],
    idealDomains: ['robotics', 'industrial'],
    gotchas: [
      'Not for heavy math or DSP. For high-speed inverse kinematics, consider STM32 or Teensy.'
    ],
    starterCode: {
      language: 'cpp',
      title: 'Arduino Mega Multi-UART Serial Bridge & Pin Matrix',
      filename: 'mega_controller.ino',
      code: `// Arduino Mega 2560 Multi-Serial Controller
#include <Arduino.h>

void setup() {
  Serial.begin(115200);   // Debug to PC
  Serial1.begin(9600);    // GPS or Telemetry module
  Serial2.begin(115200);  // High-speed companion SBC (Raspberry Pi/Jetson)

  for (int pin = 22; pin <= 30; pin++) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, LOW);
  }
  Serial.println("[MEGA 2560] Multi-Serial Routing Active");
}

void loop() {
  // Forward bytes from GPS to Host
  while (Serial1.available()) {
    char c = Serial1.read();
    Serial.write(c);
  }

  // Receive commands from Companion computer
  if (Serial2.available()) {
    int cmd = Serial2.read();
    if (cmd >= '0' && cmd <= '8') {
      int pinIdx = 22 + (cmd - '0');
      digitalWrite(pinIdx, !digitalRead(pinIdx));
    }
  }
}`
    }
  },

  esp32_s3: {
    id: 'esp32_s3',
    name: 'ESP32-S3 (Dual-Core AI + IoT MCU)',
    manufacturer: 'Espressif Systems',
    tagline: 'High-speed wireless champion with vector instructions and deep sleep',
    category: 'connected_mcu',
    badgeColor: 'amber',
    approxUsd: 5,
    priceRange: '$4 - $8',
    specs: {
      cpu: 'Xtensa Dual-Core 32-bit LX7 with Vector Instructions',
      architecture: 'Xtensa 32-bit',
      clockSpeed: 'Up to 240 MHz',
      ram: '512 KB SRAM + up to 8 MB Octal PSRAM',
      storage: '4 MB - 16 MB SPI Flash',
      aiTops: 'Vector extension instructions for TinyML/Wake-word',
      operatingSystem: 'FreeRTOS / ESP-IDF / Arduino Framework',
      gpioCount: 45,
      adcChannels: 20,
      pwmPins: 16,
      interfaces: ['WiFi 4 (802.11 b/g/n)', 'BLE 5.0 Mesh', 'USB OTG Native', 'DVP Camera Interface', 'LCD 8-bit/16-bit', 'I2S', 'TWAI (CAN)'],
      wireless: ['2.4 GHz WiFi (150 Mbps)', 'Bluetooth 5.0 Low Energy (Long Range)'],
      powerDrawTypical: '260 mW (active WiFi TX)',
      powerDrawPeak: '800 mW',
      operatingVoltage: '3.3V Logic (5V USB Input)',
      formFactor: 'Compact Module / DevKit (55 x 28 mm)'
    },
    strengths: [
      'Unmatched price-to-performance ($5 for dual 240 MHz cores + WiFi + BLE)',
      'Ultra-low power deep sleep (sub 15 µA) allows months of runtime on LiPo/18650 batteries',
      'Native camera interface (DVP) supports OV2640/OV5640 for cheap image capture',
      'Hardware vector acceleration for on-device voice wake-words and TinyML classification',
      'Native USB OTG for direct HID keyboard/mouse emulation'
    ],
    limitations: [
      '3.3V logic: Connecting 5V signals directly will fry the GPIO without level shifting',
      'Cannot run standard Linux distributions (no apt-get, no full Python runtime)',
      'WiFi ADC2 cannot be used simultaneously with WiFi radio'
    ],
    bestFor: [
      'Smart home devices (Home Assistant, MQTT, ESPHome, Matter)',
      'Battery or solar-powered remote weather stations and environmental monitors',
      'Low-cost security cameras and video streaming doorbells (ESP32-CAM)',
      'TinyML speech recognition, gesture detection, and vibration anomaly monitoring'
    ],
    idealDomains: ['iot_smarthome', 'wearable', 'general'],
    gotchas: [
      'Never supply 5V to any GPIO pin; always use level shifters or voltage dividers.',
      'WiFi burst transmission draws up to 350-400 mA peaks; weak USB cables will cause boot brownout loops.'
    ],
    starterCode: {
      language: 'cpp',
      title: 'ESP32-S3 WiFi Telemetry & Deep Sleep Node',
      filename: 'esp32_iot_node.ino',
      code: `// ESP32-S3 IoT Node with WiFi Telemetry & Deep Sleep
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASS";
const char* serverUrl = "http://api.smarthome.local/sensors";

#define uS_TO_S_FACTOR 1000000ULL /* Conversion factor for micro seconds to seconds */
#define TIME_TO_SLEEP  60        /* Time ESP32 will go to sleep (in seconds) */

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("[BOOT] ESP32-S3 Waking from Sleep");
  WiFi.begin(ssid, password);

  int timeout = 0;
  while (WiFi.status() != WL_CONNECTED && timeout < 20) {
    delay(500);
    Serial.print(".");
    timeout++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WIFI] Connected! Reading sensors...");
    float tempC = 24.5; // Sensor read logic
    
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    String payload = "{\\"sensor\\":\\"temp\\",\\"value\\":" + String(tempC) + "}";
    int httpResponseCode = http.POST(payload);
    Serial.printf("[HTTP] Sent! Code: %d\n", httpResponseCode);
    http.end();
  }

  // Configure timer wake up and enter Deep Sleep to conserve battery (<20uA)
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  Serial.println("[POWER] Going to deep sleep now...");
  Serial.flush();
  esp_deep_sleep_start();
}

void loop() {
  // Never executed due to deep sleep
}`
    }
  },

  raspberry_pi_pico_2: {
    id: 'raspberry_pi_pico_2',
    name: 'Raspberry Pi Pico 2 / Pico (RP2350 / RP2040)',
    manufacturer: 'Raspberry Pi Ltd',
    tagline: 'Ultra low-cost dual-core MCU with unique programmable I/O (PIO)',
    category: 'mcu',
    badgeColor: 'rose',
    approxUsd: 5,
    priceRange: '$4 - $7',
    specs: {
      cpu: 'RP2350 (Dual Arm Cortex-M33 + Dual Hazard3 RISC-V @ 150 MHz)',
      architecture: 'Dual 32-bit ARM Cortex-M33 / RISC-V selectable',
      clockSpeed: '150 MHz',
      ram: '520 KB on-chip SRAM',
      storage: '4 MB onboard QSPI Flash',
      operatingSystem: 'Bare-metal / FreeRTOS / MicroPython / CircuitPython',
      gpioCount: 26,
      adcChannels: 3,
      pwmPins: 16,
      interfaces: ['12x PIO State Machines', '2x UART', '2x SPI', '2x I2C', 'USB 1.1 Host/Device'],
      wireless: ['None (Pico 2 W has WiFi/BLE)'],
      powerDrawTypical: '90 mW (18 mA @ 5V)',
      powerDrawPeak: '250 mW',
      operatingVoltage: '3.3V Logic (1.8V to 5.5V Input Buck-Boost)',
      formFactor: 'DIP-style compact board (51 x 21 mm)'
    },
    strengths: [
      'PIO (Programmable I/O) hardware blocks can emulate any protocol without CPU overhead (VGA, DVI, WS2812, CAN, custom bit-banging)',
      'Dual-core architecture lets core 0 run user interface/logic while core 1 handles deterministic timing',
      'Dual architecture choice: run either ARM Cortex-M33 or open RISC-V cores',
      'Exceptional MicroPython and C/C++ SDK documentation',
      'Ultra low price ($5) with high reliability and wide input voltage (1.8V - 5.5V)'
    ],
    limitations: [
      'No hardware floating point division unit on older RP2040 (RP2350 adds hardware FPU)',
      'Base model lacks wireless (needs Pico W / Pico 2 W for WiFi/Bluetooth)',
      'Only 3 analog ADC channels available'
    ],
    bestFor: [
      'Custom protocol synthesis (generating video signals, high-speed LED matrices)',
      'Dual-core motor PID control and robotic sensor fusion',
      'Precision USB human interface devices (custom macro pads, game controllers, MIDI instruments)',
      'MicroPython rapid prototyping'
    ],
    idealDomains: ['robotics', 'audio_display', 'general'],
    gotchas: [
      'GPIO pins are strictly 3.3V tolerant; do not connect 5V sensors directly.'
    ],
    starterCode: {
      language: 'python',
      title: 'Pico Dual-Core Real-Time Task in MicroPython',
      filename: 'main.py',
      code: `# Raspberry Pi Pico / Pico 2 MicroPython
# Core 1 runs precision motor PWM loop; Core 0 handles sensors & telemetry
import time
import _thread
from machine import Pin, PWM, ADC

led = Pin(25, Pin.OUT)
pwm_motor = PWM(Pin(16))
pwm_motor.freq(20000) # 20 kHz silent motor drive
pot = ADC(26)

def core1_realtime_loop():
    """Runs independently on the second CPU core with zero jitter"""
    duty = 0
    step = 500
    while True:
        duty += step
        if duty >= 65000 or duty <= 0:
            step = -step
        pwm_motor.duty_u16(duty)
        time.sleep_us(500) # Deterministic 2 kHz update

# Launch real-time loop on second core
_thread.start_new_thread(core1_realtime_loop, ())

# Core 0 handles slow telemetry and telemetry logging
while True:
    sensor_val = pot.read_u16()
    led.toggle()
    print(f"[CORE 0] Analog Input: {sensor_val} | System Running")
    time.sleep(0.2)`
    }
  },

  stm32_f401: {
    id: 'stm32_f401',
    name: 'STM32F401 / F411 ("BlackPill" / Nucleo)',
    manufacturer: 'STMicroelectronics',
    tagline: 'High-performance ARM Cortex-M4 for industrial control and drone flight controllers',
    category: 'mcu',
    badgeColor: 'sky',
    approxUsd: 6,
    priceRange: '$5 - $12',
    specs: {
      cpu: 'ARM Cortex-M4 with Single-Precision FPU & DSP',
      architecture: '32-bit ARM Cortex-M4F',
      clockSpeed: '84 MHz - 100 MHz',
      ram: '64 KB - 128 KB SRAM',
      storage: '256 KB - 512 KB Flash',
      operatingSystem: 'Bare-metal / FreeRTOS / RT-Thread / Betaflight',
      gpioCount: 32,
      adcChannels: 16,
      pwmPins: 16,
      interfaces: ['3x I2C', '4x SPI', '3x USART', 'USB OTG Full Speed', '12-bit ADC @ 2.4 MSPS'],
      wireless: ['None'],
      powerDrawTypical: '120 mW',
      powerDrawPeak: '280 mW',
      operatingVoltage: '3.3V Logic (Most pins are 5V tolerant)',
      formFactor: 'Compact Breakout (53 x 21 mm)'
    },
    strengths: [
      'Hardware Floating Point Unit (FPU) and DSP instructions for high-speed mathematical filters (Kalman filters, PID, FFT)',
      'High-speed 12-bit ADC capable of 2.4 million samples per second with DMA',
      'Advanced 16-bit and 32-bit hardware timers with complementary PWM for Field-Oriented Motor Control (FOC)',
      'Many pins are 5V-tolerant (unlike ESP32/Pico)',
      'The defacto standard for drone flight controllers (Betaflight / Cleanflight)'
    ],
    limitations: [
      'Steeper learning curve (STM32CubeIDE, HAL, registers) compared to basic Arduino',
      'No built-in wireless transceiver',
      'Requires ST-Link programmer or DFU bootloader setup'
    ],
    bestFor: [
      'Quadcopter & drone flight controllers with 8 kHz gyro loop rates',
      'High-speed brushless gimbal motor control (FOC / SimpleFOC)',
      'Low-latency digital signal processing (audio DSP, vibration analysis)',
      'Industrial automation and CAN bus machinery'
    ],
    idealDomains: ['robotics', 'industrial'],
    gotchas: [
      'Flashing via USB DFU requires pressing the BOOT0 and RESET buttons in the correct sequence.'
    ],
    starterCode: {
      language: 'cpp',
      title: 'STM32 Hardware Timer Complementary PWM & Gyro Loop',
      filename: 'stm32_foc_controller.cpp',
      code: `// STM32 Real-Time Flight / FOC Motor Loop
#include <Arduino.h>

HardwareTimer *timerPWM;
const int MOTOR_A_PIN = PA8;
const int MOTOR_B_PIN = PA9;

void setup() {
  Serial.begin(115200);
  
  // Configure high-speed 25 kHz complementary PWM with dead-time for motor driver
  timerPWM = new HardwareTimer(TIM1);
  timerPWM->setPWM(1, MOTOR_A_PIN, 25000, 50); // 25 kHz, 50% duty
  timerPWM->setPWM(2, MOTOR_B_PIN, 25000, 50);

  Serial.println("[STM32F4] 25kHz Motor PWM Active with Hardware FPU");
}

void loop() {
  // Float math executes in a single cycle on Cortex-M4 FPU
  float roll = sin(millis() / 500.0) * 45.0f;
  float motorCorrection = roll * 1.85f;

  int newDuty = constrain(50 + (int)motorCorrection, 10, 90);
  timerPWM->setCaptureCompare(1, newDuty, PERCENT_COMPARE_FORMAT);

  delayMicroseconds(500); // 2 kHz control cycle
}`
    }
  },

  raspberry_pi_5: {
    id: 'raspberry_pi_5',
    name: 'Raspberry Pi 5 (4GB / 8GB / 16GB)',
    manufacturer: 'Raspberry Pi Ltd',
    tagline: 'Flagship Linux Single Board Computer with PCIe 2.0 and dual 4K display',
    category: 'sbc',
    badgeColor: 'red',
    approxUsd: 70,
    priceRange: '$60 - $95',
    specs: {
      cpu: 'Broadcom BCM2712 Quad-Core Arm Cortex-A76 @ 2.4 GHz',
      architecture: '64-bit ARMv8-A',
      clockSpeed: '2.4 GHz',
      ram: '4 GB / 8 GB / 16 GB LPDDR4X',
      storage: 'MicroSD slot / High-Speed PCIe 2.0 NVMe SSD',
      gpu: 'VideoCore VII @ 800 MHz (OpenGL ES 3.1, Vulkan 1.2)',
      aiTops: 'Compatible with Raspberry Pi AI Kit (Hailo-8L 13 TOPS)',
      operatingSystem: 'Raspberry Pi OS (Debian 12 64-bit Linux) / Ubuntu 24.04',
      gpioCount: 40,
      adcChannels: 0,
      pwmPins: 4,
      interfaces: ['PCIe 2.0 x1', '2x 4-lane MIPI CSI/DSI (Camera/Display)', '2x USB 3.0', '2x USB 2.0', 'Dual 4Kp60 HDMI', 'Gigabit Ethernet', 'RTC'],
      wireless: ['Dual-band 802.11ac WiFi', 'Bluetooth 5.0 / BLE'],
      powerDrawTypical: '4.5 W - 7 W (idle to moderate)',
      powerDrawPeak: '12 W - 15 W (Heavy workload)',
      operatingVoltage: '5V DC via USB-C (5V / 5A PD Recommended)',
      formFactor: 'SBC Credit Card Size (85 x 56 mm)'
    },
    strengths: [
      '2.5x to 3x CPU performance jump over Raspberry Pi 4; easily runs standard desktop applications',
      'PCIe 2.0 interface allows ultra-fast NVMe SSD boot (500+ MB/s) and Hailo AI accelerator hats',
      'Dual 4-lane MIPI camera transceivers support two simultaneous high-res Sony cameras',
      'Full Linux operating system with complete Python, Docker, ROS 2, and OpenCV ecosystem',
      'RP1 I/O Southbridge chip manages 40-pin GPIO with dedicated hardware UARTs and SPI'
    ],
    limitations: [
      'Requires substantial power (5V 5A power supply); will throttle on weak phone chargers',
      'Active cooling (fan/heatsink) strongly required under sustained workloads',
      'Linux is a multi-tasking OS with non-deterministic scheduling jitter (not suitable for microsecond motor pulses alone)',
      'No native analog inputs (ADC) on the 40-pin header'
    ],
    bestFor: [
      'Robotics high-level brains (ROS 2 navigation, LiDAR mapping, path planning)',
      'OpenCV computer vision pipelines (color tracking, face detection at 30-60 fps)',
      'Smart home servers (Home Assistant OS, Plex, Nextcloud, Docker containers)',
      'Touchscreen interactive kiosks, digital signage, and retro arcade emulation'
    ],
    idealDomains: ['robotics', 'vision_ai', 'audio_display', 'iot_smarthome'],
    gotchas: [
      'Use a companion microcontroller (Arduino or Pico) for high-precision motor control.',
      'Always use an active cooler or aluminum heatsink case to avoid thermal throttling.'
    ],
    starterCode: {
      language: 'python',
      title: 'Raspberry Pi 5 Camera Pipeline & ROS 2 / Web Server',
      filename: 'pi5_vision_service.py',
      code: `# Raspberry Pi 5 Linux Computer Vision & Telemetry Service
import cv2
import time
from threading import Thread

class VisionWorker:
    def __init__(self, camera_idx=0):
        # Open MIPI or USB camera
        self.cap = cv2.VideoCapture(camera_idx)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.running = True
        self.fps = 0

    def start(self):
        Thread(target=self._process_frames, daemon=True).start()

    def _process_frames(self):
        prev_time = time.time()
        while self.running:
            ret, frame = self.cap.read()
            if not ret:
                time.sleep(0.01)
                continue

            # Real-time computer vision (e.g. edge detection / color tracking)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            edges = cv2.Canny(blurred, 50, 150)

            # Compute FPS
            now = time.time()
            self.fps = 1.0 / (now - prev_time) if (now - prev_time) > 0 else 0
            prev_time = now

if __name__ == "__main__":
    print("[PI 5 SERVICE] Starting Vision Daemon on Linux 64-bit...")
    worker = VisionWorker()
    worker.start()
    
    try:
        while True:
            print(f"[STATUS] Pi 5 Running | FPS: {worker.fps:.1f}")
            time.sleep(2)
    except KeyboardInterrupt:
        worker.running = False`
    }
  },

  raspberry_pi_zero_2_w: {
    id: 'raspberry_pi_zero_2_w',
    name: 'Raspberry Pi Zero 2 W',
    manufacturer: 'Raspberry Pi Ltd',
    tagline: 'Thumb-sized quad-core Linux computer for ultra-compact embedded projects',
    category: 'sbc',
    badgeColor: 'purple',
    approxUsd: 15,
    priceRange: '$15 - $22',
    specs: {
      cpu: 'Broadcom BCM2710A1 Quad-Core Arm Cortex-A53 @ 1.0 GHz',
      architecture: '64-bit ARMv8',
      clockSpeed: '1.0 GHz',
      ram: '512 MB LPDDR2 SDRAM (PoP)',
      storage: 'MicroSD Card',
      gpu: 'VideoCore IV',
      operatingSystem: 'Raspberry Pi OS Lite (Linux) / Buildroot',
      gpioCount: 40,
      adcChannels: 0,
      pwmPins: 2,
      interfaces: ['Mini HDMI', 'Micro USB On-The-Go', 'CSI-2 Camera Connector', '40-pin GPIO unpopulated'],
      wireless: ['2.4 GHz 802.11 b/g/n WiFi', 'Bluetooth 4.2 / BLE'],
      powerDrawTypical: '700 mW (140 mA @ 5V idle)',
      powerDrawPeak: '2.5 W',
      operatingVoltage: '5V DC via Micro USB',
      formFactor: 'Ultra-compact (65 x 30 mm)'
    },
    strengths: [
      'Full quad-core 64-bit Linux in a form factor barely larger than a stick of gum',
      'Extremely light (9 grams) and low power draw compared to Pi 5, making battery operation feasible',
      'Native CSI camera connector enables tiny wearable or drone camera setups',
      'USB OTG can configure the Zero as an Ethernet gadget or mass storage device'
    ],
    limitations: [
      '512 MB RAM limits multitasking and heavy web browsers or complex desktop environments',
      'Requires adapter cables (Mini-HDMI to HDMI, Micro-USB to USB-A)',
      'Heats up during heavy 4-core compilation; passive heatsink recommended'
    ],
    bestFor: [
      'Retro handheld gaming consoles (RetroPie, GPi Case)',
      'Pocket dashcams, body cams, and stealth timelapse cameras',
      'Lightweight smart speakers and music streamers (AirPlay, Spotify Connect)',
      'Drone companion telemetry computer'
    ],
    idealDomains: ['wearable', 'audio_display', 'general'],
    gotchas: [
      '512 MB RAM means you should always run Raspberry Pi OS Lite (headless without desktop) for stability.'
    ],
    starterCode: {
      language: 'python',
      title: 'Pi Zero 2 W Lightweight Web Camera Daemon',
      filename: 'zero_streamer.py',
      code: `# Raspberry Pi Zero 2 W Lightweight Camera Server
# Uses picamzero or standard V4L2 for low memory footprint
from flask import Flask, Response
import cv2

app = Flask(__name__)
camera = cv2.VideoCapture(0)

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        # Resize to 320x240 to keep memory under 512MB RAM
        small = cv2.resize(frame, (320, 240))
        _, buffer = cv2.imencode('.jpg', small, [int(cv2.IMWRITE_JPEG_QUALITY), 65])
        frame_bytes = buffer.tobytes()
        yield (b'--frame\\r\\n'
               b'Content-Type: image/jpeg\\r\\n\\r\\n' + frame_bytes + b'\\r\\n')

@app.route('/video')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    print("[PI ZERO 2 W] Stream server running on port 5000...")
    app.run(host='0.0.0.0', port=5000, threaded=True)`
    }
  },

  jetson_nano: {
    id: 'jetson_nano',
    name: 'NVIDIA Jetson Nano (4GB Developer Kit)',
    manufacturer: 'NVIDIA',
    tagline: 'The gateway to edge AI, TensorRT acceleration, and deep neural networks',
    category: 'edge_ai',
    badgeColor: 'emerald',
    approxUsd: 129,
    priceRange: '$120 - $160 (Used / 3rd-party carrier boards)',
    specs: {
      cpu: 'Quad-Core Arm Cortex-A57 MPCore processor @ 1.43 GHz',
      architecture: '64-bit ARMv8',
      clockSpeed: '1.43 GHz',
      ram: '4 GB 64-bit LPDDR4 (25.6 GB/s bandwidth)',
      storage: 'MicroSD slot / 16GB eMMC on production module',
      gpu: '128-core NVIDIA Maxwell GPU (0.5 TFLOPS FP16)',
      aiTops: '0.47 TFLOPS FP16 / 472 GFLOPS GPU AI Inference',
      operatingSystem: 'Ubuntu 18.04 LTS (JetPack 4.6.1)',
      gpioCount: 40,
      adcChannels: 0,
      pwmPins: 2,
      interfaces: ['Dual MIPI CSI-2 camera ports', '4x USB 3.0', 'HDMI 2.0 & DisplayPort', 'Gigabit Ethernet', 'M.2 Key E for WiFi'],
      wireless: ['Requires M.2 Key E card or USB WiFi dongle'],
      powerDrawTypical: '5 W (5W mode)',
      powerDrawPeak: '10 W - 15 W (10W MAXN mode)',
      operatingVoltage: '5V DC via 2.1mm Barrel Jack (5V / 4A recommended)',
      formFactor: 'Carrier board with heatsink (100 x 80 x 29 mm)'
    },
    strengths: [
      'Dedicated 128-core CUDA Maxwell GPU runs real-time deep neural networks (YOLO, SSD-MobileNet, PoseNet) at 20-30 FPS',
      'Native NVIDIA TensorRT optimization library compiles ONNX and PyTorch models for maximum silicon efficiency',
      'Dual MIPI-CSI camera interfaces for stereo vision and depth estimation without USB latency',
      'Official NVIDIA JetPack SDK includes CUDA, cuDNN, TensorRT, and OpenCV pre-configured',
      'Hardware video encoder (H.264/H.265 4Kp30) for multi-stream AI surveillance'
    ],
    limitations: [
      'Official JetPack software support is frozen at Ubuntu 18.04 (JetPack 4.6); newer Python packages require workarounds or Docker',
      'Power brownouts: Running GPU at full throttle via Micro-USB causes instant system shutdowns; requires 5V 4A DC barrel supply with J48 jumper closed',
      'Heatsink and 40mm PWM cooling fan essential for continuous AI inferencing',
      'High power draw makes long-term battery operation bulky'
    ],
    bestFor: [
      'Autonomous mobile robots (AMR) needing real-time obstacle and person classification',
      'AI smart security cameras with face recognition, license plate recognition (ALPR), and anomaly detection',
      'Autonomous drone precision landing with optical target tracking',
      'Students and researchers learning CUDA, TensorRT, and edge computer vision'
    ],
    idealDomains: ['vision_ai', 'robotics'],
    gotchas: [
      'ALWAYS put a jumper on J48 and use a 5V/4A DC barrel power supply. Powering via Micro-USB will reset the board under GPU load.',
      'Pair with an Arduino or STM32 over UART for motor PID control because Linux cannot handle microsecond pulses reliably.'
    ],
    starterCode: {
      language: 'python',
      title: 'Jetson Nano TensorRT / Jetson-Inference Object Detection',
      filename: 'jetson_yolo_detect.py',
      code: `# NVIDIA Jetson Nano Hardware-Accelerated Object Detection
# Utilizes TensorRT + CUDA onboard the 128-core Maxwell GPU
import jetson_inference
import jetson_utils
import time

def main():
    print("[JETSON NANO] Loading TensorRT SSD-Mobilenet-v2 Engine onto GPU...")
    
    # Load neural network optimized with TensorRT (FP16 mode)
    net = jetson_inference.detectNet("ssd-mobilenet-v2", threshold=0.5)

    # Initialize MIPI CSI camera or USB camera
    camera = jetson_utils.videoSource("csi://0")      # or "/dev/video0" for USB
    display = jetson_utils.videoOutput("display://0") # HDMI display output

    print("[JETSON NANO] Inference loop active. Press Ctrl+C to stop.")

    while display.IsStreaming():
        # Capture frame into GPU memory (zero-copy)
        img = camera.Capture()
        if img is None:
            continue

        # Run CUDA inference
        detections = net.Detect(img)

        # Print detected objects (Person, Dog, Car, etc.)
        for d in detections:
            print(f"Detected: {net.GetClassDesc(d.ClassID)} (Confidence: {d.Confidence*100:.1f}%) at [{d.Left:.0f},{d.Top:.0f}]")

        # Render bounding boxes to display
        display.Render(img)
        display.SetStatus(f"Jetson GPU | {net.GetNetworkFPS():.1f} FPS")

if __name__ == "__main__":
    main()`
    }
  },

  jetson_orin_nano: {
    id: 'jetson_orin_nano',
    name: 'NVIDIA Jetson Orin Nano (8GB)',
    manufacturer: 'NVIDIA',
    tagline: 'Modern 40 TOPS AI powerhouse for next-generation autonomous robotics',
    category: 'edge_ai',
    badgeColor: 'emerald',
    approxUsd: 299,
    priceRange: '$249 - $349',
    specs: {
      cpu: '6-core Arm Cortex-A78AE v8.2 64-bit CPU @ 1.5 GHz',
      architecture: '64-bit ARMv8.2',
      clockSpeed: '1.5 GHz',
      ram: '8 GB 128-bit LPDDR5 (68 GB/s bandwidth)',
      storage: 'M.2 Key M NVMe 2280 SSD slot',
      gpu: '1024-core NVIDIA Ampere architecture GPU with 32 Tensor Cores',
      aiTops: 'Up to 40 TOPS INT8 / 20 TFLOPS FP16',
      operatingSystem: 'Ubuntu 22.04 LTS (JetPack 5.x / 6.x)',
      gpioCount: 40,
      adcChannels: 0,
      pwmPins: 2,
      interfaces: ['M.2 Key M (NVMe PCIe Gen4)', 'M.2 Key E (WiFi/BT)', '2x 4-lane MIPI CSI-2', '4x USB 3.2 Gen2 (10Gbps)', 'DisplayPort 1.2'],
      wireless: ['M.2 Key E slot for Intel AX210 WiFi 6E / BT 5.3'],
      powerDrawTypical: '7 W (7W mode)',
      powerDrawPeak: '15 W (15W MAXN mode)',
      operatingVoltage: '9V - 20V DC (19V / 2.37A Barrel Jack)',
      formFactor: 'Carrier board with active cooling fan (100 x 79 x 34 mm)'
    },
    strengths: [
      'Up to 80x the AI performance of the original Jetson Nano (40 TOPS vs 0.47 TFLOPS)',
      'Modern Ampere architecture with 32 hardware Tensor Cores for Vision Transformers & YOLOv8/v10/v11 at 60+ FPS',
      'Supported by latest JetPack 6 on modern Ubuntu 22.04 LTS with ROS 2 Humble/Iron',
      'Fast NVMe M.2 PCIe Gen4 storage eliminates slow SD card bottlenecks',
      'High memory bandwidth (68 GB/s) handles multiple high-resolution camera streams concurrently'
    ],
    limitations: [
      'Higher price point ($299+)',
      'Requires separate M.2 NVMe SSD (no onboard eMMC or SD slot on dev kit)',
      'Requires wide-voltage power brick (9V - 20V)'
    ],
    bestFor: [
      'Commercial autonomous mobile robots (AMRs), delivery rovers, and quadruped robot dogs',
      'Industrial AI quality inspection running multi-class defect classification',
      'Stereo depth camera SLAM and 3D point cloud processing in ROS 2',
      'Real-time edge speech transcription, LLM reasoning (TinyLlama), and vision models'
    ],
    idealDomains: ['vision_ai', 'robotics', 'industrial'],
    gotchas: [
      'Does not have built-in storage; you must install an M.2 2280 NVMe SSD before booting.'
    ],
    starterCode: {
      language: 'python',
      title: 'Orin Nano Ultralytics YOLOv8 TensorRT Pipeline',
      filename: 'orin_yolov8_trt.py',
      code: `# Jetson Orin Nano High-Throughput YOLOv8 TensorRT Pipeline
from ultralytics import YOLO
import cv2

# Export and load engine on Ampere GPU (up to 40 TOPS)
model = YOLO('yolov8n.engine') # Pre-compiled TensorRT engine
cap = cv2.VideoCapture(0)

print("[ORIN NANO] TensorRT Engine Loaded. Processing camera feed...")

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    # TensorRT inference with 32 Tensor Cores
    results = model.predict(source=frame, conf=0.45, verbose=False)
    annotated_frame = results[0].plot()

    cv2.imshow("Jetson Orin Nano AI Stream", annotated_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()`
    }
  },

  beaglebone_black: {
    id: 'beaglebone_black',
    name: 'BeagleBone Black Rev C',
    manufacturer: 'BeagleBoard.org',
    tagline: 'Industrial Linux computer with twin 200 MHz Programmable Real-time Units (PRU)',
    category: 'industrial',
    badgeColor: 'blue',
    approxUsd: 65,
    priceRange: '$60 - $75',
    specs: {
      cpu: 'TI Sitara AM3358 ARM Cortex-A8 @ 1 GHz + 2x 200 MHz 32-bit PRUs',
      architecture: '32-bit ARMv7-A',
      clockSpeed: '1 GHz',
      ram: '512 MB DDR3L',
      storage: '4 GB onboard eMMC 8-bit storage + MicroSD slot',
      operatingSystem: 'Debian Linux / Linux with PREEMPT_RT kernel patch',
      gpioCount: 65,
      adcChannels: 7,
      pwmPins: 8,
      interfaces: ['2x PRU Co-processors (200MHz deterministic)', '4x UART', '2x CAN bus', '2x SPI', '2x I2C', 'Micro HDMI'],
      wireless: ['None (Wireless version available)'],
      powerDrawTypical: '2 W',
      powerDrawPeak: '4.5 W',
      operatingVoltage: '5V DC via Barrel Jack / Mini USB',
      formFactor: 'Cape header board (86.4 x 54.6 mm)'
    },
    strengths: [
      'Dual 200 MHz PRUs (Programmable Real-Time Units) allow 5-nanosecond deterministic GPIO toggling while running standard Linux',
      'Native dual CAN bus controllers for industrial automotive and factory automation',
      '65 digital GPIO pins and 7 high-resolution analog ADC channels on dual 46-pin headers',
      'Onboard 4GB eMMC storage means it boots out-of-the-box without microSD corruption'
    ],
    limitations: [
      'Older single-core 1 GHz processor is slow for modern graphical desktop or heavy computer vision',
      'Programming the PRU assembly/C requires specialized toolchains and TI documentation',
      'Only 512 MB RAM'
    ],
    bestFor: [
      'Industrial automation, CNC step-direction pulse generation, 3D printer controllers (BeagleG)',
      'CAN bus automotive vehicle diagnostic data loggers',
      'Projects needing Linux networking + guaranteed sub-microsecond timing without separate MCU'
    ],
    idealDomains: ['industrial', 'robotics'],
    gotchas: [
      'ADC inputs are strictly 1.8V max! Applying 3.3V or 5V to analog pins will permanently destroy the AM3358 chip.'
    ],
    starterCode: {
      language: 'cpp',
      title: 'BeagleBone PRU Real-Time 5ns Pulse Engine',
      filename: 'pru_firmware.c',
      code: `// BeagleBone Black PRU0 Real-Time Assembly/C Engine
// Runs at 200 MHz independent of Linux OS jitter
#include <stdint.h>
#include <pru_cfg.h>

volatile register uint32_t __R30; // PRU GPIO output register
volatile register uint32_t __R31; // PRU GPIO input register

void main(void) {
  /* Clear SYSCFG[STANDBY_INIT] to enable OCP master port */
  CT_CFG.SYSCFG_bit.STANDBY_INIT = 0;

  while (1) {
    __R30 |= (1 << 5);  // Set GPIO high (5 nanosecond transition)
    __delay_cycles(200); // 1 microsecond delay @ 200 MHz
    __R30 &= ~(1 << 5); // Set GPIO low
    __delay_cycles(200);
  }
}`
    }
  }
};

export const PROJECT_PRESETS: ProjectPreset[] = [
  {
    id: 'autonomous_rover',
    title: 'Autonomous AI Rover with Obstacle Avoidance',
    description: 'Robotic vehicle that navigates indoors, detects obstacles using LiDAR, recognizes human targets with a camera, and drives 4 DC motors with encoders.',
    category: 'Robotics & Vision',
    icon: 'Bot',
    tags: ['Computer Vision', 'Deep Learning', 'Real-Time Motors', 'LiDAR', 'Battery'],
    suggestedText: 'I am building an autonomous mobile rover with computer vision to detect humans and track objects using a camera, plus LiDAR for 2D mapping and obstacle avoidance. It needs to drive 4 gear motors with wheel encoders in real-time, communicate over WiFi, and run on a 3S LiPo battery.'
  },
  {
    id: 'solar_weather',
    title: 'Solar-Powered Smart Agriculture Weather Station',
    description: 'Outdoor agricultural sensor node collecting soil moisture, UV index, humidity, and rainfall, transmitting data every 15 minutes via wireless.',
    category: 'IoT & Environmental',
    icon: 'Sun',
    tags: ['Ultra Low Power', 'Solar / Battery', 'WiFi / LoRa', 'Analog Sensors'],
    suggestedText: 'A remote smart farming weather station powered by a small solar panel and 18650 battery. It reads 4 analog soil moisture sensors, temperature, humidity, and barometric pressure, wakes up every 15 minutes to transmit data over WiFi or LoRa, and enters ultra-low power sleep.'
  },
  {
    id: 'retro_handheld',
    title: 'Portable Retro Handheld Gaming Console',
    description: 'Pocket-sized console playing Game Boy and NES emulators with a 3.5-inch color LCD screen, stereo audio, and physical D-pad buttons.',
    category: 'Gaming & Media',
    icon: 'Gamepad2',
    tags: ['Compact Linux', 'Display Output', 'Audio', 'LiPo Battery', 'Buttons'],
    suggestedText: 'A pocket-sized retro handheld gaming console that runs retro game emulators (Game Boy, NES, SNES) on a 3.5-inch IPS display with sound output, rechargeable battery, and physical D-pad and action buttons in a 3D printed case.'
  },
  {
    id: 'smart_doorbell',
    title: 'AI Smart Doorbell with Face Recognition',
    description: 'Front door video camera that streams 1080p video, detects when visitors arrive, recognizes family members, and rings a wireless chime.',
    category: 'Edge AI & Security',
    icon: 'Camera',
    tags: ['Camera / Video', 'Face Recognition', 'WiFi', 'Mains Power'],
    suggestedText: 'An AI-powered smart video doorbell with high-definition camera streaming, real-time facial recognition to notify me when family members arrive versus strangers, two-way audio intercom, and Home Assistant integration over WiFi.'
  },
  {
    id: 'quadcopter_drone',
    title: 'High-Speed Racing Drone Flight Controller',
    description: 'Acrobatic quadcopter flight controller reading IMU accelerometer/gyroscope at 8 kHz and outputting DShot motor signals with zero lag.',
    category: 'Aerospace & Real-Time',
    icon: 'Plane',
    tags: ['Hard Real-Time', 'Hardware FPU', '8kHz Loop', 'PWM Motors'],
    suggestedText: 'A high-performance quadcopter flight controller that reads 6-axis MPU6000 gyroscope data at 8 kHz, calculates PID stabilization with hardware floating-point math, and outputs high-speed DShot600 signals to 4 brushless electronic speed controllers (ESCs).'
  },
  {
    id: 'home_energy_meter',
    title: 'Smart Home Energy Monitor & Relay Automation',
    description: 'DIN-rail mounted home automation box measuring AC voltage and current with CT clamps, switching heavy relays, and reporting to Home Assistant.',
    category: 'Home Automation',
    icon: 'Zap',
    tags: ['WiFi / BLE', 'Relays', 'AC Sensors', 'Low Power', '5V/3.3V'],
    suggestedText: 'A smart electrical breaker panel monitor with current transformer (CT) clamps to measure total household power consumption in real-time, control two 30A relays, and connect to Home Assistant via MQTT over WiFi.'
  },
  {
    id: 'factory_defect_inspection',
    title: 'Industrial Conveyor Defect Inspection AI',
    description: 'High-speed camera vision system mounted above an industrial assembly line running deep neural network inference to spot manufacturing defects at 40 FPS.',
    category: 'Industrial AI',
    icon: 'Factory',
    tags: ['Deep Learning', 'High FPS', 'TensorRT', 'Industrial', 'Reliability'],
    suggestedText: 'An industrial manufacturing defect detection system running high-speed computer vision at 40+ FPS on a conveyor belt. It must run custom trained YOLO deep learning models, log images to NVMe SSD, and trigger an air ejector cylinder when a defect is spotted.'
  },
  {
    id: 'wearable_health',
    title: 'Wearable Fitness Tracker & Heart Rate Band',
    description: 'Wristband device measuring heart rate (PPG) and step count (IMU), displaying stats on a tiny OLED, syncing to smartphone via Bluetooth LE.',
    category: 'Wearables',
    icon: 'HeartPulse',
    tags: ['BLE', 'Tiny Battery', 'OLED Display', 'Compact', 'Step Counter'],
    suggestedText: 'A lightweight wearable fitness wristband that tracks steps using an accelerometer, monitors heart rate with an optical pulse sensor, displays stats on a small 0.96-inch OLED screen, and syncs via Bluetooth Low Energy to a phone app on a tiny LiPo battery.'
  }
];
