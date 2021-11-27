
const colorsBtn = document.getElementById('colorsBtn');

colorsBtn.onclick = e => {
  var element = document.createElement("h1");
  document.getElementByTag("body").appendChild(element);
  element.innerText = "Colors";
  console.log("clickert");
}
