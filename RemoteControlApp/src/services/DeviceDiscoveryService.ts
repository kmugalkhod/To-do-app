/**
 * Device Discovery Service
 * Scans local network for smart TVs using SSDP (Simple Service Discovery Protocol)
 * Supports: Toshiba, Samsung, LG, Roku, Android TV, Sony, and other DLNA devices
 */

import { Device } from '../context/DeviceContext';

// Known TV service types for SSDP discovery
const TV_SERVICE_TYPES = [
  'urn:schemas-upnp-org:device:MediaRenderer:1',
  'urn:schemas-upnp-org:device:Basic:1',
  'urn:dial-multiscreen-org:service:dial:1',
  'urn:panasonic-com:device:p00RemoteController:1', // Toshiba/Panasonic
  'urn:samsung.com:device:RemoteControlReceiver:1',
  'urn:lge-com:service:webos-second-screen:1',
  'roku:ecp',
];

// Brand detection patterns
const BRAND_PATTERNS: { pattern: RegExp; type: Device['type'] }[] = [
  { pattern: /toshiba/i, type: 'toshiba' },
  { pattern: /samsung/i, type: 'samsung' },
  { pattern: /lg|webos/i, type: 'lg' },
  { pattern: /roku/i, type: 'roku' },
  { pattern: /android\s*tv|google\s*tv|chromecast/i, type: 'android_tv' },
  { pattern: /sony|bravia/i, type: 'sony' },
];

// SSDP Constants
const SSDP_ADDRESS = '239.255.255.250';
const SSDP_PORT = 1900;
const DISCOVERY_TIMEOUT = 5000;

interface SSDPResponse {
  location: string;
  server: string;
  usn: string;
  st: string;
  headers: Record<string, string>;
}

class DeviceDiscoveryService {
  private static instance: DeviceDiscoveryService;
  private isScanning: boolean = false;
  private discoveredDevices: Map<string, Device> = new Map();

  static getInstance(): DeviceDiscoveryService {
    if (!DeviceDiscoveryService.instance) {
      DeviceDiscoveryService.instance = new DeviceDiscoveryService();
    }
    return DeviceDiscoveryService.instance;
  }

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

    try {
      // Perform SSDP discovery
      await this.performSSDPDiscovery(onDeviceFound);

      // Also try direct port scanning for known TV ports
      await this.performPortScan(onDeviceFound);

    } catch (error) {
      console.error('Discovery error:', error);
    }

    this.isScanning = false;
    const devices = Array.from(this.discoveredDevices.values());

    if (onComplete) {
      onComplete(devices);
    }

