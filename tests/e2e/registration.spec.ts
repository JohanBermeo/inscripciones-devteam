import { test, expect } from '@playwright/test';

test.describe('Registration Form', () => {
  test('shows the form with all required fields', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Formulario de Inscripción');
    await expect(page.locator('#fullName')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#availabilityHours')).toBeVisible();
    await expect(page.locator('#specialtyArea')).toBeVisible();
    await expect(page.locator('#currentSemester')).toBeVisible();
    await expect(page.locator('#motivation')).toBeVisible();
    await expect(page.locator('#linkedinUrl')).toBeVisible();
    await expect(page.locator('#githubUrl')).toBeVisible();
    await expect(page.locator('#discordUsername')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('shows validation errors for empty required fields', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[type="submit"]').click();

    const errorCount = await page.locator('[aria-invalid="true"]').count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('shows email validation error for non-udistrital email', async ({ page }) => {
    await page.goto('/');
    await page.locator('#email').fill('user@gmail.com');
    await page.locator('button[type="submit"]').click();

    const emailError = page.locator('#email-error.visible');
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText('@udistrital');
  });

  test('displays closed message after deadline', async ({ page }) => {
    await page.clock.install({ time: new Date('2025-08-10T00:00:00-05:00') });
    await page.goto('/');

    await expect(page.locator('.closed-message')).toBeVisible();
    await expect(page.locator('.closed-message')).toContainText('Inscripciones Cerradas');
    await expect(page.locator('#registration-form')).not.toBeVisible();
  });

  test('accepts valid optional URLs', async ({ page }) => {
    await page.goto('/');

    await page.locator('#linkedinUrl').fill('https://linkedin.com/in/testuser');
    await page.locator('#githubUrl').fill('https://github.com/testuser');

    const linkedinError = page.locator('#linkedinUrl-error.visible');
    const githubError = page.locator('#githubUrl-error.visible');

    await expect(linkedinError).not.toBeVisible();
    await expect(githubError).not.toBeVisible();
  });
});
