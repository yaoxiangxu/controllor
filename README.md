# ControllerAdvisor — Embedded & Edge AI Hardware Architecture Recommender

> An intelligent recommendation engine that analyzes your hardware project idea in natural language and recommends the optimal controller: **Arduino, Raspberry Pi, NVIDIA Jetson Nano/Orin, ESP32, STM32, or a Hybrid Dual-Board setup**.

---

## 🚀 Key Features

1. **Natural Language Hardware Sizing Engine:**
   - Evaluates project ideas against 6 critical embedded engineering criteria:
     * **AI & Compute Tier:** Microcontroller vs Linux SBC vs Edge GPU (TensorRT / CUDA / YOLO)
     * **Real-Time Strictness:** Non-critical vs Soft Real-Time (motor PWM) vs Hard Real-Time (8kHz drone PID loops)
     * **Power & Battery Budget:** Mains wall power vs Rechargeable LiPo vs Solar deep sleep (<20µA)
     * **Connectivity:** Offline standalone vs Bluetooth Low Energy (BLE) vs WiFi / MQTT vs LoRa
     * **I/O & Peripheral Demands:** MIPI-CSI cameras, quadrature encoders, 14-bit ADC, CAN bus
     * **Budget Sensitivity:** Sub-$10 ultra-cheap vs balanced vs high-performance AI

2. **🤖 Hybrid Dual-Controller Architecture Recommendation:**
   - Detects when a project needs **both** high-level vision/intelligence (Linux SBC or Jetson) and hard real-time motor control (Arduino or STM32).
   - Explains why separating Linux OS scheduling jitter from microsecond motor PWM is critical for safety and precision.
   - Provides interconnect blueprints (UART / USB Serial CDC at 115200 or 921600 Baud).

3. **Complete Engineering Blueprint:**
   - Pin-by-pin sensor & motor wiring table (GPIO, I2C, SPI, UART, PWM, ADC).
   - Estimated Bill of Materials (BOM) with realistic pricing.
   - Production-ready starter code in **C++ (Arduino / ESP-IDF)**, **Python (OpenCV / TensorRT / Linux)**, or **MicroPython (Pico)**.
   - Critical hardware pitfalls & safety warnings (e.g. 3.3V vs 5V logic voltage limits, Jetson J48 barrel jack requirements, flyback diodes).

4. **Interactive Hardware Comparison Matrix:**
   - Compare all 10 boards side-by-side across CPU, RAM, GPU/AI TOPS, power draw, and price.

5. **Pinout & Anatomy Visualizer:**
   - Interactive pin inspectors for Arduino Uno R4, ESP32-S3, Raspberry Pi 5, Jetson Nano, and Pico 2.

6. **5-Step Guided Questionnaire (Wizard Mode):**
   - Step-by-step interactive questionnaire for users who don't know how to describe their project.

7. **Dual-Mode: Web UI & Standalone Terminal CLI:**
   - Use the rich, interactive Web UI in your browser or run instant recommendations from the command line with `node cli.js`.

---

## 🛠️ Supported Controllers

| Controller | Architecture | Clock / Cores | Best For | Typical Price |
| :--- | :--- | :--- | :--- | :--- |
| **Arduino Uno R4** | Renesas RA4M1 32-bit ARM Cortex-M4 | 48 MHz (1 Core) | Beginner electronics, 5V sensors/relays, educational robotics | ~$22 |
| **Arduino Mega 2560** | ATmega2560 8-bit AVR | 16 MHz (1 Core) | 3D printers, multi-axis CNCs, 54 digital I/O pins | ~$40 |
| **ESP32-S3** | Xtensa LX7 32-bit with Vector AI | 240 MHz (2 Cores) | Smart home (WiFi/BLE), MQTT, deep sleep solar nodes (<15µA) | ~$5 |
| **Raspberry Pi Pico 2** | RP2350 Dual Cortex-M33 / RISC-V | 150 MHz (2 Cores) | Dual-core motor control, 12 PIO state machines, MicroPython | ~$5 |
| **STM32F401 BlackPill** | ARM Cortex-M4F with Hardware FPU | 84-100 MHz (1 Core) | Drone flight controllers (Betaflight), motor FOC, 8kHz gyro loops | ~$6 |
| **Raspberry Pi 5** | Quad-Core Cortex-A76 | 2.4 GHz (4 Cores) | Linux desktop, ROS 2 robotics brain, OpenCV vision (30-60 FPS) | ~$70 |
| **Raspberry Pi Zero 2 W** | Quad-Core Cortex-A53 | 1.0 GHz (4 Cores) | Ultra-compact Linux gadgets, retro handhelds, pocket dashcams | ~$15 |
| **NVIDIA Jetson Nano** | 128-core Maxwell GPU + Cortex-A57 | 1.43 GHz (4 Cores) | Real-time YOLO object detection (20-30 FPS), TensorRT inference | ~$129 |
| **NVIDIA Jetson Orin Nano** | 1024-core Ampere GPU + 32 Tensor Cores | 1.5 GHz (6 Cores) | Up to 40 TOPS AI, vision transformers, commercial mobile robots | ~$299 |
| **BeagleBone Black** | TI AM3358 Cortex-A8 + Dual 200MHz PRUs | 1.0 GHz (1 Core) | Industrial automation, deterministic 5ns real-time PRUs + Linux | ~$65 |

---

## 💻 How to Run

### 1. Interactive Web Application
```bash
# Start the local development server
npm run dev

# Open your browser at:
http://localhost:3000
```

### 2. Command-Line Interface (CLI)
You can run the recommendation engine directly in your terminal:

```bash
# Example 1: Autonomous Rover
node cli.js "autonomous rover with object detection and obstacle avoidance"

# Example 2: Solar Weather Station
node cli.js "solar powered soil moisture sensor transmitting over wifi every 15 minutes"

# Example 3: Interactive Prompt
node cli.js
```
Or via npm:
```bash
npm run cli -- "drone flight controller reading gyro at 8khz"
```

---

## 🔑 Optional Gemini AI Review
ControllerAdvisor runs **100% offline** with built-in embedded engineering rules. If you wish to receive additional conversational design reviews from Gemini AI:
1. Click the **Key icon** in the top navigation bar.
2. Enter your `GEMINI_API_KEY` (or set it in your environment).
3. Click **"Run Deep AI Review"** inside any project analysis.
