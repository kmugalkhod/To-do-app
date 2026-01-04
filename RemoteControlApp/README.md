# Remote Control App

A cross-platform React Native app that turns your smartphone into a universal remote control for smart TVs and devices connected to the same WiFi network.

## Features

- 📺 **Universal TV Control** - Power, volume, channels, navigation
- 🔍 **Auto Device Discovery** - Finds smart TVs on your network via SSDP/UPnP
- 📱 **Cross-Platform** - Works on both iOS and Android
- 🎯 **Multiple Device Profiles** - Save and switch between different TVs
- ⌨️ **Keyboard Input** - Type text directly on your TV
- 🎬 **Media Controls** - Play, pause, rewind, fast forward

## Supported Devices

- Samsung Smart TVs (2016+)
- LG WebOS TVs
- Roku devices
- Android TV
- Sony Bravia
- Any DLNA/UPnP compatible device

## Tech Stack

- **Framework**: React Native (iOS & Android)
- **State Management**: React Context + useReducer
- **Navigation**: React Navigation
- **Network**:
  - SSDP for device discovery
  - WebSocket for real-time control
  - REST APIs for device-specific commands
- **Storage**: AsyncStorage for device profiles

## Project Structure

```
RemoteControlApp/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # App screens
│   ├── services/          # Device communication services
│   ├── context/           # State management
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Helper functions
│   └── constants/         # App constants
├── App.tsx                # Root component
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

```bash
cd RemoteControlApp
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## How It Works

1. **Device Discovery**: The app scans your local network using SSDP (Simple Service Discovery Protocol) to find compatible smart TVs
2. **Pairing**: Select your TV from the discovered devices and pair (some TVs require PIN confirmation)
3. **Control**: Use the intuitive remote interface to control your TV

## Network Requirements

- Phone and TV must be on the **same WiFi network**
- Network must allow device-to-device communication (not guest networks)
- Port 1900 (UDP) for SSDP discovery
- Various ports for device-specific protocols
