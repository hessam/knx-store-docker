/**
 * Utility functions for formatting data from WordPress and WooCommerce APIs
 */

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Format WordPress content by stripping HTML and truncating
 */
export function formatWordPressContent(content: string, maxLength?: number): string {
  if (!content) return '';
  
  // Strip HTML tags
  let formatted = stripHtml(content);
  
  // Decode HTML entities
  formatted = decodeHtmlEntities(formatted);
  
  // Truncate if maxLength is specified
  if (maxLength) {
    formatted = truncateText(formatted, maxLength);
  }
  
  return formatted.trim();
}

/**
 * Decode HTML entities
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&hellip;': '...',
    '&mdash;': '—',
    '&ndash;': '–',
  };
  
  return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    return entities[entity] || entity;
  });
}

/**
 * Format price with currency
 */
export function formatPrice(price: string | number, currency: string = 'USD'): string {
  if (!price) return '';
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return '';
  
  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };
  
  const symbol = currencySymbols[currency] || currency;
  
  return `${symbol}${numPrice.toFixed(2)}`;
}

/**
 * Format date to a readable format
 */
export function formatDate(dateString: string, format: 'short' | 'long' | 'relative' = 'short'): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return '';
  
  switch (format) {
    case 'long':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    case 'relative':
      return getRelativeTimeString(date);
    
    case 'short':
    default:
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
}

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 */
function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Extract the first image URL from WordPress content
 */
export function extractFirstImage(content: string): string | null {
  if (!content) return null;
  
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
  return imgMatch ? imgMatch[1] : null;
}

/**
 * Extract the first image from an array of image objects
 */
export function extractFirstImageFromArray(images: Array<{ src: string; alt: string }>): { src: string; alt: string } | null {
  if (!images || images.length === 0) return null;
  return images[0];
}

/**
 * Extract all image URLs from WordPress content
 */
export function extractAllImages(content: string): string[] {
  if (!content) return [];
  
  const imgMatches = content.match(/<img[^>]+src="([^"]+)"/gi);
  if (!imgMatches) return [];
  
  return imgMatches.map(match => {
    const srcMatch = match.match(/src="([^"]+)"/i);
    return srcMatch ? srcMatch[1] : '';
  }).filter(Boolean);
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Generate a random ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Sanitize a string for use in HTML attributes
 */
export function sanitizeAttribute(value: string): string {
  if (!value) return '';
  
  return value
    .replace(/[<>"']/g, '') // Remove potentially dangerous characters
    .trim();
} 