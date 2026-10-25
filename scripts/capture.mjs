import { createRequire } from "node:module";
import { readFileSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { performance } from "node:perf_hooks";

const runtime = join(process.env.HOME, ".local/share/omgithub-playwright");
const runtimeScripts = join(process.env.RUNTIME_DIR || "/home/runner/work/_temp/omgithub-runtime", "scripts");
const require = createRequire(join(runtime, "package.json"));
const { chromium } = require("playwright");

try {
  require(join(runtimeScripts, "wip-screenshots.cjs")).instrument({ chromium });
} catch (error) {
  console.warn("WIP screenshot instrumentation unavailable:", error.message);
}

const configPath = join(runtime, process.platform === "darwin" ? "metal.json" : "linux.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
if (process.platform === "linux" && !process.env.DISPLAY) {
  process.env.DISPLAY = ":" + readFileSync(join(runtime, "display"), "utf8").trim();
}

const url = process.env.CAPTURE_URL;
const output = process.env.CAPTURE_DIR;

function defect(message, cause) {
  const error = new Error(message);
  error.exitCode = 1;
  if (cause) error.cause = cause;
  return error;
}

function transient(message, cause) {
  const error = new Error(message);
  error.exitCode = 75;
  if (cause) error.cause = cause;
  return error;
}

async function main() {
  if (!url || !output) throw defect("Set CAPTURE_URL and CAPTURE_DIR.");
  mkdirSync(output, { recursive: true });

  const totalStart = performance.now();
  let browser;

  try {
    browser = await chromium.launch({ ...config.browser.launchOptions, timeout: 30000 }).catch((error) => {
      throw transient("Browser launch failed: " + error.message, error);
    });

    const views = [
      { name: "desktop", width: 1440, height: 900, isMobile: false, hasTouch: false },
      { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true }
    ];

    for (const view of views) {
      const viewStart = performance.now();
      const page = await browser.newPage({
        viewport: { width: view.width, height: view.height },
        deviceScaleFactor: 1,
        isMobile: view.isMobile,
        hasTouch: view.hasTouch
      }).catch((error) => {
        throw transient("Could not open " + view.name + " page: " + error.message, error);
      });

      page.setDefaultTimeout(30000);
      page.setDefaultNavigationTimeout(45000);
      page.on("pageerror", (error) => console.error("[" + view.name + "] page error:", error.message));
      page.on("console", (message) => {
        if (message.type() === "error") console.error("[" + view.name + "] console:", message.text());
      });

      let response;
      try {
        response = await page.goto(url, { waitUntil: "load", timeout: 45000 });
      } catch (error) {
        throw transient("Navigation failed for " + view.name + ": " + error.message, error);
      }

      if (!response) throw transient("No response while loading " + view.name + ".");
      if (!response.ok()) {
        const code = [408, 429, 500, 502, 503, 504].includes(response.status()) ? 75 : 1;
        throw (code === 75 ? transient : defect)("HTTP " + response.status() + " while loading " + view.name + ".");
      }

      try {
        await page.waitForFunction(
          () => document.documentElement.dataset.appReady === "true",
          null,
          { timeout: 20000 }
        );
        await page.locator("#welcome h1").waitFor({ state: "visible", timeout: 10000 });
        await page.waitForFunction(
          () => document.fonts.status === "loaded",
          null,
          { timeout: 10000 }
        );
      } catch (error) {
        throw defect("Rendered content was not ready for " + view.name + ": " + error.message, error);
      }

      await page.waitForTimeout(700);

      const file = join(output, "final-" + view.name + ".png");
      try {
        await page.screenshot({ path: file, type: "png", timeout: 30000 });
      } catch (error) {
        if (error.name === "TimeoutError" || !browser.isConnected()) {
          throw transient("Screenshot failed for " + view.name + ": " + error.message, error);
        }
        throw defect("Screenshot failed for " + view.name + ": " + error.message, error);
      }

      const size = statSync(file).size;
      if (size < 2000) throw defect("Screenshot for " + view.name + " looks empty (" + size + " bytes).");

      console.log(
        "Captured " + view.name + " in " + Math.round(performance.now() - viewStart) +
        "ms -> " + file + " (" + size + " bytes)"
      );

      await page.close().catch((error) => {
        throw transient("Could not close " + view.name + " page: " + error.message, error);
      });
    }

    console.log("capture.mjs: total " + Math.round(performance.now() - totalStart) + "ms");
  } finally {
    if (browser) {
      await browser.close().catch((error) => {
        console.error("Browser close failed:", error.message);
        process.exitCode ||= 75;
      });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = error.exitCode || 1;
});
