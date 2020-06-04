const path = require("path");
const sleep = require("../utils/sleep");

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

  await page.click("#botaoFecharCoachmark");
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
      { timeout: 60000 }
    ),
    sleep(1000),
    page.addScriptTag({
      path: path.join(__dirname, "..", "utils", "extract.js"),
    }),
  ]);

  const json = await page.evaluate(() => window.jsonOut);

  console.log(json);
};
