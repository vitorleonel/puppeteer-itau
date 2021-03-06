const path = require("path");
const chunk = require("lodash/chunk");
const format = require("date-fns/format");

const sleep = require("../utils/sleep");
const beanstalkdService = require("../services/beanstalkd");
const slackService = require("../services/slack");

module.exports = async (page) => {
  await Promise.all([
    page.evaluate(() => {
      let menu = document.querySelector(
        "#main-menu > li:nth-child(2) > ul > li:nth-child(2) > a"
      );
      menu.click();
    }),
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 }),
  ]);

  try {
    await page.click("#botaoFecharCoachmark");
  } catch (error) {}

  await sleep(1000);

  await Promise.all([
    page.click(
      "#extrato-filtro-lancamentos > div > div:nth-child(2) > div:nth-child(1) > fieldset > div > div:nth-child(2) > button"
    ),
    page.waitFor(
      () => {
        let element = document.querySelector("span.extrato-filtros");

        return element && element.innerText.includes("entradas");
      },
      { timeout: 1200000 }
    ),
    sleep(1000),
    page.addScriptTag({
      path: path.join(__dirname, "..", "utils", "extract.js"),
    }),
  ]);

  const normalItems = await page.evaluate(() => window.jsonOut);
  const chunkedItems = chunk(normalItems, 500);

  for (let index = 0; index < chunkedItems.length; index++) {
    await beanstalkdService.send(chunkedItems[index]);
  }

  slackService.files.upload({
    channels: process.env.SLACK_CHANNEL_LOG_ID,
    content: normalItems,
    filename: `itau-${format(new Date(), "yyyMMdd-Hmmss")}`,
    filetype: "javascript",
  });

  await sleep(2000);
};
