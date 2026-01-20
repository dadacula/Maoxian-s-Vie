import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import JournalDetailScreen from './screens/JournalDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: '#FFF8F0',
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="JournalDetail"
          component={JournalDetailScreen}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTransparent: true,
            headerShadowVisible: false,
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
