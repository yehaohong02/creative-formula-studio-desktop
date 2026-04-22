const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

// 开发环境配置
const isDev = process.env.NODE_ENV === 'development';

// 日志配置（简化版，不使用 electron-log）
const log = {
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args)
};
autoUpdater.logger = log;
log.info('App starting...');

let mainWindow;
let updateWindow;

// 创建中文菜单
function createChineseMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '检查更新',
          click: () => {
            if (!isDev) {
              autoUpdater.checkForUpdates();
            }
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { label: '刷新', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: '强制刷新', accelerator: 'Shift+CmdOrCtrl+R', role: 'forceReload' },
        { type: 'separator' },
        { label: '开发者工具', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: '实际大小', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: '放大', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: '全屏', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { label: '最小化', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: '关闭', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于',
              message: '创意公式工坊',
              detail: `版本: ${app.getVersion()}\n\nAI买量视频创意公式工坊\n基于 Next.js + Electron 构建`
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false  // 允许加载本地文件
    },
    titleBarStyle: 'default',
    show: false
  });

  // 设置中文菜单
  createChineseMenu();

  // 加载应用
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境加载静态文件
    // 尝试多个可能的路径（因为打包后路径结构可能不同）
    const possiblePaths = [
      path.join(process.resourcesPath, 'app', 'dist', 'index.html'),
      path.join(__dirname, 'dist', 'index.html'),
      path.join(__dirname, 'out', 'index.html'),
      path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'index.html'),
      path.join(process.resourcesPath, 'dist', 'index.html')
    ];

    let loaded = false;
    for (const indexPath of possiblePaths) {
      log.info('Trying to load:', indexPath);
      if (fs.existsSync(indexPath)) {
        log.info('Found index.html at:', indexPath);
        mainWindow.loadFile(indexPath);
        loaded = true;
        break;
      }
    }

    if (!loaded) {
      log.error('Could not find index.html in any of the expected locations');
      // 列出 resources 目录内容以便调试
      try {
        const resourcesDir = fs.readdirSync(process.resourcesPath);
        log.error('Resources directory contents:', resourcesDir);
      } catch (e) {
        log.error('Could not read resources directory:', e.message);
      }
      
      dialog.showErrorBox('错误', '应用文件不存在，请重新安装。\n\n详细：找不到 index.html 文件');
      app.quit();
    }
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // 检查更新（延迟5秒，避免启动时卡顿）
    if (!isDev) {
      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify();
      }, 5000);
    }
  });

  // 监听加载失败
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log.error('Failed to load:', errorCode, errorDescription);
    dialog.showErrorBox('加载失败', `无法加载应用内容：${errorDescription}\n错误码：${errorCode}`);
  });

  // 窗口关闭处理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 处理新窗口打开（外部链接用系统浏览器打开）
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 创建更新窗口
function createUpdateWindow() {
  updateWindow = new BrowserWindow({
    width: 400,
    height: 200,
    parent: mainWindow,
    modal: true,
    show: false,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  updateWindow.loadURL(`data:text/html,
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          h3 { margin: 0 0 10px 0; font-size: 18px; }
          p { margin: 0; opacity: 0.9; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="spinner"></div>
        <h3>正在下载更新...</h3>
        <p>请稍候，下载完成后将自动安装</p>
      </body>
    </html>
  `);

  updateWindow.once('ready-to-show', () => {
    updateWindow.show();
  });
}

// 自动更新事件处理
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
  if (mainWindow) {
    mainWindow.webContents.send('update-message', { type: 'checking' });
  }
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-message', { 
      type: 'available', 
      version: info.version,
      releaseNotes: info.releaseNotes 
    });
  }
  
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: '发现新版本',
    message: `发现新版本 v${info.version}，是否现在下载？`,
    detail: info.releaseNotes || '暂无更新说明',
    buttons: ['立即下载', '稍后提醒'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      createUpdateWindow();
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-message', { type: 'not-available' });
  }
});

autoUpdater.on('error', (err) => {
  log.error('Update error:', err);
  if (mainWindow) {
    mainWindow.webContents.send('update-message', { type: 'error', error: err.message });
  }
  if (updateWindow) {
    updateWindow.close();
    updateWindow = null;
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
  logMessage += ` - Downloaded ${progressObj.percent}%`;
  logMessage += ` (${progressObj.transferred}/${progressObj.total})`;
  log.info(logMessage);
  
  if (mainWindow) {
    mainWindow.webContents.send('update-message', { 
      type: 'progress', 
      percent: progressObj.percent 
    });
  }
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info);
  if (updateWindow) {
    updateWindow.close();
    updateWindow = null;
  }
  
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: '更新已下载',
    message: '新版本已下载完成，是否立即安装并重启应用？',
    buttons: ['立即安装', '稍后安装'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// IPC 通信处理
ipcMain.handle('check-for-updates', async () => {
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
  return { success: true };
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url);
});

// 应用事件
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

// 单实例锁
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
}