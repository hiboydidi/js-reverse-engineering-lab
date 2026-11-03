# JavaScript 逆向工程实战实验室

一套从基础语法到浏览器调试、请求分析、代码打包、混淆识别、加密逻辑和综合复现的中文实战课程。

所有练习默认运行在本地靶场。案例使用本仓库自建的页面、接口和测试数据，不需要真实网站账号、第三方 Cookie、代理或 API Key。

## 你将完成什么

- 能读懂常见 JavaScript 语法结构：闭包、原型链、异步、Promise、模块。
- 能在 Chrome DevTools 中使用断点、调用栈、Scope、Network 和 Sources。
- 能追踪页面中的 Fetch、XHR、WebSocket 请求。
- 能理解 Vite / Webpack 产物、压缩代码和 Source Map。
- 能识别简单字符串数组混淆，并把逻辑整理成可读代码。
- 能分析 SHA-256、HMAC、AES-GCM 等标准 Web Crypto 用法。
- 能把本地靶场中的前端计算逻辑独立写成 Node.js 函数，并用测试验证。

## 运行环境

| 组件              | 版本 / 用途          |
| ----------------- | -------------------- |
| Node.js           | 24.x                 |
| npm               | 随 Node.js 安装      |
| Vite              | 前端开发服务器与打包 |
| Playwright        | 浏览器端到端测试     |
| Chrome / Chromium | DevTools 调试        |
| Docker            | 可选的一键环境       |
| GitHub Codespaces | 可选云端环境         |

### 方式 A：本机运行

推荐 macOS、Windows 及 Linux 使用 Node.js 版本管理器安装 Node 24。

```bash
# nvm 用户：在仓库根目录执行
nvm install
nvm use

# 安装依赖
npm ci

# 安装 Playwright Chromium
npm run install:browsers

# 启动前端和本地 API
npm run dev
```

如果没有安装 nvm，也可以用临时 Node 24 环境运行（不会替换系统 Node）：

```bash
npx -y -p node@24 -c "node -v && npm ci && npm run install:browsers && npm run dev"
```

打开：

- 实验室首页：http://localhost:5173
- API 健康检查：http://localhost:3000/api/health

停止服务：在运行终端按 Ctrl+C。

### 方式 B：Docker

需要预先安装 Docker Desktop 或 Docker Engine。

```bash
docker compose up --build
```

访问 http://localhost:5173。停止并清理容器：

```bash
docker compose down
```

### 方式 C：GitHub Codespaces

1. 打开本仓库。
2. 点击 Code → Codespaces → Create codespace。
3. 等待 Dev Container 初始化。
4. 在终端执行 npm run dev。
5. 从 Ports 面板打开 5173 端口。

## 学习顺序

| 章节 | 内容                 | 完成标准                                    |
| ---- | -------------------- | ------------------------------------------- |
| 00   | JavaScript 基础      | 能解释闭包、原型、异步输出顺序              |
| 01   | Network 与请求链     | 能从按钮定位到请求、参数和响应              |
| 02   | Bundle 与 Source Map | 能从打包文件定位回源代码                    |
| 03   | 混淆识别             | 能还原字符串表和简单控制流程                |
| 04   | Web Crypto           | 能解释并复现本地 HMAC 示例                  |
| 05   | 浏览器存储           | 能区分 Cookie、LocalStorage、SessionStorage |
| 06   | WebSocket            | 能追踪连接、消息帧和事件处理                |
| 07   | 综合案例             | 能独立写出分析报告和可测试的复现函数        |

建议每次只做一小节：先运行 → 观察 → 写出自己的解释 → 做练习 → 最后看答案。

## 常用命令

```bash
npm run dev             # 启动本地靶场
npm run build           # 生成生产构建和 Source Map
npm run preview         # 预览生产构建
npm test                # 运行 Node.js 单元测试
npm run test:e2e        # 运行 Playwright 浏览器测试
npm run test:all        # 单元测试 + 浏览器测试
npm run lint            # ESLint 检查
npm run format          # Prettier 格式化
npm run format:check    # 检查格式
npm run env:check       # 检查本机运行环境
npm run install:browsers # 安装 Playwright Chromium
```

## 目录结构

```text
.
├── .devcontainer/       # Codespaces / Dev Container
├── .github/workflows/   # CI 自动测试
├── cases/               # 按步骤完成的完整案例
├── docs/                # 课程、术语、调试指南
├── labs/                # 可运行的交互式实验
├── public/              # 公共样式
├── scripts/             # 启动与环境检查
├── server/              # 本地模拟 API 与 WebSocket
├── solutions/           # 案例答案，建议完成后再看
└── tests/               # 单元测试和浏览器测试
```

## 案例入口

- cases/01-coupon-reconstruction：从压缩后的页面逻辑恢复优惠券计算规则。
- cases/02-hmac-local-api：分析本地演示接口的 HMAC 请求签名。
- cases/03-source-map：从打包产物定位原始模块。
- cases/04-obfuscation：拆解字符串表与索引映射。
- cases/05-websocket：分析本地库存推送消息。

## 推荐的调试方式

1. 打开实验页面，按 F12。
2. Network 面板勾选 Preserve log，观察请求。
3. Sources 面板在目标函数处设置断点。
4. 触发页面按钮，查看 Call Stack、Scope 和局部变量。
5. 在 Console 中验证自己的假设。
6. 记录输入、输出、调用路径和边界条件。
7. 在 Node.js 中实现最小版本，并写测试。

详见 docs/devtools-guide.md。

## 学习记录

每个案例都应留下四项记录：

- 入口：从哪个按钮、事件或函数开始。
- 证据：请求参数、调用栈、关键变量和返回值。
- 还原：用自己的话描述逻辑，再写出最小实现。
- 验证：测试输入、预期输出、实际输出。

模板：docs/learning-log-template.md。

## 安全边界

本项目面向 JavaScript 学习、调试和授权测试。请只分析自己编写的代码、公开教学样本或明确获得授权的目标。不要将本地演示密钥用于真实服务；不要把课程练习用于绕过第三方登录、支付、验证码、反滥用或访问控制。详见 SECURITY.md。
