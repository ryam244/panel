/**
 * useAds Hook - Mojic
 * Convenient hook for using ads in React components
 */

import { useEffect, useState, useCallback } from "react";
import {
  AdManager,
  initializeAds,
  showInterstitialAd,
  showRewardedAd,
  isInterstitialReady,
  isRewardedReady,
  createAdManagers,
} from "../lib/ads";

/**
 * Hook for managing ads in the app
 * Provides methods to show ads and check availability
 */
export function useAds() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [interstitialReady, setInterstitialReady] = useState(false);
  const [rewardedReady, setRewardedReady] = useState(false);

  // Initialize ads on mount
  useEffect(() => {
    const init = async () => {
      await initializeAds();
      createAdManagers();
      setIsInitialized(true);
    };
    init();
  }, []);

  // Poll for ad readiness (simple approach)
  useEffect(() => {
    if (!isInitialized) return;

    const checkReadiness = () => {
      setInterstitialReady(isInterstitialReady());
      setRewardedReady(isRewardedReady());
    };

    // Check immediately
    checkReadiness();

    // Poll every 2 seconds
    const interval = setInterval(checkReadiness, 2000);

    return () => clearInterval(interval);
  }, [isInitialized]);

  // Show interstitial ad
  const showInterstitial = useCallback(async () => {
    return showInterstitialAd();
  }, []);

  // Show rewarded ad with callback
  const showRewarded = useCallback(async (onReward?: () => void) => {
    return showRewardedAd(onReward);
  }, []);

  return {
    isInitialized,
    interstitialReady,
    rewardedReady,
    showInterstitial,
    showRewarded,
    isTestMode: AdManager.isTestMode,
  };
}

export default useAds;
