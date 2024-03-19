import { expect, test } from "./baseFixtures.js";

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/');  
  await expect(page.getByTestId("upload")).toHaveText('Trip Upload');
})


test('visits the app about url', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('h1')).toHaveText('This is an about page');
})
