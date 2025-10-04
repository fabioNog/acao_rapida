const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 980,
    height: 720,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,      // MVP: facilita acesso a fs. Em produção, usar preload + contextIsolation.
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  // win.removeMenu(); // descomente se quiser remover menu do devtools
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
