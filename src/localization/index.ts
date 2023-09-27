import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

export const translations = {
  en: require("./translations/en.json"),
  de: require("./translations/de.json"),
};

export const useI18n = () => {
  const i18n = new I18n(translations);
  i18n.locale = Localization.locale;
  i18n.enableFallback = true;
  i18n.defaultLocale = "en";

  return { i18n };
};
