import { View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const _layout = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* Custom Status Bar */}
      <StatusBar
        style="dark" // Options: "auto", "inverted", "light", "dark"
        backgroundColor="#ffffff" // Background color for Android
        translucent={false} // Whether the status bar is translucent
        hidden={false} // Whether the status bar is hidden
      />
      
      {/* Stack Navigation */}
      <Stack>
        <Stack.Screen name="UserDataform" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default _layout;
