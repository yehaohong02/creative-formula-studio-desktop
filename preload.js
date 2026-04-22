const { contextBridge, ipcRenderer } = require('electron');

// 暴露给渲染进程的 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 版本信息
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 更新检查
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  
  // 监听更新消息
  onUpdateMessage: (callback) => {
    ipcRenderer.on('update-message', (event, data) => callback(data));
  },
  
  // 移除更新消息监听
  removeUpdateListener: (callback) => {
    ipcRenderer.removeListener('update-message', callback);
  },
  
  // 打开外部链接
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // 平台信息
  platform: process.platform,
  
  // 是否为 Electron 环境
  isElectron: true
});
