/**
 * i18n Configuration - Mojic
 * Supports Japanese and English
 */

import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { en } from "./en";
import { ja } from "./ja";

// Create i18n instance
const i18n = new I18n({
  en,
  ja,
});

// Set default locale based on device settings
i18n.locale = Localization.getLocales()[0]?.languageCode ?? "en";

// Enable fallback to English
i18n.enableFallback = true;
i18n.defaultLocale = "en";

// Helper function to change locale
export const setLocale = (locale: "en" | "ja") => {
  i18n.locale = locale;
};

// Helper function to get current locale
export const getLocale = (): string => {
  return i18n.locale;
};

// Helper function to check if current locale is Japanese
export const isJapanese = (): boolean => {
  return i18n.locale.startsWith("ja");
};

// Translation function with type safety
export const t = (
  key: string,
  options?: Record<string, string | number>
): string => {
  return i18n.t(key, options);
};

export { i18n };
export default i18n;
