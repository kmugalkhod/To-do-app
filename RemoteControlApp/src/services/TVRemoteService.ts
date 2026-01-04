/**
 * TV Remote Service
 * Handles communication with smart TVs over WiFi
 * Simplified for Expo Go compatibility
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

const PORT_CONFIG: Record<string, number> = {
  toshiba: 55000,
  samsung: 8001,
  lg: 3000,
  roku: 8060,
  generic: 8080,
};

class TVRemoteService {
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
      case 'roku':
        return this.sendRokuCommand(device, mappedCommand);
      default:
        return this.sendGenericCommand(device, mappedCommand);
    }
  }

  /**
   * Toshiba TV Command (Viera-compatible protocol)
   */
  private async sendToshibaCommand(device: Device, command: string): Promise<boolean> {
    const port = device.port || PORT_CONFIG.toshiba;
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
   * Roku TV Command (REST API)
   */
  private async sendRokuCommand(device: Device, command: string): Promise<boolean> {
    const port = device.port || PORT_CONFIG.roku;
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
   * Generic HTTP Command
   */
  private async sendGenericCommand(device: Device, command: string): Promise<boolean> {
    const port = device.port || PORT_CONFIG.generic;
    const url = `http://${device.ip}:${port}/remote/${command}`;

    try {
      const response = await fetch(url, { method: 'POST' });
      return response.ok;
    } catch (error) {
      console.error('Generic command error:', error);
      return false;
    }
  }
}

const tvRemoteService = new TVRemoteService();
export default tvRemoteService;
