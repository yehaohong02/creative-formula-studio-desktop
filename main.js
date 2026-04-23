const { app, BrowserWindow, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  // 尝试加载图标
  let iconPath = path.join(__dirname, 'icon.png');
  if (!fs.existsSync(iconPath)) {
    iconPath = path.join(__dirname, 'icon.ico');
  }
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false
    },
    title: '创意公式工坊',
    icon: fs.existsSync(iconPath) ? iconPath : undefined
  });

  // 加载本地 HTML 文件
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  // 设置窗口图标（如果有的话）
  if (fs.existsSync(iconPath)) {
    try {
      const icon = nativeImage.createFromPath(iconPath);
      mainWindow.setIcon(icon);
    } catch (e) {
      console.log('无法设置图标:', e.message);
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
