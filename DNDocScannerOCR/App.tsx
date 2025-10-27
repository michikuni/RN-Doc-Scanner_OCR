// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanScreen from './src/screens/ScanScreen';
import OcrScreen from './src/screens/OcrScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ScanScreen" component={ScanScreen} options={{ title: 'Scanner' }}/>
        <Stack.Screen name="OcrScreen" component={OcrScreen} options={{ title: 'OCR' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
