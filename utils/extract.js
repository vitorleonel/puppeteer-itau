window.jsonOut = [];

let tr = document.querySelector("#corpoTabela-gridLancamentos");
let year = new Date().getFullYear();
let months = {
  jan: "01",
  fev: "02",
  mar: "03",
  abr: "04",
  mai: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  set: "09",
  out: "10",
  nov: "11",
  dez: "12",
};

for (i = 1; i < tr.children.length; i++) {
  if (!tr.children[i].cells[1]) {
    continue;
  }

  let date =
    tr.children[i].cells[0].innerText.substring(0, 8).replace(" / ", ".") +
    "." +
    year;
  date = date.replace(date.substring(3, 6), months[date.substring(3, 6)]);

  window.jsonOut.push({
    date,
    info: tr.children[i].cells[1].innerText.replace(/ /g, ""),
    amount: tr.children[i].cells[4]
      ? tr.children[i].cells[4].innerText
          .split("\\n")[0]
          .replace(/[\\.\\,]/g, "")
      : tr.children[i].cells[3].innerText
          .split("\\n")[0]
          .replace(/[\\.\\,]/g, ""),
  });
}
