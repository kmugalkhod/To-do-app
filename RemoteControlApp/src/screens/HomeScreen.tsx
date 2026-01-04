import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDeviceContext, Device } from '../context/DeviceContext';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { state, dispatch } = useDeviceContext();

  const handleDevicePress = (device: Device) => {
    dispatch({ type: 'SET_ACTIVE_DEVICE', payload: device });
    navigation.navigate('Remote');
  };

  const handleDeviceLongPress = (device: Device) => {
    Alert.alert(
      device.name,
      'What would you like to do?',
      [
        {
          text: 'View Details',
          onPress: () => navigation.navigate('DeviceDetails', { device }),
        },
        {
          text: 'Remove Device',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Remove Device',
              `Are you sure you want to remove ${device.name}?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Remove',
                  style: 'destructive',
                  onPress: () => dispatch({ type: 'REMOVE_DEVICE', payload: device.id }),
                },
              ]
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={[
        styles.deviceCard,
        state.activeDevice?.id === item.id && styles.activeDeviceCard,
      ]}
      onPress={() => handleDevicePress(item)}
      onLongPress={() => handleDeviceLongPress(item)}
    >
      <View style={styles.deviceIcon}>
        <Text style={styles.deviceIconText}>📺</Text>
      </View>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceType}>
          {item.type.replace('_', ' ').toUpperCase()} • {item.ip}
        </Text>
        {item.isPaired && <Text style={styles.pairedBadge}>Paired</Text>}
      </View>
      {state.activeDevice?.id === item.id && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>Active</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {state.devices.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📡</Text>
          <Text style={styles.emptyTitle}>No Devices Found</Text>
          <Text style={styles.emptyText}>
            Tap the button below to scan for smart TVs on your WiFi network
          </Text>
        </View>
      ) : (
        <FlatList
          data={state.devices}
          keyExtractor={(item) => item.id}
          renderItem={renderDevice}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('DeviceDiscovery')}
      >
        <Text style={styles.scanButtonText}>
          {state.devices.length === 0 ? 'Scan for Devices' : '+ Add Device'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  list: {
    padding: 16,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeDeviceCard: {
    borderColor: '#007AFF',
  },
  deviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceIconText: {
    fontSize: 24,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  deviceType: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 4,
  },
  pairedBadge: {
    color: '#30D158',
    fontSize: 12,
    marginTop: 4,
  },
  activeBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
