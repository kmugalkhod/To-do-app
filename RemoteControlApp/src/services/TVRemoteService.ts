/**
 * TV Remote Service
 * Handles communication with smart TVs over WiFi
 * Supports: Toshiba, Samsung, LG, Roku, Android TV, Sony, Generic DLNA
 */

import { Device } from '../context/DeviceContext';

// Command mappings for different TV brands
const COMMAND_MAPS: Record<string, Record<string, string>> = {
  toshiba: {
    POWER: 'NRC_POWER-ONOFF',
    VOLUME_UP: 'NRC_VOLUP-ONOFF',
    VOLUME_DOWN: 'NRC_VOLDOWN-ONOFF',
    MUTE: 'NRC_MUTE-ONOFF',
    CHANNEL_UP: 'NRC_CH_UP-ONOFF',
    CHANNEL_DOWN: 'NRC_CH_DOWN-ONOFF',
    UP: 'NRC_UP-ONOFF',
    DOWN: 'NRC_DOWN-ONOFF',
    LEFT: 'NRC_LEFT-ONOFF',
    RIGHT: 'NRC_RIGHT-ONOFF',
    OK: 'NRC_ENTER-ONOFF',
    BACK: 'NRC_RETURN-ONOFF',
    HOME: 'NRC_HOME-ONOFF',
    MENU: 'NRC_MENU-ONOFF',
    PLAY: 'NRC_PLAY-ONOFF',
    PAUSE: 'NRC_PAUSE-ONOFF',
    STOP: 'NRC_STOP-ONOFF',
    REWIND: 'NRC_REW-ONOFF',
    FAST_FORWARD: 'NRC_FF-ONOFF',
    INPUT: 'NRC_INPUT-ONOFF',
    SETTINGS: 'NRC_SETUP-ONOFF',
  },
  samsung: {
    POWER: 'KEY_POWER',
    VOLUME_UP: 'KEY_VOLUP',
    VOLUME_DOWN: 'KEY_VOLDOWN',
    MUTE: 'KEY_MUTE',
    CHANNEL_UP: 'KEY_CHUP',
    CHANNEL_DOWN: 'KEY_CHDOWN',
    UP: 'KEY_UP',
    DOWN: 'KEY_DOWN',
    LEFT: 'KEY_LEFT',
    RIGHT: 'KEY_RIGHT',
    OK: 'KEY_ENTER',
    BACK: 'KEY_RETURN',
    HOME: 'KEY_HOME',
    MENU: 'KEY_MENU',
    PLAY: 'KEY_PLAY',
    PAUSE: 'KEY_PAUSE',
    STOP: 'KEY_STOP',
    REWIND: 'KEY_REWIND',
    FAST_FORWARD: 'KEY_FF',
    INPUT: 'KEY_SOURCE',
    SETTINGS: 'KEY_TOOLS',
  },
  lg: {
    POWER: 'POWER',
    VOLUME_UP: 'VOLUMEUP',
    VOLUME_DOWN: 'VOLUMEDOWN',
    MUTE: 'MUTE',
    CHANNEL_UP: 'CHANNELUP',
    CHANNEL_DOWN: 'CHANNELDOWN',
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    OK: 'ENTER',
    BACK: 'BACK',
    HOME: 'HOME',
    MENU: 'MENU',
    PLAY: 'PLAY',
    PAUSE: 'PAUSE',
    STOP: 'STOP',
    REWIND: 'REWIND',
    FAST_FORWARD: 'FASTFORWARD',
    INPUT: 'INPUT',
    SETTINGS: 'SETTINGS',
  },
  roku: {
    POWER: 'Power',
    VOLUME_UP: 'VolumeUp',
    VOLUME_DOWN: 'VolumeDown',
    MUTE: 'VolumeMute',
    CHANNEL_UP: 'ChannelUp',
    CHANNEL_DOWN: 'ChannelDown',
    UP: 'Up',
    DOWN: 'Down',
    LEFT: 'Left',
    RIGHT: 'Right',
    OK: 'Select',
    BACK: 'Back',
    HOME: 'Home',
    MENU: 'Info',
    PLAY: 'Play',
    PAUSE: 'Play',
    STOP: 'Play',
    REWIND: 'Rev',
    FAST_FORWARD: 'Fwd',
    INPUT: 'InputTuner',
    SETTINGS: 'Info',
  },
  android_tv: {
    POWER: 'KEYCODE_POWER',
    VOLUME_UP: 'KEYCODE_VOLUME_UP',
    VOLUME_DOWN: 'KEYCODE_VOLUME_DOWN',
    MUTE: 'KEYCODE_MUTE',
    CHANNEL_UP: 'KEYCODE_CHANNEL_UP',
    CHANNEL_DOWN: 'KEYCODE_CHANNEL_DOWN',
    UP: 'KEYCODE_DPAD_UP',
    DOWN: 'KEYCODE_DPAD_DOWN',
    LEFT: 'KEYCODE_DPAD_LEFT',
    RIGHT: 'KEYCODE_DPAD_RIGHT',
    OK: 'KEYCODE_DPAD_CENTER',
    BACK: 'KEYCODE_BACK',
    HOME: 'KEYCODE_HOME',
    MENU: 'KEYCODE_MENU',
    PLAY: 'KEYCODE_MEDIA_PLAY',
    PAUSE: 'KEYCODE_MEDIA_PAUSE',
    STOP: 'KEYCODE_MEDIA_STOP',
    REWIND: 'KEYCODE_MEDIA_REWIND',
    FAST_FORWARD: 'KEYCODE_MEDIA_FAST_FORWARD',
    INPUT: 'KEYCODE_TV_INPUT',
    SETTINGS: 'KEYCODE_SETTINGS',
  },
  sony: {
    POWER: 'AAAAAQAAAAEAAAAVAw==',
    VOLUME_UP: 'AAAAAQAAAAEAAAASAw==',
    VOLUME_DOWN: 'AAAAAQAAAAEAAAATAw==',
    MUTE: 'AAAAAQAAAAEAAAAUAw==',
    CHANNEL_UP: 'AAAAAQAAAAEAAAAQAw==',
    CHANNEL_DOWN: 'AAAAAQAAAAEAAAARAw==',
    UP: 'AAAAAQAAAAEAAAB0Aw==',
    DOWN: 'AAAAAQAAAAEAAAB1Aw==',
    LEFT: 'AAAAAQAAAAEAAAB2Aw==',
    RIGHT: 'AAAAAQAAAAEAAAB3Aw==',
    OK: 'AAAAAQAAAAEAAABlAw==',
    BACK: 'AAAAAgAAAJcAAAAjAw==',
    HOME: 'AAAAAQAAAAEAAABgAw==',
    MENU: 'AAAAAgAAABoAAAAlAw==',
    PLAY: 'AAAAAgAAAJcAAAAaAw==',
    PAUSE: 'AAAAAgAAAJcAAAAZAw==',
    STOP: 'AAAAAgAAAJcAAAAYAw==',
    REWIND: 'AAAAAgAAAJcAAAAbAw==',
    FAST_FORWARD: 'AAAAAgAAAJcAAAAcAw==',
    INPUT: 'AAAAAQAAAAEAAAAlAw==',
    SETTINGS: 'AAAAAgAAAJcAAAA2Aw==',
  },
  generic: {
    POWER: 'POWER',
    VOLUME_UP: 'VOLUME_UP',
    VOLUME_DOWN: 'VOLUME_DOWN',
    MUTE: 'MUTE',
    CHANNEL_UP: 'CHANNEL_UP',
    CHANNEL_DOWN: 'CHANNEL_DOWN',
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    OK: 'OK',
    BACK: 'BACK',
    HOME: 'HOME',
    MENU: 'MENU',
    PLAY: 'PLAY',
    PAUSE: 'PAUSE',
    STOP: 'STOP',
    REWIND: 'REWIND',
    FAST_FORWARD: 'FAST_FORWARD',
    INPUT: 'INPUT',
    SETTINGS: 'SETTINGS',
  },
};

