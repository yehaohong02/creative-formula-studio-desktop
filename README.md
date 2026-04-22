# 创意公式工坊 - 桌面版

基于 Next.js + Electron 构建的桌面应用，支持自动更新。

## 在线版

访问 [https://creative-formula-studio.vercel.app](https://creative-formula-studio.vercel.app)

## 桌面版下载

从 [Releases](https://github.com/yehaohong02/creative-formula-studio-desktop/releases) 下载最新版本。

### Windows
- **安装版**: `创意公式工坊 Setup x.x.x.exe` (推荐)
- **便携版**: `创意公式工坊 x.x.x.exe` (免安装，直接运行)

### macOS
- `创意公式工坊-x.x.x.dmg`

## 功能特性

- ✅ 7大爆款创意公式库
- ✅ 榜单数据对比分析
- ✅ AI脚本生成器
- ✅ 自动热更新
- ✅ 离线使用
- ✅ 深色/浅色主题切换

## 自动更新

应用内置自动更新功能：
1. 启动时自动检查更新（每天最多一次）
2. 发现新版本时弹出提示
3. 一键下载并自动安装

## 开发

### 本地开发

```bash
# 安装依赖
npm install

# 开发模式（同时启动 Next.js 和 Electron）
npm run electron:dev
```

### 打包

```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

## 发布流程

### 方式一：推送 Tag（自动发布）

```bash
# 1. 更新版本号
npm version 1.0.1

# 2. 推送 Tag
git push origin main
git push origin v1.0.1
```

推送后 GitHub Actions 会自动构建并发布。

### 方式二：手动触发

1. 进入 GitHub 仓库 Actions 页面
2. 选择 "Build and Release Desktop App"
3. 点击 "Run workflow"
4. 输入版本号

## 技术栈

- **前端**: Next.js 16 + React 19 + Tailwind CSS 4
- **桌面**: Electron 28
- **构建**: electron-builder
- **更新**: electron-updater

## 许可证

MIT
