import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DeviceProvider } from './src/context/DeviceContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import RemoteScreen from './src/screens/RemoteScreen';
import DeviceDiscoveryScreen from './src/screens/DeviceDiscoveryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DeviceDetailsScreen from './src/screens/DeviceDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopColor: '#38383A',
        },
        headerStyle: {
          backgroundColor: '#1C1C1E',
        },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Devices',
          tabBarLabel: 'Devices',
        }}
      />
      <Tab.Screen
        name="Remote"
        component={RemoteScreen}
        options={{
          title: 'Remote',
          tabBarLabel: 'Remote',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <DeviceProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1C1C1E',
              },
              headerTintColor: '#FFFFFF',
            }}
          >
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DeviceDiscovery"
              component={DeviceDiscoveryScreen}
              options={{ title: 'Find Devices' }}
            />
            <Stack.Screen
              name="DeviceDetails"
              component={DeviceDetailsScreen}
              options={{ title: 'Device Details' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </DeviceProvider>
    </SafeAreaProvider>
  );
}

export default App;
