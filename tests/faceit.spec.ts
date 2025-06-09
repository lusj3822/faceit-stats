import { test, expect } from '@playwright/test';

test.describe('Faceit Statistics Website', () => {
  test('should load the home page correctly', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    
    await expect(page).toHaveURL('http://localhost:4200/');
    
    const searchInput = page.getByPlaceholder('Eg. s1mple');
    await expect(searchInput).toBeVisible();
    
    await expect(searchInput).toHaveValue('');
  });

  test('should search for s1mple and display their stats', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    
    const searchInput = page.getByPlaceholder('Eg. s1mple');
    await searchInput.fill('s1mple');
    
    await searchInput.press('Enter');
    
    await expect(page).toHaveURL('http://localhost:4200/stats?username=s1mple');
    
    await expect(page.locator('.stats-grid')).toBeVisible({ timeout: 10000 });
    
    await expect(page.locator('.username')).toHaveText('s1mple');
    
    await expect(page.locator('.card')).toHaveCount(4);
  });

  test('should handle invalid player search', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    
    const searchInput = page.getByPlaceholder('Eg. s1mple');
    await searchInput.fill('nonExistentPlayer123');
    await searchInput.press('Enter');
    
    await expect(page).toHaveURL('http://localhost:4200/');
    
    await expect(page.locator('.error-message')).toBeVisible();
  });

  test('should display navbar and allow navigation', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    
    await expect(page.locator('.navbar')).toBeVisible();
    
    const navbarTitle = page.locator('.navbar-title');
    await expect(navbarTitle).toBeVisible();
    await expect(navbarTitle).toHaveText('Faceit Stats');
    
    await navbarTitle.click();
    await expect(page).toHaveURL('http://localhost:4200/');
  });

  test('should display player info card with correct elements', async ({ page }) => {
    await page.goto('http://localhost:4200/stats?username=s1mple');
    
    await expect(page.locator('.player-info-card')).toBeVisible();
    await expect(page.locator('.avatar-container')).toBeVisible();
    await expect(page.locator('.avatar-image')).toBeVisible();
    await expect(page.locator('.player-details')).toBeVisible();
  });

  test('should display stat cards with correct information', async ({ page }) => {
    await page.goto('http://localhost:4200/stats?username=s1mple');
    
    await expect(page.locator('.stats-grid')).toBeVisible({ timeout: 10000 });
    
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(4);

    const card1 = cards.nth(0);
    const card2 = cards.nth(1);
    const card3 = cards.nth(2);
    const card4 = cards.nth(3);
    
    await expect(card1.locator('.heading')).toBeVisible();
    await expect(card1.locator('.main-stat')).toBeVisible();
    await expect(card1.locator('.sub-stats')).toBeVisible();

    await expect(card2.locator('.heading')).toBeVisible();
    await expect(card2.locator('.main-stat')).toBeVisible();

    await expect(card3.locator('.heading')).toBeVisible();
    await expect(card3.locator('.main-stat')).toBeVisible();
    await expect(card3.locator('.sub-stats')).toBeVisible();

    await expect(card4.locator('.heading')).toBeVisible();
    await expect(card4.locator('.main-stat')).toBeVisible();
    await expect(card4.locator('.sub-stats')).toBeVisible();
  });

  
  test('should display K/D chart when game data is available', async ({ page }) => {
    await page.goto('http://localhost:4200/stats?username=s1mple');
    
    await expect(page.locator('.kd-chart-container')).toBeVisible({ timeout: 10000 });
    
    await expect(page.locator('.kd-chart-container h2')).toHaveText('K/D Ratio (Last 20 Games)');
  });
    
  test('should handle search input styling', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    
    const searchInput = page.getByPlaceholder('Eg. s1mple');
    
    await expect(searchInput).not.toHaveClass("search-input ng-untouched ng-valid ng-dirty input-error");
    
    await searchInput.fill('nonExistentPlayer123');
    await searchInput.press('Enter');
    
    await expect(searchInput).toHaveClass("search-input ng-untouched ng-valid ng-dirty input-error");
  });
  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.container')).toBeVisible();
    await expect(page.locator('.search-box')).toBeVisible();
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.container')).toBeVisible();
    await expect(page.locator('.search-box')).toBeVisible();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('.container')).toBeVisible();
    await expect(page.locator('.search-box')).toBeVisible();
  });
});
