const { BrowserWindow } = require('electron');


const settingsBtn = document.getElementById('settingsBtn');

settingsBtn.onclick = e => {
  window.open('E:/electron tut/my-app/src/settings.html', '_blank', 'top=500,left=200,frame=true,nodeIntegration=true')
}
