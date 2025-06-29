import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import pt from "./locales/pt.json";

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

const languageSelected = JSON.parse(localStorage.getItem("language") ?? '"pt"');

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: languageSelected,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
