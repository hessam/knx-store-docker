import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

// Translation interface
export interface Translations {
  [key: string]: string;
}

// Load translations for a specific language
export function loadTranslations(lang: string): Translations {
  try {
    // Load default translations
    const defaultPath = path.join(process.cwd(), 'src', 'i18n', `${lang}.json`);
    const defaultTranslations: Translations = fs.existsSync(defaultPath) 
      ? JSON.parse(fs.readFileSync(defaultPath, 'utf8'))
      : {};

    // Load custom translations (overrides)
    const customPath = path.join(process.cwd(), 'src', 'i18n', 'custom', `${lang}.json`);
    const customTranslations: Translations = fs.existsSync(customPath)
      ? JSON.parse(fs.readFileSync(customPath, 'utf8'))
      : {};

    // Merge default with custom (custom takes precedence)
    return { ...defaultTranslations, ...customTranslations };
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    return {};
  }
}

// Get translation with fallback
export function t(lang: string, key: string, fallback?: string): string {
  const translations = loadTranslations(lang);
  return translations[key] || fallback || key;
}

// Save custom translation
export function saveCustomTranslation(lang: string, key: string, value: string): boolean {
  try {
    const customDir = path.join(process.cwd(), 'src', 'i18n', 'custom');
    
    // Ensure custom directory exists
    if (!fs.existsSync(customDir)) {
      fs.mkdirSync(customDir, { recursive: true });
    }

    const customPath = path.join(customDir, `${lang}.json`);
    
    // Load existing custom translations
    const existingTranslations: Translations = fs.existsSync(customPath)
      ? JSON.parse(fs.readFileSync(customPath, 'utf8'))
      : {};

    // Add/update translation
    existingTranslations[key] = value;

    // Save back to file
    fs.writeFileSync(customPath, JSON.stringify(existingTranslations, null, 2));
    
    return true;
  } catch (error) {
    console.error(`Error saving custom translation for ${lang}:`, error);
    return false;
  }
}

// Get all available languages
export function getAvailableLanguages(): string[] {
  const i18nDir = path.join(process.cwd(), 'src', 'i18n');
  if (!fs.existsSync(i18nDir)) return ['en'];

  const files = fs.readdirSync(i18nDir);
  return files
    .filter(file => file.endsWith('.json') && file !== 'custom')
    .map(file => file.replace('.json', ''));
}

// Validate language code
export function isValidLanguage(lang: string): boolean {
  const validLanguages = ['en', 'de', 'ar'];
  return validLanguages.includes(lang);
}

// Get language name
export function getLanguageName(lang: string): string {
  const languageNames: { [key: string]: string } = {
    en: 'English',
    de: 'Deutsch',
    ar: 'العربية'
  };
  return languageNames[lang] || lang;
}

// Get language direction (for RTL support)
export function getLanguageDirection(lang: string): 'ltr' | 'rtl' {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
} 