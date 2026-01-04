import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDeviceContext } from '../context/DeviceContext';

export default function SettingsScreen() {
  const { state, dispatch, loadDevices } = useDeviceContext();
  const [hapticFeedback, setHapticFeedback] = React.useState(true);
  const [keepScreenOn, setKeepScreenOn] = React.useState(true);
  const [showConnectionStatus, setShowConnectionStatus] = React.useState(true);

  const clearAllDevices = () => {
    Alert.alert(
      'Clear All Devices',
      'Are you sure you want to remove all saved devices? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('saved_devices');
              dispatch({ type: 'SET_DEVICES', payload: [] });
              dispatch({ type: 'SET_ACTIVE_DEVICE', payload: null });
              Alert.alert('Success', 'All devices have been removed.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear devices.');
            }
          },
        },
      ]
    );
  };

  const SettingRow = ({
    title,
    subtitle,
    value,
    onValueChange,
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3A3A3C', true: '#30D158' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const ActionRow = ({
    title,
    subtitle,
    onPress,
    destructive,
  }: {
    title: string;
    subtitle?: string;
    onPress: () => void;
    destructive?: boolean;
  }) => (
    <TouchableOpacity style={styles.actionRow} onPress={onPress}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Device Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>DEVICES</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{state.devices.length}</Text>
            <Text style={styles.statLabel}>Saved Devices</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {state.activeDevice ? '1' : '0'}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>
      </View>

      {/* Remote Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>REMOTE SETTINGS</Text>
        <View style={styles.card}>
          <SettingRow
            title="Haptic Feedback"
            subtitle="Vibrate on button press"
            value={hapticFeedback}
            onValueChange={setHapticFeedback}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            title="Keep Screen On"
            subtitle="Prevent screen from sleeping while using remote"
            value={keepScreenOn}
            onValueChange={setKeepScreenOn}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            title="Connection Status"
            subtitle="Show connection indicator on remote screen"
            value={showConnectionStatus}
            onValueChange={setShowConnectionStatus}
          />
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>DATA</Text>
        <View style={styles.card}>
          <ActionRow
            title="Clear All Devices"
            subtitle="Remove all saved devices"
            onPress={clearAllDevices}
            destructive
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Platform</Text>
            <Text style={styles.aboutValue}>React Native</Text>
          </View>
        </View>
      </View>

      {/* Help */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>HELP</Text>
        <View style={styles.card}>
          <ActionRow
            title="Troubleshooting"
            subtitle="Connection issues and tips"
            onPress={() => {
              Alert.alert(
                'Troubleshooting Tips',
                '1. Ensure your TV and phone are on the same WiFi network\n\n' +
                  '2. Check that your TV has network control enabled in settings\n\n' +
                  '3. Some TVs may require you to allow the connection on the TV screen\n\n' +
                  '4. Try restarting your TV if commands are not working\n\n' +
                  '5. For Toshiba TVs, look for "Remote Control" or "Network Control" in the TV settings'
              );
            }}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Remote Control App for Smart TVs
        </Text>
        <Text style={styles.footerSubtext}>
          Works with Toshiba, Samsung, LG, Roku, and more
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#1C1C1E',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statsCard: {
    backgroundColor: '#1C1C1E',
    marginHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#38383A',
    marginVertical: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  settingSubtitle: {
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  destructiveText: {
    color: '#FF3B30',
  },
  chevron: {
    color: '#8E8E93',
    fontSize: 24,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#38383A',
    marginLeft: 16,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  aboutLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  aboutValue: {
    color: '#8E8E93',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    padding: 40,
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  footerSubtext: {
    color: '#636366',
    fontSize: 12,
    marginTop: 4,
  },
});
