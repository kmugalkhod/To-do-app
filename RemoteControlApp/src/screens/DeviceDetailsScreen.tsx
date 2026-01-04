import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDeviceContext, Device } from '../context/DeviceContext';
import TVRemoteService from '../services/TVRemoteService';

export default function DeviceDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { state, dispatch } = useDeviceContext();
  const device: Device = route.params?.device;

  const [editName, setEditName] = useState(device?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Device not found</Text>
      </View>
    );
  }

  const handleSaveName = () => {
    if (editName.trim()) {
      const updatedDevice = { ...device, name: editName.trim() };
      dispatch({ type: 'UPDATE_DEVICE', payload: updatedDevice });
      setIsEditing(false);
      Alert.alert('Success', 'Device name updated.');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // Try sending a test command
      const result = await TVRemoteService.sendCommand(device, 'POWER');
      if (result) {
        Alert.alert('Success', 'Connection test successful! Your TV should have received a power command.');
      } else {
        Alert.alert('Failed', 'Could not connect to the TV. Please check the IP address and ensure the TV is on.');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection test failed. Please verify the TV is on and connected to the same network.');
    }
    setIsTesting(false);
  };

  const handleSetActive = () => {
    dispatch({ type: 'SET_ACTIVE_DEVICE', payload: device });
    Alert.alert('Success', `${device.name} is now the active device.`);
    navigation.navigate('Main', { screen: 'Remote' });
  };

  const handleRemoveDevice = () => {
    Alert.alert(
      'Remove Device',
      `Are you sure you want to remove ${device.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'REMOVE_DEVICE', payload: device.id });
            navigation.goBack();
          },
        },
      ]
    );
  };

  const isActive = state.activeDevice?.id === device.id;

  return (
    <ScrollView style={styles.container}>
      {/* Device Icon */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📺</Text>
        </View>
        {isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active Device</Text>
          </View>
        )}
      </View>

      {/* Device Name */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>NAME</Text>
        <View style={styles.card}>
          {isEditing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Device name"
                placeholderTextColor="#8E8E93"
                autoFocus
              />
              <TouchableOpacity onPress={handleSaveName}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.detailRow} onPress={() => setIsEditing(true)}>
              <Text style={styles.detailLabel}>Name</Text>
              <View style={styles.editableValue}>
                <Text style={styles.detailValue}>{device.name}</Text>
                <Text style={styles.editIcon}>✏️</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Connection Details */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>CONNECTION</Text>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>IP Address</Text>
            <Text style={styles.detailValue}>{device.ip}</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Port</Text>
            <Text style={styles.detailValue}>{device.port}</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>
              {device.type.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          {device.model && (
            <>
              <View style={styles.rowDivider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Model</Text>
                <Text style={styles.detailValue}>{device.model}</Text>
              </View>
            </>
          )}
          {device.mac && (
            <>
              <View style={styles.rowDivider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>MAC Address</Text>
                <Text style={styles.detailValue}>{device.mac}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>ACTIONS</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleTestConnection}
            disabled={isTesting}
          >
            <Text style={styles.actionText}>
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Text>
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <TouchableOpacity
            style={[styles.actionRow, isActive && styles.actionRowDisabled]}
            onPress={handleSetActive}
            disabled={isActive}
          >
            <Text style={[styles.actionText, isActive && styles.actionTextDisabled]}>
              {isActive ? 'Currently Active' : 'Set as Active Device'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>DANGER ZONE</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleRemoveDevice}>
            <Text style={styles.destructiveText}>Remove Device</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Help */}
      <View style={styles.helpSection}>
        <Text style={styles.helpText}>
          If you're having connection issues, try the following:
        </Text>
        <Text style={styles.helpText}>
          • Make sure your TV is turned on
        </Text>
        <Text style={styles.helpText}>
          • Verify both devices are on the same WiFi network
        </Text>
        <Text style={styles.helpText}>
          • Check TV network settings for remote control permissions
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
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 50,
  },
  activeBadge: {
    marginTop: 12,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  detailLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  detailValue: {
    color: '#8E8E93',
    fontSize: 16,
  },
  editableValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editIcon: {
    fontSize: 14,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    color: '#8E8E93',
    fontSize: 16,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#38383A',
    marginLeft: 16,
  },
  actionRow: {
    padding: 16,
  },
  actionRowDisabled: {
    opacity: 0.5,
  },
  actionText: {
    color: '#007AFF',
    fontSize: 16,
  },
  actionTextDisabled: {
    color: '#8E8E93',
  },
  destructiveText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  helpSection: {
    padding: 16,
    marginTop: 16,
    marginBottom: 40,
  },
  helpText: {
    color: '#636366',
    fontSize: 13,
    lineHeight: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
});