    return devices;
  }

  /**
   * Perform SSDP M-SEARCH discovery
   * Note: In React Native, this requires native modules for UDP
   * This is a simplified implementation showing the protocol
   */
  private async performSSDPDiscovery(
    onDeviceFound?: (device: Device) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      // SSDP M-SEARCH message
      const searchMessage = [
        'M-SEARCH * HTTP/1.1',
        `HOST: ${SSDP_ADDRESS}:${SSDP_PORT}`,
        'MAN: "ssdp:discover"',
        'MX: 3',
        'ST: ssdp:all',
        '',
        '',
      ].join('\r\n');

      console.log('Sending SSDP M-SEARCH...');

      // In a real implementation, this would use react-native-udp
      // For demo purposes, we'll simulate device discovery

      setTimeout(() => {
        // Simulate finding a Toshiba TV (for demo)
        const simulatedDevice: Device = {
          id: 'toshiba-demo-001',
          name: 'Toshiba Smart TV',
          type: 'toshiba',
          ip: '192.168.1.100',
          port: 55000,
          isPaired: false,
          model: 'Toshiba Fire TV',
        };

        if (!this.discoveredDevices.has(simulatedDevice.id)) {
          this.discoveredDevices.set(simulatedDevice.id, simulatedDevice);
          if (onDeviceFound) {
            onDeviceFound(simulatedDevice);
          }
        }

        resolve();
      }, 2000);

      // Real implementation would look like:
      /*
      const dgram = require('react-native-udp');
      const socket = dgram.createSocket('udp4');

      socket.on('message', (msg, rinfo) => {
        const response = this.parseSSDPResponse(msg.toString());
        const device = this.processDiscoveryResponse(response, rinfo.address);
        if (device && !this.discoveredDevices.has(device.id)) {
          this.discoveredDevices.set(device.id, device);
          if (onDeviceFound) onDeviceFound(device);
        }
      });

      socket.bind(() => {
        socket.setBroadcast(true);
        socket.send(searchMessage, 0, searchMessage.length, SSDP_PORT, SSDP_ADDRESS);
      });

      setTimeout(() => {
        socket.close();
        resolve();
      }, DISCOVERY_TIMEOUT);
      */
    });
  }

  /**
   * Perform direct port scanning for known TV ports
   */
  private async performPortScan(
    onDeviceFound?: (device: Device) => void
  ): Promise<void> {
    // Get local network range (simplified - would use react-native-network-info)
    const networkBase = '192.168.1';
    const portsToScan = [
      { port: 55000, type: 'toshiba' as const },
      { port: 8001, type: 'samsung' as const },
      { port: 3000, type: 'lg' as const },
      { port: 8060, type: 'roku' as const },
    ];

    console.log('Performing port scan...');

    // In a real implementation, would scan the network
    // This is simplified for demo purposes
    return Promise.resolve();
  }

  /**
   * Parse SSDP response
   */
  private parseSSDPResponse(response: string): SSDPResponse {
    const lines = response.split('\r\n');
    const headers: Record<string, string> = {};

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).toLowerCase();
        const value = line.substring(colonIndex + 1).trim();
        headers[key] = value;
      }
    }

    return {
      location: headers['location'] || '',
      server: headers['server'] || '',
      usn: headers['usn'] || '',
      st: headers['st'] || '',
      headers,
    };
  }

  /**
   * Process discovery response and create Device object
   */
  private processDiscoveryResponse(
    response: SSDPResponse,
    ip: string
  ): Device | null {
    // Detect TV brand/type
    let deviceType: Device['type'] = 'generic';
    const searchText = `${response.server} ${response.usn} ${response.st}`;

    for (const { pattern, type } of BRAND_PATTERNS) {
      if (pattern.test(searchText)) {
        deviceType = type;
        break;
      }
    }

    // Extract port from location URL
    let port = 80;
    try {
      const url = new URL(response.location);
      port = parseInt(url.port) || 80;
    } catch {}

    // Generate unique ID
    const id = response.usn || `${ip}:${port}`;

    return {
      id,
      name: this.extractDeviceName(response) || `${deviceType.toUpperCase()} TV`,
      type: deviceType,
      ip,
      port,
      isPaired: false,
    };
  }

  /**
   * Extract device name from SSDP response
   */
  private extractDeviceName(response: SSDPResponse): string | null {
    // Try to extract from server header
    if (response.server) {
      const match = response.server.match(/^([^/]+)/);
      if (match) return match[1].trim();
    }
    return null;
  }

  /**
   * Fetch device details from its description URL
   */
  async fetchDeviceDetails(locationUrl: string): Promise<Partial<Device> | null> {
    try {
      const response = await fetch(locationUrl);
      const xml = await response.text();

      // Parse XML to extract device info
      const nameMatch = xml.match(/<friendlyName>([^<]+)<\/friendlyName>/);
      const modelMatch = xml.match(/<modelName>([^<]+)<\/modelName>/);
      const manufacturerMatch = xml.match(/<manufacturer>([^<]+)<\/manufacturer>/);

      return {
        name: nameMatch?.[1] || undefined,
        model: modelMatch?.[1] || undefined,
      };
    } catch (error) {
      console.error('Error fetching device details:', error);
      return null;
    }
  }

  /**
   * Test connection to a specific device
   */
  async testConnection(device: Device): Promise<boolean> {
    try {
      // Simple connectivity test
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`http://${device.ip}:${device.port}/`, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok || response.status === 405; // Some TVs return 405 for HEAD
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if currently scanning
   */
  get scanning(): boolean {
    return this.isScanning;
  }

  /**
   * Stop ongoing scan
   */
  stopScan(): void {
    this.isScanning = false;
  }
}

export default DeviceDiscoveryService.getInstance();
