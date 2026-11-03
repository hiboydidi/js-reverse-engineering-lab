# Chrome DevTools 调试指南

## 1. 打开工具

在实验页面按 F12，或使用浏览器菜单打开开发者工具。

## 2. Network 面板

1. 选择 Network。
2. 勾选 Preserve log，避免页面跳转时请求记录消失。
3. 勾选 Disable cache（仅在 DevTools 打开时生效）。
4. 点击实验页面按钮。
5. 选择 Fetch/XHR 过滤器。
6. 查看 Headers、Payload、Preview、Response、Initiator 和 Timing。

要回答的问题：

- 请求由哪个页面动作触发？
- URL 和 Method 是什么？
- Query 参数和 Body 分别是什么？
- 响应字段有哪些？
- Initiator 指向哪个脚本或函数？

## 3. Sources 面板

1. 打开 Sources。
2. 在文件树中定位实验脚本。
3. 点击行号设置断点。
4. 回到页面触发对应操作。
5. 暂停后查看 Call Stack、Scope 和 Watch。
6. 使用 Step over、Step into、Step out 观察执行过程。

不要只盯着压缩代码。先找到事件入口，再沿调用栈向下追踪。

## 4. 条件断点与日志点

右键行号可以设置条件断点。条件断点适合只在某个参数满足条件时暂停。

日志点可以打印表达式而不暂停执行，适合观察循环或高频事件。

## 5. Application 面板

在 Storage 区域检查：

- Local Storage
- Session Storage
- Cookies
- IndexedDB
- Cache Storage

本课程只使用本地演示数据。清理前确认当前站点是 localhost。

## 6. WebSocket

在 Network 面板选择 WS 请求，打开 Messages 查看消息帧和方向。

## 7. 每次调试都要记录

入口、断点位置、关键变量、输入值、返回值、下一跳函数。不要只保存一张截图。
