# 常见问题

## Node 版本不匹配

本仓库使用 Node.js 24.x。执行：

```bash
node -v
nvm install
nvm use
npm ci
```

## 5173 端口被占用

关闭占用该端口的旧 Vite 进程，或检查是否有另一个实验室实例正在运行。项目默认使用 strictPort，不会悄悄切换端口。

## 3000 端口被占用

本地 API 默认监听 3000。检查旧的 node server/index.mjs 进程并停止它。

## 页面能打开，但 API 不通

先访问 http://localhost:3000/api/health。确认 API 服务已启动，再检查 Vite 的 /api 代理配置。

## Playwright 找不到浏览器

执行：

```bash
npm run install:browsers
```

## Docker 构建失败

确认 Docker Desktop / Docker Engine 已启动，再运行：

```bash
docker compose build --no-cache
docker compose up
```

## Source Map 没有生成

确认 vite.config.mjs 中 build.sourcemap 为 true，再执行 npm run build，并检查 dist/assets 目录。
