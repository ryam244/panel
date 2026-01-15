/**
 * Settings Screen
 * User preferences and app settings
 */

import { View, Text, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useStore } from "../src/store";
import { Colors } from "../src/constants";

// Setting Row Component
const SettingRow = ({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
}) => {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);

  return (
    <Pressable
      onPress={onToggle}
      className={`flex-row items-center justify-between p-4 rounded-xl ${
        isDarkMode ? "bg-white/5" : "bg-white"
      } mb-3`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View className="flex-1 mr-4">
        <Text
          className={`font-semibold text-base ${
            isDarkMode ? "text-white" : "text-charcoal"
          }`}
        >
          {label}
        </Text>
        {description && (
          <Text
            className={`text-sm mt-0.5 ${
              isDarkMode ? "text-white/50" : "text-charcoal/50"
            }`}
          >
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: isDarkMode ? "#3a3a3c" : "#e5e5ea",
          true: Colors.primary.default,
        }}
        thumbColor="#fff"
      />
    </Pressable>
  );
};

// Stats Row Component
const StatsRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);

  return (
    <View
      className={`flex-row items-center justify-between p-4 rounded-xl ${
        isDarkMode ? "bg-white/5" : "bg-white"
      } mb-3`}
    >
      <Text
        className={`font-medium ${
          isDarkMode ? "text-white/70" : "text-charcoal/70"
        }`}
      >
        {label}
      </Text>
      <Text
        className={`font-bold ${isDarkMode ? "text-white" : "text-charcoal"}`}
      >
        {value}
      </Text>
    </View>
  );
};

export default function SettingsScreen() {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const isSoundEnabled = useStore((state) => state.settings.isSoundEnabled);
  const isHapticsEnabled = useStore((state) => state.settings.isHapticsEnabled);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const toggleSound = useStore((state) => state.toggleSound);
  const toggleHaptics = useStore((state) => state.toggleHaptics);
  const stats = useStore((state) => state.stats);

  // Format play time
  const formatPlayTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-bg-dark" : "bg-bg-result"}`}
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
        <View className="w-10" />
        <Text
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-charcoal"
          }`}
        >
          Settings
        </Text>
        <Pressable
          onPress={() => router.back()}
          className={`w-10 h-10 items-center justify-center rounded-full ${
            isDarkMode ? "bg-white/10" : "bg-white"
          } active:scale-95`}
        >
          <Text className={isDarkMode ? "text-white" : "text-charcoal"}>✕</Text>
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Preferences Section */}
        <Text
          className={`text-xs font-bold uppercase tracking-widest mb-3 ${
            isDarkMode ? "text-white/40" : "text-charcoal/40"
          }`}
        >
          Preferences
        </Text>

        <SettingRow
          label="Dark Mode"
          description="Reduce eye strain in low light"
          value={isDarkMode}
          onToggle={toggleDarkMode}
        />

        <SettingRow
          label="Sound Effects"
          description="Play sounds on tap and clear"
          value={isSoundEnabled}
          onToggle={toggleSound}
        />

        <SettingRow
          label="Haptic Feedback"
          description="Vibrate on tap and events"
          value={isHapticsEnabled}
          onToggle={toggleHaptics}
        />

        {/* Stats Section */}
        <Text
          className={`text-xs font-bold uppercase tracking-widest mt-8 mb-3 ${
            isDarkMode ? "text-white/40" : "text-charcoal/40"
          }`}
        >
          Statistics
        </Text>

        <StatsRow label="Games Played" value={stats.totalGamesPlayed} />
        <StatsRow label="Total Play Time" value={formatPlayTime(stats.totalPlayTime)} />
        <StatsRow label="Current Streak" value={`${stats.currentStreak} days`} />
        <StatsRow label="Longest Streak" value={`${stats.longestStreak} days`} />

        {/* App Info */}
        <View className="mt-auto mb-8 items-center">
          <Text
            className={`text-sm ${
              isDarkMode ? "text-white/30" : "text-charcoal/30"
            }`}
          >
            Rapid Type v1.0.0
          </Text>
          <Text
            className={`text-xs mt-1 ${
              isDarkMode ? "text-white/20" : "text-charcoal/20"
            }`}
          >
            Master Your Reflexes
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
