
const BlackAndWhite = document.getElementById('BlackAndWhite');

BlackAndWhite.onclick = e => {
  console.log("het werkt");
  BlackAndWhite.classList.add('btn-primary');
  BlackAndWhite.innerText = 'hello';
};