// Port configurations for different TV brands
const PORT_CONFIG: Record<string, { http: number; ws?: number }> = {
  toshiba: { http: 55000, ws: 55000 },
  samsung: { http: 8001, ws: 8001 },
  lg: { http: 3000, ws: 3000 },
  roku: { http: 8060 },
  android_tv: { http: 5555 },
  sony: { http: 80 },
  generic: { http: 8080 },
};

class TVRemoteService {
  private static instance: TVRemoteService;
  private wsConnections: Map<string, WebSocket> = new Map();

  static getInstance(): TVRemoteService {
    if (!TVRemoteService.instance) {
      TVRemoteService.instance = new TVRemoteService();
    }
    return TVRemoteService.instance;
  }

  /**
   * Send a command to the TV
   */
  async sendCommand(device: Device, command: string): Promise<boolean> {
    const commandMap = COMMAND_MAPS[device.type] || COMMAND_MAPS.generic;
    const mappedCommand = commandMap[command] || command;

    console.log(`Sending command: ${command} -> ${mappedCommand} to ${device.name}`);

    switch (device.type) {
      case 'toshiba':
        return this.sendToshibaCommand(device, mappedCommand);
      case 'samsung':
        return this.sendSamsungCommand(device, mappedCommand);
      case 'lg':
        return this.sendLGCommand(device, mappedCommand);
      case 'roku':
        return this.sendRokuCommand(device, mappedCommand);
      case 'android_tv':
        return this.sendAndroidTVCommand(device, mappedCommand);
      case 'sony':
        return this.sendSonyCommand(device, mappedCommand);
      default:
        return this.sendGenericCommand(device, mappedCommand);
    }
  }

