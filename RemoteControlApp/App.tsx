import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  ScrollView,
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
    setStatus(`Connected to ${tvIP}`);
  };

  const sendCommand = async (command: string) => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect to your TV first');
      return;
    }

    setStatus(`Sending: ${command}`);

    const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <s:Body>
    <u:X_SendKey xmlns:u="urn:panasonic-com:service:p00NetworkControl:1">
      <X_KeyEvent>${command}</X_KeyEvent>
    </u:X_SendKey>
  </s:Body>
</s:Envelope>`;

    try {
      await fetch(`http://${tvIP}:55000/nrc/control_0`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset="utf-8"',
          'SOAPACTION': '"urn:panasonic-com:service:p00NetworkControl:1#X_SendKey"',
        },
        body: soapBody,
      });
      setStatus(`Sent: ${command}`);
    } catch (error) {
      setStatus(`Error sending command`);
    }
  };

  const RemoteButton = ({ label, command }: { label: string; command: string }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => sendCommand(command)}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Toshiba Remote</Text>

        {!isConnected ? (
          <View style={styles.connectSection}>
            <TextInput
              style={styles.input}
              placeholder="Enter TV IP (e.g. 192.168.1.100)"
              placeholderTextColor="#888"
              value={tvIP}
              onChangeText={setTvIP}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.connectButton} onPress={connectToTV}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.status}>{status}</Text>

            {/* Power */}
            <View style={styles.row}>
              <RemoteButton label="⏻ Power" command="NRC_POWER-ONOFF" />
            </View>

            {/* Navigation */}
            <View style={styles.row}>
              <RemoteButton label="▲" command="NRC_UP-ONOFF" />
            </View>
            <View style={styles.row}>
              <RemoteButton label="◀" command="NRC_LEFT-ONOFF" />
              <RemoteButton label="OK" command="NRC_ENTER-ONOFF" />
              <RemoteButton label="▶" command="NRC_RIGHT-ONOFF" />
            </View>
            <View style={styles.row}>
              <RemoteButton label="▼" command="NRC_DOWN-ONOFF" />
            </View>

            {/* Volume & Menu */}
            <View style={styles.row}>
              <RemoteButton label="Vol -" command="NRC_VOLDOWN-ONOFF" />
              <RemoteButton label="Mute" command="NRC_MUTE-ONOFF" />
              <RemoteButton label="Vol +" command="NRC_VOLUP-ONOFF" />
            </View>

            <View style={styles.row}>
              <RemoteButton label="Home" command="NRC_HOME-ONOFF" />
              <RemoteButton label="Back" command="NRC_RETURN-ONOFF" />
              <RemoteButton label="Menu" command="NRC_MENU-ONOFF" />
            </View>

            {/* Disconnect */}
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={() => setIsConnected(false)}
            >
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  status: {
    color: '#888',
    marginBottom: 20,
  },
  connectSection: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  connectButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  connectButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#333',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disconnectButton: {
    marginTop: 30,
    padding: 15,
  },
  disconnectText: {
    color: '#FF3B30',
    fontSize: 16,
  },
});
