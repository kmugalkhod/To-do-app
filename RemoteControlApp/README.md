# Remote Control App

A cross-platform Expo/React Native app that turns your smartphone into a universal remote control for smart TVs (including Toshiba) connected to the same WiFi network.

## Features

- 📺 **Universal TV Control** - Power, volume, channels, navigation
- 🔍 **Auto Device Discovery** - Finds smart TVs on your network
- 📱 **Cross-Platform** - Works on both iOS and Android
- 🎯 **Multiple Device Profiles** - Save and switch between different TVs
- 📳 **Haptic Feedback** - Feel button presses
- 🎬 **Media Controls** - Play, pause, rewind, fast forward

## Supported Devices

- **Toshiba Smart TVs** (Primary support)
- Samsung Smart TVs (2016+)
- LG WebOS TVs
- Roku devices
- Android TV
- Sony Bravia

## Quick Start (Test on Your Phone)

### 1. Install Expo Go on your phone
- **iPhone**: Download "Expo Go" from App Store
- **Android**: Download "Expo Go" from Play Store

### 2. Run the app (requires a computer)
```bash
cd RemoteControlApp
npm install
npx expo start
```

### 3. Scan the QR code
- Open Expo Go on your phone
- Scan the QR code shown in terminal
- The app will load on your phone!

## Project Structure

```
RemoteControlApp/
├── App.tsx                    # Root component with navigation
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Device list
│   │   ├── RemoteScreen.tsx   # TV remote interface
│   │   ├── DeviceDiscoveryScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── DeviceDetailsScreen.tsx
│   ├── services/
│   │   ├── TVRemoteService.ts        # WiFi commands
│   │   └── DeviceDiscoveryService.ts # Find TVs
│   └── context/
│       └── DeviceContext.tsx  # State management
├── assets/                    # App icons
├── app.json                   # Expo config
└── package.json
```

## How to Use

1. **Open the app** on your phone
2. **Add your TV**: Tap "Scan for Devices" or "Add Manually"
3. **Enter TV's IP address** (find it in your TV's network settings)
4. **Control your TV** using the remote interface

## Finding Your Toshiba TV's IP Address

1. On your TV, go to **Settings**
2. Navigate to **Network** or **Network & Internet**
3. Select **Network Status** or **Connection Status**
4. Look for **IP Address** (e.g., 192.168.1.105)

## Network Requirements

- Phone and TV must be on the **same WiFi network**
- TV must have **network remote control enabled**
- For Toshiba: Check Settings > Network > Remote Control

## Tech Stack

- **Expo** - Easy development and testing
- **React Native** - Cross-platform mobile
- **React Navigation** - Screen navigation
- **AsyncStorage** - Save device profiles
- **Expo Haptics** - Button feedback

## Building for Production

```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Or use EAS Build
npx eas build
```

## Troubleshooting

**App can't find TV?**
- Ensure both devices are on the same WiFi
- Check TV's network remote settings are enabled
- Try adding the TV manually with its IP address

**Commands not working?**
- Verify the TV is on and responsive
- Check IP address is correct
- Some TVs need to be "awoken" first - try power button

**Connection drops?**
- Move closer to WiFi router
- Restart TV and try again
