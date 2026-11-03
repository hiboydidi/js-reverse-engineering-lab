# 案例 05：WebSocket 消息追踪

## 目标

追踪浏览器建立 WebSocket 连接、接收消息和更新页面的完整过程。

## 操作步骤

1. 打开 06 · WebSocket。
2. 在 Network → WS 中观察握手。
3. 点击连接，记录 readyState 变化。
4. 在 Messages 中查看 connected 和 inventory:update。
5. 在 Sources 中定位 message 事件监听器。
6. 找到消息 JSON 的 type 字段。
7. 断开连接，观察 close 事件。

## 必须回答

- WebSocket 与普通短连接请求有什么区别？
- readyState 的几个状态分别代表什么？
- 服务端推送消息和浏览器发送消息如何区分？
- 为什么页面需要处理 close 和 error？
