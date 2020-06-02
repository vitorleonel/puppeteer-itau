const puppeteer = require("puppeteer");

const operator = process.argv.pop();
const password = process.argv.pop().split("");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1980, height: 960 });

  await page.goto("https://www.itau.com.br", { waitUntil: "networkidle2" });

  await page.click("#menuTypeAccess");
  await page.click("#collapseTypeAccess > li:nth-child(2)");

  await page.type("#codOp", operator);
  await page.waitFor(2000);
  await page.click("#btnLoginSubmit");

  await page.waitForSelector("#campoTeclado", { timeout: 30000 });

  await page.waitFor(5000);

  for (let index = 0; index < password.length; index++) {
    const partialPass = password[index];

    await page.evaluate((partialPass) => {
      let passKeys = document.querySelectorAll("#campoTeclado");

      for (let index = 0; index < passKeys.length; index++) {
        let passKey = passKeys[index];

        if (passKey.innerText.includes(partialPass)) {
          passKey.click();
        }
      }
    }, partialPass);
  }

  await page.click("#acessar");

  await page.waitForSelector("#rdBasico", { timeout: 60000 });
  await page.click("#rdBasico");
  await page.waitFor(2000);
  await page.click("#btn-continuar");

  console.log(await page.title(), "nois que vooaaaaa");
})();
