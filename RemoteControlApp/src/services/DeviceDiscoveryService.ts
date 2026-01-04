/**
 * Device Discovery Service
 * Scans local network for smart TVs
 * Simplified for Expo Go compatibility
 */

import { Device } from '../context/DeviceContext';

class DeviceDiscoveryService {
  private isScanning: boolean = false;
  private discoveredDevices: Map<string, Device> = new Map();

  /**
   * Start scanning for devices on the local network
   */
  async scanForDevices(
    onDeviceFound?: (device: Device) => void,
    onComplete?: (devices: Device[]) => void
  ): Promise<Device[]> {
    if (this.isScanning) {
      console.log('Scan already in progress');
      return [];
    }

    this.isScanning = true;
    this.discoveredDevices.clear();

    console.log('Starting device discovery...');

    // Simulate discovery with a demo device
    // In production, you would add your TV manually
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        const demoDevice: Device = {
          id: 'demo-toshiba-001',
          name: 'Demo Toshiba TV',
          type: 'toshiba',
          ip: '192.168.1.100',
          port: 55000,
          isPaired: false,
          model: 'Toshiba Smart TV',
        };

        if (onDeviceFound) {
          onDeviceFound(demoDevice);
        }
        this.discoveredDevices.set(demoDevice.id, demoDevice);
        resolve();
      }, 2000);
    });

    this.isScanning = false;
    const devices = Array.from(this.discoveredDevices.values());

    if (onComplete) {
      onComplete(devices);
    }

    return devices;
  }

  /**
   * Test connection to a specific device
   */
  async testConnection(device: Device): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`http://${device.ip}:${device.port}/`, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok || response.status === 405;
    } catch {
      return false;
    }
  }

  get scanning(): boolean {
    return this.isScanning;
  }

  stopScan(): void {
    this.isScanning = false;
  }
}

const deviceDiscoveryService = new DeviceDiscoveryService();
export default deviceDiscoveryService;
