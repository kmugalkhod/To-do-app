import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface Device {
  id: string;
  name: string;
  type: 'samsung' | 'lg' | 'roku' | 'android_tv' | 'sony' | 'generic';
  ip: string;
  port: number;
  mac?: string;
  model?: string;
  isPaired: boolean;
  lastConnected?: string;
}

interface DeviceState {
  devices: Device[];
  activeDevice: Device | null;
  isScanning: boolean;
  isConnected: boolean;
  error: string | null;
}

type DeviceAction =
  | { type: 'SET_DEVICES'; payload: Device[] }
  | { type: 'ADD_DEVICE'; payload: Device }
  | { type: 'REMOVE_DEVICE'; payload: string }
  | { type: 'SET_ACTIVE_DEVICE'; payload: Device | null }
  | { type: 'UPDATE_DEVICE'; payload: Device }
  | { type: 'SET_SCANNING'; payload: boolean }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: DeviceState = {
  devices: [],
  activeDevice: null,
  isScanning: false,
  isConnected: false,
  error: null,
};

function deviceReducer(state: DeviceState, action: DeviceAction): DeviceState {
  switch (action.type) {
    case 'SET_DEVICES':
      return { ...state, devices: action.payload };
    case 'ADD_DEVICE':
      const exists = state.devices.find(d => d.id === action.payload.id);
      if (exists) return state;
      return { ...state, devices: [...state.devices, action.payload] };
    case 'REMOVE_DEVICE':
      return {
        ...state,
        devices: state.devices.filter(d => d.id !== action.payload),
        activeDevice:
          state.activeDevice?.id === action.payload ? null : state.activeDevice,
      };
    case 'SET_ACTIVE_DEVICE':
      return { ...state, activeDevice: action.payload };
    case 'UPDATE_DEVICE':
      return {
        ...state,
        devices: state.devices.map(d =>
          d.id === action.payload.id ? action.payload : d
        ),
        activeDevice:
          state.activeDevice?.id === action.payload.id
            ? action.payload
            : state.activeDevice,
      };
    case 'SET_SCANNING':
      return { ...state, isScanning: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface DeviceContextType {
  state: DeviceState;
  dispatch: React.Dispatch<DeviceAction>;
  saveDevices: () => Promise<void>;
  loadDevices: () => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(deviceReducer, initialState);

  const saveDevices = async () => {
    try {
      await AsyncStorage.setItem('saved_devices', JSON.stringify(state.devices));
    } catch (error) {
      console.error('Error saving devices:', error);
    }
  };

  const loadDevices = async () => {
    try {
      const saved = await AsyncStorage.getItem('saved_devices');
      if (saved) {
        const devices = JSON.parse(saved) as Device[];
        dispatch({ type: 'SET_DEVICES', payload: devices });
      }
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    if (state.devices.length > 0) {
      saveDevices();
    }
  }, [state.devices]);

  return (
    <DeviceContext.Provider value={{ state, dispatch, saveDevices, loadDevices }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDeviceContext() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return context;
}
