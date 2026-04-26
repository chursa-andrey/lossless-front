import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

import { en } from '@/i18n/resources/en';
import { ru } from '@/i18n/resources/ru';

const SUPPORTED_LANGUAGES = ['ru', 'en'] as const;

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const DEV_LANGUAGE_OVERRIDE: SupportedLanguage | null = 'en';

function resolveInitialLanguage(): SupportedLanguage {
  if (__DEV__ && DEV_LANGUAGE_OVERRIDE) {
    return DEV_LANGUAGE_OVERRIDE;
  }

  const locales = getLocales();

  for (const locale of locales) {
    const languageCode = locale.languageCode.toLowerCase();

    if (languageCode === 'ru') {
      return 'ru';
    }

    if (languageCode === 'en') {
      return 'en';
    }
  }

  return 'en';
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en,
      ru,
    },
    lng: resolveInitialLanguage(),
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
