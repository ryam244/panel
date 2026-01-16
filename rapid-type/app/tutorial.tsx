/**
 * Tutorial Screen - Mojic
 * First-time user onboarding with swipeable cards (simplified without reanimated)
 */

import { useState, useRef } from "react";
import { View, Text, Pressable, Dimensions, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Target,
  Zap,
  Trophy,
  AlertCircle,
} from "lucide-react-native";
import { Colors } from "../src/constants";
import { t } from "../src/i18n";
import { useStore } from "../src/store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TutorialSlide {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  color: string;
}

const slides: TutorialSlide[] = [
  {
    id: "1",
    icon: <Target size={64} color={Colors.primary.default} strokeWidth={2} />,
    titleKey: "tutorial.slide1Title",
    descKey: "tutorial.slide1Desc",
    color: Colors.primary.default,
  },
  {
    id: "2",
    icon: <Zap size={64} color={Colors.semantic.warning} strokeWidth={2} />,
    titleKey: "tutorial.slide2Title",
    descKey: "tutorial.slide2Desc",
    color: Colors.semantic.warning,
  },
  {
    id: "3",
    icon: <Trophy size={64} color={Colors.rank.S} strokeWidth={2} />,
    titleKey: "tutorial.slide3Title",
    descKey: "tutorial.slide3Desc",
    color: Colors.rank.S,
  },
  {
    id: "4",
    icon: <AlertCircle size={64} color={Colors.semantic.error} strokeWidth={2} />,
    titleKey: "tutorial.slide4Title",
    descKey: "tutorial.slide4Desc",
    color: Colors.semantic.error,
  },
];

const SlideItem = ({
  item,
}: {
  item: TutorialSlide;
}) => {
  return (
    <View style={styles.slideContainer}>
      <View style={styles.slideContent}>
        {/* Icon Container */}
        <View style={[styles.iconContainer, { backgroundColor: item.color + "15" }]}>
          {item.icon}
        </View>

        {/* Title */}
        <Text style={styles.slideTitle}>
          {t(item.titleKey)}
        </Text>

        {/* Description */}
        <Text style={styles.slideDesc}>
          {t(item.descKey)}
        </Text>
      </View>
    </View>
  );
};

const Pagination = ({
  currentIndex,
  totalSlides,
}: {
  currentIndex: number;
  totalSlides: number;
}) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              width: index === currentIndex ? 24 : 8,
              opacity: index === currentIndex ? 1 : 0.3,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default function TutorialScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const setHasSeenTutorial = useStore((state) => state.setHasSeenTutorial);

  const handleSkip = () => {
    setHasSeenTutorial(true);
    router.replace("/");
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleSkip();
    }
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>
            {t("tutorial.skip")}
          </Text>
        </Pressable>
      </View>

      {/* Slides */}
      <View style={styles.slidesContainer}>
        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / SCREEN_WIDTH
            );
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => <SlideItem item={item} />}
        />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination */}
        <View style={styles.paginationWrapper}>
          <Pagination currentIndex={currentIndex} totalSlides={slides.length} />
        </View>

        {/* Next/Done Button */}
        <Pressable onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {isLastSlide ? t("tutorial.done") : t("tutorial.next")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  skipContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.text.muted + "20",
  },
  skipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.muted,
  },
  slidesContainer: {
    flex: 1,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: Colors.text.primary,
  },
  slideDesc: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: Colors.text.secondary,
    paddingHorizontal: 16,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  paginationWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.default,
  },
  nextButton: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary.default,
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
