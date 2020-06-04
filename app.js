require("dotenv").config();

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const authenticateFunction = require("./functions/authenticate");
const extractFunction = require("./functions/extract");

puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: false }).then(async (browser) => {
  const page = await browser.newPage();

  await page.goto("https://www.itau.com.br/empresas", {
    waitUntil: "networkidle2",
  });

  await authenticateFunction(page);
  await extractFunction(page);
});
