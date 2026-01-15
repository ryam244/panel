/**
 * Ad Manager - Mojic
 * Google Mobile Ads integration with test ads
 *
 * App ID: ca-app-pub-6258470133022211~6887279803
 *
 * In test mode, ads are simulated with delays.
 * In production mode, real AdMob ads would be shown.
 */

// Test mode flag - set to false for production
const IS_TEST_MODE = true;

// Simulated ad state
let isInitialized = false;
let interstitialReady = false;
let rewardedReady = false;

/**
 * Initialize the ad SDK
 */
export async function initializeAds(): Promise<void> {
  if (isInitialized) return;

  if (IS_TEST_MODE) {
    // Simulate initialization delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    isInitialized = true;
    console.log("[Ads] Initialized in test mode");

    // Start loading mock ads
    loadMockInterstitial();
    loadMockRewarded();
    return;
  }

  // Production initialization would go here
  // import mobileAds from 'react-native-google-mobile-ads';
  // await mobileAds().initialize();
  isInitialized = true;
}

/**
 * Load mock interstitial ad (test mode)
 */
function loadMockInterstitial(): void {
  if (!IS_TEST_MODE) return;

  interstitialReady = false;
  // Simulate ad load delay
  setTimeout(() => {
    interstitialReady = true;
    console.log("[Ads] Mock interstitial ready");
  }, 2000);
}

/**
 * Load mock rewarded ad (test mode)
 */
function loadMockRewarded(): void {
  if (!IS_TEST_MODE) return;

  rewardedReady = false;
  // Simulate ad load delay
  setTimeout(() => {
    rewardedReady = true;
    console.log("[Ads] Mock rewarded ad ready");
  }, 2500);
}

/**
 * Show interstitial ad
 * @returns true if ad was shown, false if not ready
 */
export async function showInterstitialAd(): Promise<boolean> {
  if (!isInitialized || !interstitialReady) {
    console.log("[Ads] Interstitial not ready");
    return false;
  }

  if (IS_TEST_MODE) {
    console.log("[Ads] Showing mock interstitial...");
    // Simulate ad display time
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("[Ads] Mock interstitial closed");
    interstitialReady = false;
    // Reload for next time
    loadMockInterstitial();
    return true;
  }

  // Production interstitial would be shown here
  return false;
}

/**
 * Show rewarded ad
 * @param onReward - Callback when user completes watching
 * @returns true if ad was shown, false if not ready
 */
export async function showRewardedAd(onReward?: () => void): Promise<boolean> {
  if (!isInitialized || !rewardedReady) {
    console.log("[Ads] Rewarded ad not ready");
    return false;
  }

  if (IS_TEST_MODE) {
    console.log("[Ads] Showing mock rewarded ad...");
    // Simulate ad watch time
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("[Ads] Mock rewarded ad completed - granting reward");

    // Call reward callback
    if (onReward) {
      onReward();
    }

    rewardedReady = false;
    // Reload for next time
    loadMockRewarded();
    return true;
  }

  // Production rewarded ad would be shown here
  return false;
}

/**
 * Check if interstitial is ready to show
 */
export function isInterstitialReady(): boolean {
  return interstitialReady;
}

/**
 * Check if rewarded ad is ready to show
 */
export function isRewardedReady(): boolean {
  return rewardedReady;
}

/**
 * Create ad managers (call after initialization)
 */
export function createAdManagers(): void {
  if (!isInitialized) {
    console.warn("[Ads] Cannot create managers before initialization");
    return;
  }
  // In test mode, ads are already being loaded
}

/**
 * Ad Manager singleton export
 */
export const AdManager = {
  initialize: initializeAds,
  createManagers: createAdManagers,
  showInterstitial: showInterstitialAd,
  showRewarded: showRewardedAd,
  isInterstitialReady,
  isRewardedReady,
  isTestMode: IS_TEST_MODE,
  appId: "ca-app-pub-6258470133022211~6887279803",
};

export default AdManager;
