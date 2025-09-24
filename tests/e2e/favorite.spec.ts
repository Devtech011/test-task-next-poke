import { test, expect } from '@playwright/test';

test('favorite functionality: add and remove', async ({ page }) => {
    await page.goto('/');

    // Locate the first favorite button
    const firstFavoriteBtn = page.locator('[data-testid="favorite-btn"]').first();

    // Click favorite button for the first item
    await firstFavoriteBtn.click();

    // Check if the aria-label is now "Remove from favorites"
    await expect(firstFavoriteBtn).toHaveAttribute('aria-label', 'Remove from favorites');

    // Click favorite button again to remove
    await firstFavoriteBtn.click();

    // Check if the aria-label is now "Add to favorites"
    await expect(firstFavoriteBtn).toHaveAttribute('aria-label', 'Add to favorites');
});
