import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should mock the API and display tenant configurations on the screen", async ({
    page,
  }) => {
    // 1. Intercept the network request and return fake data
    await page.route("/api/tenant/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ theme: "blue", name: "Shop A Configurations" }),
      });
    });

    // 2. Go to the home page (uses http://localhost:3000 from your config base URL)
    await page.goto("/");

    // 3. Check if the heading text "Platform" is visible
    const heading = page.getByRole("heading", { name: "Platform" });
    await expect(heading).toBeVisible();

    // 4. Check if the fake API data successfully rendered inside the <pre> block
    const preBlock = page.locator("pre");
    await expect(preBlock).toContainText("Shop A Configurations");
    await expect(preBlock).toContainText("blue");
  });
});
