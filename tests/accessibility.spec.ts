import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('Homepage accessibility', async ({ page }) => {
    await page.goto('http://localhost:4001/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    // Log violations for debugging
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations);
    }
    
    expect(results.violations).toEqual([]); // No accessibility violations
  });

  test('Products test page accessibility', async ({ page }) => {
    await page.goto('http://localhost:4001/products/test');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    // Log violations for debugging
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations);
    }
    
    expect(results.violations).toEqual([]); // No accessibility violations
  });

  test('Storybook accessibility', async ({ page }) => {
    await page.goto('http://localhost:6006/');
    
    // Wait for Storybook to load
    await page.waitForLoadState('networkidle');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    // Log violations for debugging
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations);
    }
    
    expect(results.violations).toEqual([]); // No accessibility violations
  });
}); 