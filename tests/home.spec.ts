import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should mock the API and display tenant configurations on the screen", async ({
    page,
  }) => {
    // 1. Intercept the network request and return the exact structure your backend sends
    await page.route("**/api/tenant/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          env: "local",
          status: "healthy",
          database: "connected",
          timestamp: "2026-10-06 05:23:00", // A mock representation of SELECT NOW()
        }),
      });
    });

    // 2. Open the frontend homepage
    await page.goto("/");

    // 3. Confirm the heading renders correctly
    const heading = page.getByRole("heading", { name: "Platform" });
    await expect(heading).toBeVisible();

    // 4. Verify that the pre block successfully prints the backend properties
    const preBlock = page.locator("pre");
    await expect(preBlock).toContainText('"ok": true');
    await expect(preBlock).toContainText('"status": "healthy"');
    await expect(preBlock).toContainText('"database": "connected"');
  });
});
