/**
 * Root Layout - Rapid Type
 * Provides global context, fonts, and navigation structure
 */

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useStore, useStoreHydration } from "../src/store";
import { Colors } from "../src/constants";
import { initializeAds } from "../src/lib/ads";

export default function RootLayout() {
  const hasHydrated = useStoreHydration();
  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const [adsInitialized, setAdsInitialized] = useState(false);

  // Initialize ads SDK on app startup
  useEffect(() => {
    const initAds = async () => {
      try {
        // Request ATT permission on iOS before initializing ads
        if (Platform.OS === "ios") {
          try {
            const { requestTrackingPermissionsAsync } = await import("expo-tracking-transparency");
            await requestTrackingPermissionsAsync();
          } catch (e) {
            // ATT module not available, continue anyway
            console.log("[Ads] ATT not available, continuing without tracking permission");
          }
        }

        await initializeAds();
        setAdsInitialized(true);
      } catch (error) {
        console.error("[Ads] Failed to initialize ads:", error);
        // Continue app even if ads fail to initialize
        setAdsInitialized(true);
      }
    };

    initAds();
  }, []);

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
