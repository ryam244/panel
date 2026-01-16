/**
 * Settings Screen
 * User preferences and app settings
 */

import { View, Text, Pressable, Switch, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useStore } from "../src/store";
import { Colors } from "../src/constants";
import { t } from "../src/i18n";

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
      style={[
        styles.settingRow,
        { backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#fff" },
      ]}
    >
      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingLabel,
            { color: isDarkMode ? "#fff" : Colors.text.primary },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={[
              styles.settingDesc,
              { color: isDarkMode ? "rgba(255,255,255,0.5)" : Colors.text.muted },
            ]}
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
      style={[
        styles.statsRow,
        { backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#fff" },
      ]}
    >
      <Text
        style={[
          styles.statsLabel,
          { color: isDarkMode ? "rgba(255,255,255,0.7)" : Colors.text.muted },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.statsValue,
          { color: isDarkMode ? "#fff" : Colors.text.primary },
        ]}
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

  const formatPlayTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}${t("time.hours")} ${minutes % 60}${t("time.minutes")}`;
    }
    if (minutes > 0) {
      return `${minutes}${t("time.minutes")} ${seconds % 60}${t("time.seconds")}`;
    }
    return `${seconds}${t("time.seconds")}`;
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.background.dark : Colors.background.light },
      ]}
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text
          style={[
            styles.headerTitle,
            { color: isDarkMode ? "#fff" : Colors.text.primary },
          ]}
        >
          {t("settings.title")}
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.closeButton,
            { backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#fff" },
          ]}
        >
          <Text style={{ color: isDarkMode ? "#fff" : Colors.text.primary }}>✕</Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDarkMode ? "rgba(255,255,255,0.4)" : Colors.text.muted },
          ]}
        >
          {t("settings.preferences")}
        </Text>

        <SettingRow
          label={t("settings.darkMode")}
          description={t("settings.darkModeDesc")}
          value={isDarkMode}
          onToggle={toggleDarkMode}
        />

        <SettingRow
          label={t("settings.sound")}
          description={t("settings.soundDesc")}
          value={isSoundEnabled}
          onToggle={toggleSound}
        />

        <SettingRow
          label={t("settings.haptics")}
          description={t("settings.hapticsDesc")}
          value={isHapticsEnabled}
          onToggle={toggleHaptics}
        />

        <Text
          style={[
            styles.sectionTitle,
            styles.sectionTitleMargin,
            { color: isDarkMode ? "rgba(255,255,255,0.4)" : Colors.text.muted },
          ]}
        >
          {t("settings.statistics")}
        </Text>

        <StatsRow label={t("settings.gamesPlayed")} value={stats.totalGamesPlayed} />
        <StatsRow label={t("settings.totalPlayTime")} value={formatPlayTime(stats.totalPlayTime)} />
        <StatsRow label={t("settings.currentStreak")} value={`${stats.currentStreak} ${t("settings.days")}`} />
        <StatsRow label={t("settings.longestStreak")} value={`${stats.longestStreak} ${t("settings.days")}`} />

        <View style={styles.appInfo}>
          <Text
            style={[
              styles.appVersion,
              { color: isDarkMode ? "rgba(255,255,255,0.3)" : Colors.text.muted },
            ]}
          >
            Mojic v1.0.0
          </Text>
          <Text
            style={[
              styles.appTagline,
              { color: isDarkMode ? "rgba(255,255,255,0.2)" : Colors.text.muted },
            ]}
          >
            {t("app.tagline")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionTitleMargin: {
    marginTop: 32,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingDesc: {
    fontSize: 14,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  appInfo: {
    marginTop: "auto",
    marginBottom: 32,
    alignItems: "center",
  },
  appVersion: {
    fontSize: 14,
  },
  appTagline: {
    fontSize: 12,
    marginTop: 4,
  },
});
