require("dotenv").config();

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const authenticateFunction = require("./functions/authenticate");
const extractFunction = require("./functions/extract");

const slackService = require("./services/slack");

puppeteer.use(StealthPlugin());

(async () => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: process.env.HEADLESS === "yes",
      defaultViewport: { width: 1280, height: 1024 },
      args: ["--no-sandbox"],
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.goto("https://www.itau.com.br/empresas", {
      waitUntil: "networkidle0",
    });

    await authenticateFunction(page);
    await extractFunction(page);
  } catch (error) {
    if (process.env.SLACK_TOKEN) {
      slackService.chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ALERT_ID,
        text: `Algo de errado aconteceu:\n\n*Message:*\n${error.message}\n*Stack Trace:* ${error.stack}`,
        username: "Puppeteer - Itaú",
      });
    }
  }

  browser && (await browser.close());
})();
