/**
 * Home Screen - Mode Selection
 * Main entry point with game mode cards and navigation
 */

import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useStore } from "../src/store";
import { Colors, ModeInfo, DifficultyInfo } from "../src/constants";
import type { GameMode, Difficulty } from "../src/types";

// Icon component (placeholder - will use actual icons later)
const Icon = ({ name, size = 24, color = Colors.primary.default }: { name: string; size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>{name === "123" ? "123" : name === "spellcheck" ? "ABC" : name === "subject" ? "文" : ">"}</Text>
);

// Mode Card Component
const ModeCard = ({
  mode,
  isSelected,
  onPress,
}: {
  mode: GameMode;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const info = ModeInfo[mode];
  const isDarkMode = useStore((state) => state.settings.isDarkMode);

  return (
    <Pressable
      onPress={onPress}
      className={`
        flex-row items-center justify-between p-5 rounded-xl
        ${isSelected
          ? "bg-primary/20 border-2 border-primary"
          : isDarkMode
            ? "bg-white/5 border border-white/10"
            : "bg-panel-muted border border-primary/10"
        }
        active:scale-95
      `}
      style={{
        shadowColor: isSelected ? Colors.primary.default : "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isSelected ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: isSelected ? 4 : 1,
      }}
    >
      <View className="flex-row items-center gap-4">
        <View
          className={`w-10 h-10 rounded-lg items-center justify-center ${
            isSelected ? "bg-primary" : isDarkMode ? "bg-white/10" : "bg-white"
          }`}
        >
          <Icon
            name={info.icon}
            size={20}
            color={isSelected ? "#fff" : Colors.primary.default}
          />
        </View>
        <Text
          className={`text-lg font-bold ${
            isDarkMode ? "text-white" : "text-navy"
          }`}
        >
          {info.title}
        </Text>
      </View>

      {isSelected ? (
        <View className="bg-primary px-2 py-0.5 rounded-full">
          <Text className="text-[10px] text-white font-bold uppercase tracking-wider">
            Active
          </Text>
        </View>
      ) : (
        <Text className={`text-2xl ${isDarkMode ? "text-white/30" : "text-navy/30"}`}>
          {">"}
        </Text>
      )}
    </Pressable>
  );
};

// Difficulty Button Component
const DifficultyButton = ({
  difficulty,
  isSelected,
  onPress,
}: {
  difficulty: Difficulty;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const info = DifficultyInfo[difficulty];

  return (
    <Pressable
      onPress={onPress}
      className={`
        flex-1 py-3 rounded-xl items-center justify-center
        ${isSelected ? "bg-primary" : "bg-panel-muted border border-ui-border"}
        active:scale-95
      `}
    >
      <Text
        className={`font-bold ${isSelected ? "text-white" : "text-navy"}`}
      >
        {info.label}
      </Text>
    </Pressable>
  );
};

// Dark Mode Toggle
const DarkModeToggle = () => {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);

  return (
    <Pressable
      onPress={toggleDarkMode}
      className="flex-row items-center gap-3 bg-white/50 dark:bg-white/10 px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-800"
    >
      <Text className="text-navy dark:text-gray-300 text-sm font-bold tracking-wide uppercase">
        Dark Mode
      </Text>
      <View
        className={`relative h-6 w-11 rounded-full ${
          isDarkMode ? "bg-primary" : "bg-gray-200"
        }`}
      >
        <View
          className={`absolute h-4 w-4 rounded-full bg-white top-1 transition-all ${
            isDarkMode ? "right-1" : "left-1"
          }`}
        />
      </View>
    </Pressable>
  );
};

export default function HomeScreen() {
  const [selectedMode, setSelectedMode] = useState<GameMode>("NUMBERS");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("NORMAL");
  const isDarkMode = useStore((state) => state.settings.isDarkMode);

  const handleStartGame = () => {
    router.push({
      pathname: "/game/[mode]",
      params: {
        mode: selectedMode,
        difficulty: selectedDifficulty,
      },
    });
  };

  // MVP: Only show 3 modes
  const mvpModes: GameMode[] = ["NUMBERS", "ALPHABET", "SENTENCE"];

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-bg-dark" : "bg-bg-light"}`}
      edges={["top"]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-end px-6 pt-4">
        <DarkModeToggle />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View className="items-center mt-8 mb-10">
          <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Text className="text-white text-4xl font-bold">{">"}</Text>
          </View>
          <Text
            className={`text-[44px] font-bold tracking-tight ${
              isDarkMode ? "text-white" : "text-navy"
            }`}
          >
            Rapid Type
          </Text>
          <Text className="text-primary font-medium tracking-widest text-xs uppercase mt-2">
            Master Your Reflexes
          </Text>
        </View>

        {/* Mode Selection */}
        <View className="mb-8">
          <Text
            className={`text-center text-xs font-bold tracking-[0.2em] uppercase mb-4 ${
              isDarkMode ? "text-gray-400" : "text-navy/60"
            }`}
          >
            Select Game Mode
          </Text>
          <View className="gap-4">
            {mvpModes.map((mode) => (
              <ModeCard
                key={mode}
                mode={mode}
                isSelected={selectedMode === mode}
                onPress={() => setSelectedMode(mode)}
              />
            ))}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View className="mb-8">
          <Text
            className={`text-center text-xs font-bold tracking-[0.2em] uppercase mb-4 ${
              isDarkMode ? "text-gray-400" : "text-navy/60"
            }`}
          >
            Difficulty
          </Text>
          <View className="flex-row gap-3">
            {(["EASY", "NORMAL", "HARD"] as Difficulty[]).map((diff) => (
              <DifficultyButton
                key={diff}
                difficulty={diff}
                isSelected={selectedDifficulty === diff}
                onPress={() => setSelectedDifficulty(diff)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View className="px-6 pb-8">
        {/* Start Button */}
        <Pressable
          onPress={handleStartGame}
          className="bg-primary h-16 rounded-2xl flex-row items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-primary/30"
        >
          <Text className="text-white text-xl font-bold tracking-wide">
            START GAME
          </Text>
        </Pressable>

        {/* Bottom Nav */}
        <View className="flex-row justify-between px-8 mt-6">
          {[
            { icon: "leaderboard", label: "Scores" },
            { icon: "settings", label: "Settings" },
            { icon: "emoji_events", label: "Awards" },
          ].map((item) => (
            <Pressable
              key={item.label}
              className="items-center gap-1"
              onPress={() => {
                if (item.label === "Settings") {
                  router.push("/settings");
                }
              }}
            >
              <View className="p-2 rounded-full">
                <Text
                  className={`text-xl ${
                    isDarkMode ? "text-white" : "text-navy"
                  }`}
                >
                  {item.icon === "leaderboard" ? "📊" : item.icon === "settings" ? "⚙️" : "🏆"}
                </Text>
              </View>
              <Text
                className={`text-[10px] font-bold uppercase tracking-tighter ${
                  isDarkMode ? "text-gray-400" : "text-navy/60"
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
