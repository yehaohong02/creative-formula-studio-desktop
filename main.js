const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

// 开发环境配置
const isDev = process.env.NODE_ENV === 'development';

// 日志配置
const log = {
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args)
};

let mainWindow;
let updateWindow;
let isUpdating = false;

// 创建中文菜单
function createChineseMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '检查更新',
          click: () => checkForUpdates(true)
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
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
        { label: '放大', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { label: '重置缩放', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
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

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// 创建更新进度窗口
function createUpdateWindow() {
  updateWindow = new BrowserWindow({
    width: 450,
    height: 250,
    parent: mainWindow,
    modal: true,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  updateWindow.loadURL(`data:text/html,
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            padding: 30px;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          h3 { margin: 0 0 10px 0; font-size: 20px; font-weight: 600; }
          p { margin: 0; opacity: 0.9; font-size: 14px; }
          .progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
            margin-top: 20px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            background: white;
            border-radius: 3px;
            transition: width 0.3s ease;
            width: 0%;
          }
          #progress-text {
            margin-top: 10px;
            font-size: 12px;
            opacity: 0.8;
          }
        </style>
      </head>
      <body>
        <div class="spinner"></div>
        <h3 id="status">正在检查更新...</h3>
        <p id="message">请稍候</p>
        <div class="progress-bar">
          <div class="progress-fill" id="progress"></div>
        </div>
        <p id="progress-text">0%</p>
        <script>
          let progress = 0;
          const progressEl = document.getElementById('progress');
          const progressTextEl = document.getElementById('progress-text');
          const statusEl = document.getElementById('status');
          const messageEl = document.getElementById('message');
          
          window.updateProgress = (p) => {
            progress = p;
            progressEl.style.width = p + '%';
            progressTextEl.textContent = Math.round(p) + '%';
          };
          
          window.updateStatus = (s, m) => {
            statusEl.textContent = s;
            messageEl.textContent = m || '';
          };
        </script>
      </body>
    </html>
  `);

  updateWindow.once('ready-to-show', () => {
    updateWindow.show();
  });

  return updateWindow;
}

// 更新进度窗口的进度
function updateProgress(percent) {
  if (updateWindow && !updateWindow.isDestroyed()) {
    updateWindow.webContents.executeJavaScript(`window.updateProgress(${percent})`);
  }
}

// 更新进度窗口的状态
function updateStatus(status, message) {
  if (updateWindow && !updateWindow.isDestroyed()) {
    updateWindow.webContents.executeJavaScript(`window.updateStatus('${status}', '${message || ''}')`);
  }
}

// 关闭更新窗口
function closeUpdateWindow() {
  if (updateWindow && !updateWindow.isDestroyed()) {
    updateWindow.close();
    updateWindow = null;
  }
}

// 强制检查更新
function checkForUpdates(manual = false) {
  if (isDev) {
    if (manual) {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: '检查更新',
        message: '开发模式不支持自动更新'
      });
    }
    return;
  }

  if (isUpdating && !manual) return;
  isUpdating = true;

  if (manual) {
    createUpdateWindow();
  }

  log.info('Checking for updates...');
  autoUpdater.checkForUpdates();
}

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    show: false,
    title: '创意公式工坊',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    }
  });

  // 设置中文菜单
  createChineseMenu();

  // 加载应用
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境 - 尝试多个可能的路径
    const possiblePaths = [
      path.join(__dirname, 'dist', 'index.html'),
      path.join(process.resourcesPath, 'app', 'dist', 'index.html'),
      path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'index.html'),
      path.join(process.resourcesPath, 'dist', 'index.html')
    ];

    let loaded = false;
    for (const indexPath of possiblePaths) {
      log.info('Trying path:', indexPath);
      if (fs.existsSync(indexPath)) {
        log.info('Found index.html at:', indexPath);
        mainWindow.loadFile(indexPath);
        loaded = true;
        break;
      }
    }

    if (!loaded) {
      log.error('Could not find index.html');
      // 调试：列出目录内容
      try {
        log.info('__dirname:', __dirname);
        log.info('resourcesPath:', process.resourcesPath);
        const files = fs.readdirSync(process.resourcesPath);
        log.info('Resources dir:', files);
      } catch (e) {
        log.error('Error listing dir:', e);
      }

      dialog.showErrorBox('启动失败', '无法找到应用文件，请重新安装。');
      app.quit();
      return;
    }
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // 启动后强制检查更新
    if (!isDev) {
      setTimeout(() => {
        createUpdateWindow();
        checkForUpdates(false);
      }, 2000);
    }
  });

  // 加载失败处理
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log.error('Failed to load:', errorCode, errorDescription);
    dialog.showErrorBox('加载失败', `错误: ${errorDescription}`);
  });

  // 窗口关闭
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 外部链接处理
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 自动更新事件处理
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
  updateStatus('正在检查更新...', '连接到服务器');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info.version);
  updateStatus('发现新版本', `v${info.version} 可用，正在下载...`);
  
  // 自动开始下载（不需要用户确认）
  autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', (info) => {
  log.info('No update available');
  updateStatus('已是最新版本', '当前版本已是最新');
  
  // 2秒后关闭更新窗口
  setTimeout(() => {
    closeUpdateWindow();
    isUpdating = false;
  }, 2000);
});

autoUpdater.on('download-progress', (progressObj) => {
  const percent = progressObj.percent;
  const speed = (progressObj.bytesPerSecond / 1024 / 1024).toFixed(2);
  log.info(`Download progress: ${percent.toFixed(1)}% (${speed} MB/s)`);
  
  updateProgress(percent);
  updateStatus('正在下载更新...', `速度: ${speed} MB/s`);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded');
  updateStatus('下载完成', '正在安装更新...');
  updateProgress(100);
  
  // 自动安装并重启（不需要用户确认）
  setTimeout(() => {
    autoUpdater.quitAndInstall(true, true);
  }, 1500);
});

autoUpdater.on('error', (err) => {
  log.error('Update error:', err);
  updateStatus('更新出错', err.message);
  
  setTimeout(() => {
    closeUpdateWindow();
    isUpdating = false;
  }, 3000);
});

// IPC 处理
ipcMain.handle('check-for-updates', async () => {
  checkForUpdates(true);
  return { success: true };
});

ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url);
});

// 应用生命周期
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
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}