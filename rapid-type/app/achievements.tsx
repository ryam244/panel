/**
 * Achievements Screen - Mojic
 * Shows all achievements with unlock status and progress
 */

import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Lock, Trophy, Zap, Target, Star, Calendar, Award } from "lucide-react-native";
import { useStore, ACHIEVEMENT_IDS, Achievement } from "../src/store";
import { Colors } from "../src/constants";
import { t } from "../src/i18n";

// Achievement definition with icons
interface AchievementDef {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  hasProgress?: boolean;
}

// Get achievement definitions
const getAchievementDefs = (isDarkMode: boolean): AchievementDef[] => {
  const iconColor = isDarkMode ? Colors.text.dark : Colors.text.primary;
  const iconSize = 24;

  return [
    {
      id: ACHIEVEMENT_IDS.FIRST_CLEAR,
      icon: <Star size={iconSize} color={iconColor} />,
      title: t("achievements.firstClear"),
      description: t("achievements.firstClearDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.SPEED_DEMON,
      icon: <Zap size={iconSize} color={iconColor} />,
      title: t("achievements.speedDemon"),
      description: t("achievements.speedDemonDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.PERFECTIONIST,
      icon: <Target size={iconSize} color={iconColor} />,
      title: t("achievements.perfectionist"),
      description: t("achievements.perfectionistDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.MARATHONER,
      icon: <Award size={iconSize} color={iconColor} />,
      title: t("achievements.marathoner"),
      description: t("achievements.marathonerDesc"),
      hasProgress: true,
    },
    {
      id: ACHIEVEMENT_IDS.WEEK_STREAK,
      icon: <Calendar size={iconSize} color={iconColor} />,
      title: t("achievements.weekStreak"),
      description: t("achievements.weekStreakDesc"),
      hasProgress: true,
    },
    {
      id: ACHIEVEMENT_IDS.MONTH_STREAK,
      icon: <Calendar size={iconSize} color={iconColor} />,
      title: t("achievements.monthStreak"),
      description: t("achievements.monthStreakDesc"),
      hasProgress: true,
    },
    {
      id: ACHIEVEMENT_IDS.NUMBER_MASTER,
      icon: <Trophy size={iconSize} color={iconColor} />,
      title: t("achievements.numberMaster"),
      description: t("achievements.numberMasterDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.ALPHABET_MASTER,
      icon: <Trophy size={iconSize} color={iconColor} />,
      title: t("achievements.alphabetMaster"),
      description: t("achievements.alphabetMasterDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.SENTENCE_MASTER,
      icon: <Trophy size={iconSize} color={iconColor} />,
      title: t("achievements.sentenceMaster"),
      description: t("achievements.sentenceMasterDesc"),
      hasProgress: true,
    },
    {
      id: ACHIEVEMENT_IDS.NO_MISTAKE,
      icon: <Target size={iconSize} color={iconColor} />,
      title: t("achievements.noMistake"),
      description: t("achievements.noMistakeDesc"),
      hasProgress: true,
    },
    {
      id: ACHIEVEMENT_IDS.FIND_MASTER,
      icon: <Trophy size={iconSize} color={iconColor} />,
      title: t("achievements.findMaster"),
      description: t("achievements.findMasterDesc"),
    },
    {
      id: ACHIEVEMENT_IDS.SPEED_KING,
      icon: <Zap size={iconSize} color={iconColor} />,
      title: t("achievements.speedKing"),
      description: t("achievements.speedKingDesc"),
      hasProgress: true,
    },
  ];
};

// Achievement card component
const AchievementCard = ({
  def,
  achievement,
  isDarkMode,
}: {
  def: AchievementDef;
  achievement: Achievement | undefined;
  isDarkMode: boolean;
}) => {
  const isUnlocked = achievement?.unlocked || false;
  const progress = achievement?.progress || 0;
  const maxProgress = achievement?.maxProgress || 0;
  const progressPercent = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

  return (
    <View
     
      style={{
        backgroundColor: isDarkMode
          ? "rgba(255, 255, 255, 0.05)"
          : Colors.background.panel,
        borderWidth: isUnlocked ? 2 : 1,
        borderColor: isUnlocked
          ? Colors.primary.default
          : isDarkMode
            ? "rgba(255, 255, 255, 0.1)"
            : Colors.border.ui,
        opacity: isUnlocked ? 1 : 0.6,
      }}
    >
      <View>
        {/* Icon */}
        <View
         
          style={{
            backgroundColor: isUnlocked
              ? Colors.primary.default + "20"
              : isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : Colors.text.muted + "20",
          }}
        >
          {isUnlocked ? (
            def.icon
          ) : (
            <Lock
              size={24}
              color={isDarkMode ? Colors.text.darkSecondary : Colors.text.muted}
            />
          )}
        </View>

        {/* Content */}
        <View>
          <View>
            <Text
             
              style={{
                color: isDarkMode ? Colors.text.dark : Colors.text.primary,
              }}
            >
              {def.title}
            </Text>
            {isUnlocked && (
              <View
               
                style={{ backgroundColor: Colors.primary.default }}
              >
                <Text>
                  {t("achievements.unlocked")}
                </Text>
              </View>
            )}
          </View>
          <Text
           
            style={{
              color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted,
            }}
          >
            {def.description}
          </Text>

          {/* Progress bar */}
          {def.hasProgress && !isUnlocked && maxProgress > 0 && (
            <View>
              <View
               
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : Colors.text.muted + "20",
                }}
              >
                <View
                 
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: Colors.primary.default,
                  }}
                />
              </View>
              <Text
               
                style={{
                  color: isDarkMode
                    ? Colors.text.darkSecondary
                    : Colors.text.muted,
                }}
              >
                {progress} / {maxProgress}
              </Text>
            </View>
          )}

          {/* Unlocked date */}
          {isUnlocked && achievement?.unlockedAt && (
            <Text
             
              style={{
                color: isDarkMode
                  ? Colors.text.darkSecondary
                  : Colors.text.muted,
              }}
            >
              {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default function AchievementsScreen() {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const achievements = useStore((state) => state.achievements);

  const achievementDefs = getAchievementDefs(isDarkMode);

  // Count unlocked achievements
  const unlockedCount = Object.values(achievements).filter((a) => a.unlocked).length;
  const totalCount = achievementDefs.length;

  return (
    <SafeAreaView
     
      style={{
        backgroundColor: isDarkMode
          ? Colors.background.dark
          : Colors.background.light,
      }}
      edges={["top"]}
    >
      {/* Header */}
      <View>
        <Pressable
          onPress={() => router.back()}
         
          style={{
            backgroundColor: isDarkMode
              ? "rgba(255, 255, 255, 0.08)"
              : Colors.background.panel,
          }}
        >
          <ChevronLeft
            size={24}
            color={isDarkMode ? Colors.text.dark : Colors.text.primary}
          />
        </Pressable>
        <Text
         
          style={{ color: isDarkMode ? Colors.text.dark : Colors.text.primary }}
        >
          {t("achievements.title")}
        </Text>
      </View>

      {/* Progress summary */}
      <View>
        <View
         
          style={{
            backgroundColor: Colors.primary.default + "15",
            borderWidth: 1,
            borderColor: Colors.primary.default + "30",
          }}
        >
          <View>
            <View
             
              style={{ backgroundColor: Colors.primary.default }}
            >
              <Trophy size={24} color="#fff" />
            </View>
            <View>
              <Text
               
                style={{ color: isDarkMode ? Colors.text.dark : Colors.text.primary }}
              >
                {unlockedCount} / {totalCount}
              </Text>
              <Text
               
                style={{ color: isDarkMode ? Colors.text.darkSecondary : Colors.text.muted }}
              >
                {t("achievements.unlocked")}
              </Text>
            </View>
          </View>
          <View>
            <Text
             
              style={{ color: Colors.primary.default }}
            >
              {Math.round((unlockedCount / totalCount) * 100)}%
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
       
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {achievementDefs.map((def) => (
          <AchievementCard
            key={def.id}
            def={def}
            achievement={achievements[def.id]}
            isDarkMode={isDarkMode}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
