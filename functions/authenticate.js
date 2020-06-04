const path = require("path");

const sleep = require("../utils/sleep");
const password = process.env.OPERATOR_PASS.split("");

const codeHandler = async (page) => {
  await sleep(1000);

  await page.click("#menuTypeAccess");
  await sleep(1000);

  await page.click("#collapseTypeAccess > li:nth-child(2)");
  await sleep(1000);

  await page.type("#codOp", process.env.OPERATOR_CODE);
  await sleep(1000);

  await Promise.all([
    page.click("#btnLoginSubmit"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);
};

const passwordHandler = async (page) => {
  await page.waitForSelector("#campoTeclado", { timeout: 30000 });
  await sleep(3000);

  for (let index = 0; index < password.length; index++) {
    const partialPass = password[index];

    await page.evaluate((partialPass) => {
      let passKeys = document.querySelectorAll("#campoTeclado");

      for (let index = 0; index < passKeys.length; index++) {
        let passKey = passKeys[index];

        if (
          !passKey.innerText.includes("ou") ||
          !passKey.innerText.includes(partialPass)
        ) {
          continue;
        }

        passKey.click();
      }
    }, partialPass);
  }

  page.click("#acessar");
};

const viewHandler = async (page) => {
  await sleep(3000);
  await page.waitForSelector(
    "#tipoVisao > ul > li:nth-child(2) > p:nth-child(1) > label",
    { timeout: 30000 }
  );

  await page.click(
    "#tipoVisao > ul > li:nth-child(2) > p:nth-child(1) > label"
  );
  await sleep(1000);

  await Promise.all([
    page.click("#btn-continuar"),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);
};

module.exports = async (page) => {
  await codeHandler(page);

  await passwordHandler(page);

  await viewHandler(page);

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
    page.waitFor(() => {
      let element = document.querySelector("span.extrato-filtros");

      return element && element.innerText.includes("entradas");
    }),
    sleep(1000),
    page.addScriptTag({
      path: path.join(__dirname, "..", "utils", "extract.js"),
    }),
  ]);

  const json = await page.evaluate(() => window.jsonOut);

  console.log(json);
};
