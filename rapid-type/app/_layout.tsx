/**
 * Root Layout - Rapid Type
 * Provides global context, fonts, and navigation structure
 */

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useStore, useStoreHydration } from "../src/store";
import { Colors } from "../src/constants";

export default function RootLayout() {
  const hasHydrated = useStoreHydration();
  const isDarkMode = useStore((state) => state.settings.isDarkMode);

  // Wait for store hydration
  if (!hasHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background.light,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary.default} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDarkMode
              ? Colors.background.dark
              : Colors.background.light,
          },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="game/[mode]"
          options={{
            animation: "fade",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            animation: "slide_from_bottom",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="tutorial"
          options={{
            presentation: "modal",
            animation: "fade",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="stats"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="achievements"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