  /**
   * Toshiba TV Command (uses similar protocol to Panasonic/Viera)
   * Many Toshiba Smart TVs use the Viera-compatible protocol
   */
  private async sendToshibaCommand(device: Device, command: string): Promise<boolean> {
    const port = device.port || PORT_CONFIG.toshiba.http;
    const url = `http://${device.ip}:${port}/nrc/control_0`;

    const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <s:Body>
    <u:X_SendKey xmlns:u="urn:panasonic-com:service:p00NetworkControl:1">
      <X_KeyEvent>${command}</X_KeyEvent>
    </u:X_SendKey>
  </s:Body>
</s:Envelope>`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset="utf-8"',
          'SOAPACTION': '"urn:panasonic-com:service:p00NetworkControl:1#X_SendKey"',
        },
        body: soapBody,
      });
      return response.ok;
    } catch (error) {
      console.error('Toshiba command error:', error);
      return false;
    }
  }

  /**
   * Samsung TV Command (WebSocket API)
   */
  private async sendSamsungCommand(device: Device, command: string): Promise<boolean> {
    const port = device.port || PORT_CONFIG.samsung.ws;
    const wsUrl = `ws://${device.ip}:${port}/api/v2/channels/samsung.remote.control`;

    return new Promise((resolve) => {
      try {
        let ws = this.wsConnections.get(device.id);

        if (!ws || ws.readyState !== WebSocket.OPEN) {
          ws = new WebSocket(wsUrl);
          this.wsConnections.set(device.id, ws);

          ws.onopen = () => {
            const payload = JSON.stringify({
              method: 'ms.remote.control',
              params: {
                Cmd: 'Click',
                DataOfCmd: command,
                Option: 'false',
                TypeOfRemote: 'SendRemoteKey',
              },
            });
            ws!.send(payload);
            resolve(true);
          };

          ws.onerror = () => resolve(false);
        } else {
          const payload = JSON.stringify({
            method: 'ms.remote.control',
            params: {
              Cmd: 'Click',
              DataOfCmd: command,
              Option: 'false',
              TypeOfRemote: 'SendRemoteKey',
            },
          });
          ws.send(payload);
          resolve(true);
        }
      } catch (error) {
        console.error('Samsung command error:', error);
        resolve(false);
      }
    });
  }

  /**
   * LG WebOS TV Command
   */
  private async sendLGCommand(device: Device, command: string): Promise<boolean> {
    const port = device.port || PORT_CONFIG.lg.ws;
    const wsUrl = `ws://${device.ip}:${port}`;

    return new Promise((resolve) => {
      try {
        let ws = this.wsConnections.get(device.id);

        if (!ws || ws.readyState !== WebSocket.OPEN) {
          ws = new WebSocket(wsUrl);
          this.wsConnections.set(device.id, ws);

          ws.onopen = () => {
            const payload = JSON.stringify({
              type: 'button',
              name: command,
            });
            ws!.send(payload);
            resolve(true);
          };

          ws.onerror = () => resolve(false);
        } else {
          const payload = JSON.stringify({
            type: 'button',
            name: command,
          });
          ws.send(payload);
          resolve(true);
        }
      } catch (error) {
        console.error('LG command error:', error);
        resolve(false);
      }
    });
  }

  /**
   * Roku TV Command (REST API)
   */
  private async sendRokuCommand(device: Device, command: string): Promise<boolean> {
    const port = device.port || PORT_CONFIG.roku.http;
    const url = `http://${device.ip}:${port}/keypress/${command}`;

    try {
      const response = await fetch(url, { method: 'POST' });
      return response.ok;
    } catch (error) {
      console.error('Roku command error:', error);
      return false;
    }
  }

  /**
   * Android TV Command (ADB over network)
   */
  private async sendAndroidTVCommand(device: Device, command: string): Promise<boolean> {
    // Android TV requires ADB connection - simplified HTTP bridge approach
    const port = device.port || PORT_CONFIG.android_tv.http;
    const url = `http://${device.ip}:${port}/input`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keycode: command }),
      });
      return response.ok;
    } catch (error) {
      console.error('Android TV command error:', error);
      return false;
    }
  }

  /**
   * Sony Bravia TV Command (IRCC API)
   */
  private async sendSonyCommand(device: Device, command: string): Promise<boolean> {
    const port = device.port || PORT_CONFIG.sony.http;
    const url = `http://${device.ip}:${port}/sony/IRCC`;

    const soapBody = `<?xml version="1.0"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <s:Body>
    <u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">
      <IRCCCode>${command}</IRCCCode>
    </u:X_SendIRCC>
  </s:Body>
</s:Envelope>`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=UTF-8',
          'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
        },
        body: soapBody,
      });
      return response.ok;
    } catch (error) {
      console.error('Sony command error:', error);
      return false;
    }
  }

  /**
   * Generic DLNA/UPnP Command
   */
  private async sendGenericCommand(device: Device, command: string): Promise<boolean> {
    const port = device.port || PORT_CONFIG.generic.http;
    const url = `http://${device.ip}:${port}/remote/${command}`;

    try {
      const response = await fetch(url, { method: 'POST' });
      return response.ok;
    } catch (error) {
      console.error('Generic command error:', error);
      return false;
    }
  }

  /**
   * Close all WebSocket connections
   */
  closeAllConnections(): void {
    this.wsConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    this.wsConnections.clear();
  }

  /**
   * Close connection for specific device
   */
  closeConnection(deviceId: string): void {
    const ws = this.wsConnections.get(deviceId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    this.wsConnections.delete(deviceId);
  }
}

export default TVRemoteService.getInstance();
