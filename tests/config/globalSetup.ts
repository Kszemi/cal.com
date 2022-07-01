import { loadEnvConfig } from "@next/env";
import { Browser, chromium } from "@playwright/test";
import fs from "fs";

//FIXME: Remove once these environment variables are updated in GH secrets.
process.env.ZOOM_CLIENT_ID = "ZOOM_CLIENT_ID";
process.env.ZOOM_CLIENT_SECRET = "ZOOM_CLIENT_SECRET";
async function loginAsUser(username: string, browser: Browser) {
  // Skip is file exists
  if (fs.existsSync(`playwright/artifacts/${username}StorageState.json`)) return;
  const page = await browser.newPage();
  await page.goto(`${process.env.PLAYWRIGHT_TEST_BASE_URL}/auth/login`);
  // Click input[name="email"]
  await page.click('input[name="email"]');
  // Fill input[name="email"]
  await page.fill('input[name="email"]', `${username}@example.com`);
  // Press Tab
  await page.press('input[name="email"]', "Tab");
  // Fill input[name="password"]
  await page.fill('input[name="password"]', username);
  // Press Enter
  await page.press('input[name="password"]', "Enter");
  await page.waitForSelector(
    username === "onboarding" ? "[data-testid=onboarding]" : "[data-testid=dashboard-shell]"
  );
  // Save signed-in state to '${username}StorageState.json'.
  await page.context().storageState({ path: `playwright/artifacts/${username}StorageState.json` });
  await page.context().close();
}

async function globalSetup(/* config: FullConfig */) {
  loadEnvConfig(process.env.PWD);
  const browser = await chromium.launch();

  await loginAsUser("onboarding", browser);
  //   await loginAsUser("free-first-hidden", browser);
  await loginAsUser("pro", browser);
  await loginAsUser("trial", browser);
  await loginAsUser("free", browser);
  //   await loginAsUser("usa", browser);
  //   await loginAsUser("teamfree", browser);
  await loginAsUser("teampro", browser);
  await browser.close();
}

export default globalSetup;
