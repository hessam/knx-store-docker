// URL utility functions for consistent routing

export function getLocalizedUrl(path: string, lang: string = 'en'): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If it's already a localized path, return as is
  if (cleanPath.match(/^(en|de|ar)\//)) {
    return `/${cleanPath}`;
  }
  
  // For English, don't add language prefix
  if (lang === 'en') {
    return `/${cleanPath}`;
  }
  
  // For other languages, add language prefix
  return `/${lang}/${cleanPath}`;
}

export function getProductUrl(lang: string = 'en'): string {
  return getLocalizedUrl('products/catalog-optimized', lang);
}

export function getCheckoutUrl(lang: string = 'en'): string {
  return getLocalizedUrl('checkout', lang);
}

export function getLoginUrl(lang: string = 'en'): string {
  return getLocalizedUrl('login', lang);
}

export function getAccountUrl(lang: string = 'en'): string {
  return getLocalizedUrl('account', lang);
}

export function getContactUrl(lang: string = 'en'): string {
  return getLocalizedUrl('contact', lang);
}

export function getHomeUrl(lang: string = 'en'): string {
  return lang === 'en' ? '/' : `/${lang}/`;
}
