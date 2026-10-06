import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should mock the API and display tenant configurations on the screen", async ({
    page,
  }) => {
    // 1. Intercept the tenant configuration request
    await page.route("**/api/tenant/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          slug: "shop-a",
          hasOrderHistory: true,
          hasDeliveryProcessing: false,
        }),
      });
    });

    // 2. Intercept the network health cluster route
    await page.route("**/health", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          env: "local",
          status: "healthy",
          database: "connected",
          timestamp: "2026-10-06 05:23:00",
        }),
      });
    });

    // 3. Open the landing page
    await page.goto("/");

    // 4. Assert the core application layout heading
    const heading = page.getByRole("heading", {
      name: "Platform Control Center",
    });
    await expect(heading).toBeVisible();

    // 5. Verify the visual Tailwind components read data values correctly
    await expect(page.locator("body")).toContainText("shop-a");
    await expect(page.locator("body")).toContainText("healthy");
    await expect(page.locator("body")).toContainText("connected");
  });
});
