import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [tvIP, setTvIP] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Enter your TV IP address');

  const connectToTV = () => {
    if (!tvIP || !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(tvIP)) {
      Alert.alert('Invalid IP', 'Please enter a valid IP address');
      return;
    }
    setIsConnected(true);
    setStatus('Connected to ' + tvIP);
  };

  const sendCommand = async (command: string) => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect to your TV first');
      return;
    }

    setStatus('Sending: ' + command);

    const soapBody = '<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:X_SendKey xmlns:u="urn:panasonic-com:service:p00NetworkControl:1"><X_KeyEvent>' + command + '</X_KeyEvent></u:X_SendKey></s:Body></s:Envelope>';

    try {
      await fetch('http://' + tvIP + ':55000/nrc/control_0', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset="utf-8"',
          'SOAPACTION': '"urn:panasonic-com:service:p00NetworkControl:1#X_SendKey"',
        },
        body: soapBody,
      });
      setStatus('Sent: ' + command);
    } catch (e) {
      setStatus('Error sending command');
    }
  };

  const RemoteButton = ({ label, command }: { label: string; command: string }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => sendCommand(command)}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Toshiba Remote</Text>

        {!isConnected ? (
          <View style={styles.connectSection}>
            <Text style={styles.label}>TV IP Address:</Text>
            <TextInput
              style={styles.input}
              placeholder="192.168.1.100"
              placeholderTextColor="#666"
              value={tvIP}
              onChangeText={setTvIP}
              keyboardType="decimal-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.connectButton} onPress={connectToTV}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.remoteSection}>
            <Text style={styles.status}>{status}</Text>

            <View style={styles.row}>
              <RemoteButton label="Power" command="NRC_POWER-ONOFF" />
            </View>

            <View style={styles.row}>
              <RemoteButton label="UP" command="NRC_UP-ONOFF" />
            </View>
            <View style={styles.row}>
              <RemoteButton label="LEFT" command="NRC_LEFT-ONOFF" />
              <RemoteButton label="OK" command="NRC_ENTER-ONOFF" />
              <RemoteButton label="RIGHT" command="NRC_RIGHT-ONOFF" />
            </View>
            <View style={styles.row}>
              <RemoteButton label="DOWN" command="NRC_DOWN-ONOFF" />
            </View>

            <View style={styles.row}>
              <RemoteButton label="Vol-" command="NRC_VOLDOWN-ONOFF" />
              <RemoteButton label="Mute" command="NRC_MUTE-ONOFF" />
              <RemoteButton label="Vol+" command="NRC_VOLUP-ONOFF" />
            </View>

            <View style={styles.row}>
              <RemoteButton label="Home" command="NRC_HOME-ONOFF" />
              <RemoteButton label="Back" command="NRC_RETURN-ONOFF" />
            </View>

            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={() => {
                setIsConnected(false);
                setStatus('Enter your TV IP address');
              }}
            >
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
  },
  label: {
    color: '#aaaaaa',
    fontSize: 16,
    marginBottom: 10,
  },
  status: {
    color: '#888888',
    marginBottom: 25,
    fontSize: 14,
  },
  connectSection: {
    width: '100%',
    alignItems: 'center',
  },
  remoteSection: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  connectButton: {
    backgroundColor: '#0a84ff',
    padding: 16,
    borderRadius: 10,
    width: '100%',
  },
  connectButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 6,
  },
  button: {
    backgroundColor: '#3a3a3a',
    width: 75,
    height: 75,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  disconnectButton: {
    marginTop: 40,
    padding: 15,
  },
  disconnectText: {
    color: '#ff453a',
    fontSize: 16,
  },
});
