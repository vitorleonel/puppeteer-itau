const sleep = require("../utils/sleep");
const password = process.env.OPERATOR_PASS.split("");

const codeHandler = async (page) => {
  await sleep(1000);

  await page.click("#menuTypeAccess");
  await sleep(1000);

  await page.click("#collapseTypeAccess > li:nth-child(2)");
  await sleep(2000);

  await page.type("#codOp", process.env.OPERATOR_CODE);
  await sleep(1000);

  await Promise.all([
    page.click("#btnLoginSubmit"),
    page.waitForNavigation({ waitUntil: "load", timeout: 30000 }),
  ]);
};

const passwordHandler = async (page) => {
  await sleep(1000);
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

  await page.click("#acessar");
};

const viewHandler = async (page) => {
  await page.waitForSelector(
    "#tipoVisao > ul > li:nth-child(2) > p:nth-child(1) > label",
    { timeout: 60000 }
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
};
