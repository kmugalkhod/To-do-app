import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useDeviceContext } from '../context/DeviceContext';
import TVRemoteService from '../services/TVRemoteService';

type RemoteButton = {
  id: string;
  label: string;
  icon?: string;
  command: string;
  style?: 'primary' | 'danger' | 'default';
};

export default function RemoteScreen() {
  const { state } = useDeviceContext();
  const [lastPressed, setLastPressed] = useState<string | null>(null);

  const sendCommand = async (command: string, buttonId: string) => {
    if (!state.activeDevice) {
      Alert.alert('No Device', 'Please select a device from the Devices tab first.');
      return;
    }

    setLastPressed(buttonId);
    try {
      await TVRemoteService.sendCommand(state.activeDevice, command);
    } catch (error) {
      Alert.alert('Error', 'Failed to send command. Please check your connection.');
    }
    setTimeout(() => setLastPressed(null), 150);
  };

  const powerButton: RemoteButton = {
    id: 'power',
    label: 'Power',
    icon: '⏻',
    command: 'POWER',
    style: 'danger',
  };

  const navigationButtons: RemoteButton[][] = [
    [{ id: 'up', label: '▲', command: 'UP' }],
    [
      { id: 'left', label: '◀', command: 'LEFT' },
      { id: 'ok', label: 'OK', command: 'OK', style: 'primary' },
      { id: 'right', label: '▶', command: 'RIGHT' },
    ],
    [{ id: 'down', label: '▼', command: 'DOWN' }],
  ];

  const volumeChannelButtons: RemoteButton[][] = [
    [
      { id: 'vol_up', label: 'VOL+', command: 'VOLUME_UP' },
      { id: 'ch_up', label: 'CH+', command: 'CHANNEL_UP' },
    ],
    [
      { id: 'vol_down', label: 'VOL-', command: 'VOLUME_DOWN' },
      { id: 'ch_down', label: 'CH-', command: 'CHANNEL_DOWN' },
    ],
  ];

  const mediaButtons: RemoteButton[] = [
    { id: 'rewind', label: '⏪', command: 'REWIND' },
    { id: 'play', label: '▶️', command: 'PLAY' },
    { id: 'pause', label: '⏸', command: 'PAUSE' },
    { id: 'forward', label: '⏩', command: 'FAST_FORWARD' },
  ];

  const utilityButtons: RemoteButton[] = [
    { id: 'home', label: '🏠', command: 'HOME' },
    { id: 'back', label: '↩️', command: 'BACK' },
    { id: 'menu', label: '☰', command: 'MENU' },
    { id: 'mute', label: '🔇', command: 'MUTE' },
  ];

  const inputButtons: RemoteButton[] = [
    { id: 'input', label: '📺 Input', command: 'INPUT' },
    { id: 'settings', label: '⚙️ Settings', command: 'SETTINGS' },
  ];

  const renderButton = (button: RemoteButton, size: 'small' | 'medium' | 'large' = 'medium') => {
    const isPressed = lastPressed === button.id;
    return (
      <TouchableOpacity
        key={button.id}
        style={[
          styles.button,
          size === 'small' && styles.buttonSmall,
          size === 'large' && styles.buttonLarge,
          button.style === 'primary' && styles.buttonPrimary,
          button.style === 'danger' && styles.buttonDanger,
          isPressed && styles.buttonPressed,
        ]}
        onPress={() => sendCommand(button.command, button.id)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            size === 'small' && styles.buttonTextSmall,
            size === 'large' && styles.buttonTextLarge,
          ]}
        >
          {button.icon || button.label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!state.activeDevice) {
    return (
      <View style={styles.noDevice}>
        <Text style={styles.noDeviceIcon}>📺</Text>
        <Text style={styles.noDeviceText}>No Device Selected</Text>
        <Text style={styles.noDeviceSubtext}>
          Go to the Devices tab to select a TV to control
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Active Device Indicator */}
      <View style={styles.deviceIndicator}>
        <Text style={styles.deviceIndicatorText}>
          📺 {state.activeDevice.name}
        </Text>
        {state.isConnected && (
          <View style={styles.connectedDot} />
        )}
      </View>

      {/* Power Button */}
      <View style={styles.powerSection}>
        {renderButton(powerButton, 'large')}
      </View>

      {/* Utility Buttons */}
      <View style={styles.utilitySection}>
        {utilityButtons.map((btn) => renderButton(btn, 'small'))}
      </View>

      {/* Navigation Pad */}
      <View style={styles.navigationSection}>
        {navigationButtons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.navRow}>
            {row.map((btn) => renderButton(btn, btn.id === 'ok' ? 'large' : 'medium'))}
          </View>
        ))}
      </View>

      {/* Volume & Channel */}
      <View style={styles.volumeChannelSection}>
        <View style={styles.volumeColumn}>
          <Text style={styles.columnLabel}>Volume</Text>
          {volumeChannelButtons.map((row, idx) => (
            <View key={idx}>{renderButton(row[0])}</View>
          ))}
        </View>
        <View style={styles.channelColumn}>
          <Text style={styles.columnLabel}>Channel</Text>
          {volumeChannelButtons.map((row, idx) => (
            <View key={idx}>{renderButton(row[1])}</View>
          ))}
        </View>
      </View>

      {/* Media Controls */}
      <View style={styles.mediaSection}>
        {mediaButtons.map((btn) => renderButton(btn, 'small'))}
      </View>

      {/* Input & Settings */}
      <View style={styles.inputSection}>
        {inputButtons.map((btn) => renderButton(btn, 'medium'))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  noDevice: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDeviceIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  noDeviceText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  noDeviceSubtext: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
  },
  deviceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  deviceIndicatorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#30D158',
    marginLeft: 8,
  },
  powerSection: {
    marginBottom: 20,
  },
  utilitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  navigationSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeChannelSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  volumeColumn: {
    alignItems: 'center',
  },
  channelColumn: {
    alignItems: 'center',
  },
  columnLabel: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  mediaSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  buttonSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  buttonLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonDanger: {
    backgroundColor: '#FF3B30',
  },
  buttonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonTextLarge: {
    fontSize: 24,
  },
});
