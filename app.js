require("dotenv").config();

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const authenticateFunction = require("./functions/authenticate");

puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: false }).then(async (browser) => {
  const page = await browser.newPage();

  await page.goto("https://www.itau.com.br/empresas", {
    waitUntil: "networkidle0",
  });

  await authenticateFunction(page);
});
