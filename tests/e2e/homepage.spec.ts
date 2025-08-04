import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads
    await expect(page).toHaveTitle(/KNX Store/);
    
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for hero section
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for catalog link
    await expect(page.locator('a[href*="catalog"]')).toBeVisible();
  });

  test('should navigate to catalog page', async ({ page }) => {
    await page.goto('/');
    
    // Click on catalog link
    await page.click('a[href*="catalog"]');
    
    // Should navigate to catalog page
    await expect(page).toHaveURL(/.*catalog/);
    
    // Check for product grid
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /KNX/);
    
    // Check Open Graph tags
    await expect(page.locator('meta[property="og:title"]')).toBeVisible();
    await expect(page.locator('meta[property="og:description"]')).toBeVisible();
    
    // Check Twitter Card tags
    await expect(page.locator('meta[name="twitter:card"]')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label]')).toBeVisible();
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu is accessible
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Check if content is properly responsive
    await expect(page.locator('main')).toBeVisible();
  });
}); 