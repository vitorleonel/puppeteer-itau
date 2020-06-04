require("dotenv").config();

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const authenticateFunction = require("./functions/authenticate");
const extractFunction = require("./functions/extract");

puppeteer.use(StealthPlugin());

puppeteer
  .launch({ headless: process.env.HEADLESS === "yes", defaultViewport: null })
  .then(async (browser) => {
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 1024 });

    await page.goto("https://www.itau.com.br/empresas", {
      waitUntil: "networkidle0",
    });

    await authenticateFunction(page);
    await extractFunction(page);
  });
