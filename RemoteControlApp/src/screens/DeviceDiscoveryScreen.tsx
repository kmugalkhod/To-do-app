import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDeviceContext, Device } from '../context/DeviceContext';
import DeviceDiscoveryService from '../services/DeviceDiscoveryService';

export default function DeviceDiscoveryScreen() {
  const navigation = useNavigation<any>();
  const { state, dispatch } = useDeviceContext();
  const [foundDevices, setFoundDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualIP, setManualIP] = useState('');

  useEffect(() => {
    startScan();
  }, []);

  const startScan = async () => {
    setIsScanning(true);
    setFoundDevices([]);

    try {
      await DeviceDiscoveryService.scanForDevices(
        // On device found
        (device) => {
          setFoundDevices((prev) => {
            if (prev.find((d) => d.id === device.id)) return prev;
            return [...prev, device];
          });
        },
        // On complete
        (devices) => {
          setIsScanning(false);
        }
      );
    } catch (error) {
      console.error('Scan error:', error);
      setIsScanning(false);
      Alert.alert('Error', 'Failed to scan for devices. Please check your WiFi connection.');
    }
  };

  const addDevice = (device: Device) => {
    // Check if already added
    if (state.devices.find((d) => d.id === device.id)) {
      Alert.alert('Already Added', 'This device is already in your list.');
      return;
    }

    const deviceWithPaired = { ...device, isPaired: true };
    dispatch({ type: 'ADD_DEVICE', payload: deviceWithPaired });
    dispatch({ type: 'SET_ACTIVE_DEVICE', payload: deviceWithPaired });

    Alert.alert(
      'Device Added',
      `${device.name} has been added and set as active.`,
      [
        {
          text: 'Go to Remote',
          onPress: () => navigation.navigate('Main', { screen: 'Remote' }),
        },
        { text: 'Add More', style: 'cancel' },
      ]
    );
  };

  const handleAddManualDevice = () => {
    const ip = manualIP.trim();
    if (ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
      const manualDevice: Device = {
        id: `manual-${ip}`,
        name: 'Toshiba TV',
        type: 'toshiba',
        ip: ip,
        port: 55000,
        isPaired: true,
      };
      dispatch({ type: 'ADD_DEVICE', payload: manualDevice });
      dispatch({ type: 'SET_ACTIVE_DEVICE', payload: manualDevice });
      setShowManualModal(false);
      setManualIP('');
      navigation.navigate('Main', { screen: 'Remote' });
    } else {
      Alert.alert('Invalid IP', 'Please enter a valid IP address (e.g., 192.168.1.100)');
    }
  };

  const renderDevice = ({ item }: { item: Device }) => {
    const isAdded = state.devices.find((d) => d.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.deviceCard, isAdded && styles.deviceCardAdded]}
        onPress={() => !isAdded && addDevice(item)}
        disabled={!!isAdded}
      >
        <View style={styles.deviceIcon}>
          <Text style={styles.deviceIconText}>📺</Text>
        </View>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.deviceDetails}>
            {item.type.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={styles.deviceIp}>{item.ip}</Text>
        </View>
        {isAdded ? (
          <View style={styles.addedBadge}>
            <Text style={styles.addedBadgeText}>Added</Text>
          </View>
        ) : (
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Scanning Status */}
      <View style={styles.statusBar}>
        {isScanning ? (
          <>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.statusText}>Scanning your network...</Text>
          </>
        ) : (
          <Text style={styles.statusText}>
            Found {foundDevices.length} device(s)
          </Text>
        )}
      </View>

      {/* Device List */}
      {foundDevices.length > 0 ? (
        <FlatList
          data={foundDevices}
          keyExtractor={(item) => item.id}
          renderItem={renderDevice}
          contentContainerStyle={styles.list}
        />
      ) : !isScanning ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No Devices Found</Text>
          <Text style={styles.emptyText}>
            Make sure your TV is turned on and connected to the same WiFi network as your phone.
          </Text>
        </View>
      ) : (
        <View style={styles.scanningState}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.scanningText}>
            Looking for smart TVs on your network...
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, isScanning && styles.actionButtonDisabled]}
          onPress={startScan}
          disabled={isScanning}
        >
          <Text style={styles.actionButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Again'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={() => setShowManualModal(true)}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
            Add Manually
          </Text>
        </TouchableOpacity>
      </View>

      {/* Help Text */}
      <Text style={styles.helpText}>
        Tip: Your Toshiba TV must have network control enabled. Check your TV's network settings.
      </Text>

      {/* Manual Add Modal */}
      <Modal
        visible={showManualModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowManualModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Device Manually</Text>
            <Text style={styles.modalSubtitle}>
              Enter the IP address of your Toshiba TV
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="192.168.1.100"
              placeholderTextColor="#8E8E93"
              value={manualIP}
              onChangeText={setManualIP}
              keyboardType="numeric"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowManualModal(false);
                  setManualIP('');
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonAdd]}
                onPress={handleAddManualDevice}
              >
                <Text style={styles.modalButtonAddText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1C1C1E',
    gap: 10,
  },
  statusText: {
    color: '#8E8E93',
    fontSize: 14,
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
  },
  deviceCardAdded: {
    opacity: 0.6,
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
    fontSize: 16,
    fontWeight: '600',
  },
  deviceDetails: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  deviceIp: {
    color: '#636366',
    fontSize: 12,
    marginTop: 2,
  },
  addedBadge: {
    backgroundColor: '#30D158',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  scanningState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 20,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#3A3A3C',
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: '#007AFF',
  },
  helpText: {
    color: '#636366',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#3A3A3C',
  },
  modalButtonCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonAdd: {
    backgroundColor: '#007AFF',
  },
  modalButtonAddText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
