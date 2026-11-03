# 案例 02：HMAC 本地 API

## 目标

理解浏览器如何对一个固定教学 payload 计算 HMAC-SHA256，并由本地服务验证。

## 入口文件

- 页面：labs/04-crypto/index.html
- 浏览器算法：labs/04-crypto/main.js
- 服务端算法：server/signature.mjs
- 验证接口：POST /api/signature/verify

## 操作步骤

1. 打开 04 · Web Crypto。
2. 在 Sources 中找到 payload 和 signPayload。
3. 记录参与签名的 payload。
4. 跟进 stableStringify，确认对象键排序规则。
5. 在 Network 面板查看 POST 请求的 JSON Body。
6. 对比浏览器 Web Crypto 与 Node.js createHmac 的结果。
7. 修改 payload 中的 amount，再重新签名。
8. 将签名保持不变，只修改 payload，观察服务端返回。

## 必须回答

- SHA-256 摘要与 HMAC 有什么区别？
- 为什么对象键顺序需要规范化？
- HMAC 输出为何是 32 字节，转成 hex 后是 64 个字符？
- 修改 payload 后，为什么原签名不再匹配？
- 为什么前端内置密钥不能保护真实业务？

## 验收

能解释输入字节、规范化字符串、签名输出和服务端验证四个步骤。

注意：这是本地演示算法，不是第三方网站签名复现，也不应作为生产认证方案。
