# 课程大纲

## 第一阶段：读懂 JavaScript

### 00 · 基础语法

- 变量作用域、词法环境、闭包。
- this、原型链、对象属性查找。
- Promise、async/await、事件循环。
- 练习：根据代码预测输出顺序，再在 Console 中验证。

### 01 · 浏览器请求

- Fetch 与 XMLHttpRequest 的差异。
- URL、Query、Headers、Request Body、Response。
- Network 面板中的 Initiator、Timing、Preview、Response。
- 练习：从按钮点击追踪到本地 API 的请求。

## 第二阶段：读懂构建产物

### 02 · Bundle 与 Source Map

- ESM、模块依赖、打包入口。
- 压缩、变量改名、Tree Shaking 的效果。
- Source Map 的 sources、mappings 与 sourcesContent。
- 练习：从 dist/assets 中定位原始模块。

### 03 · 混淆识别

- 字符串数组、索引函数、数组旋转。
- 控制流结构与变量重命名。
- 先恢复语义，再重写可读版本。
- 练习：还原本仓库的教学样本。

## 第三阶段：浏览器运行时

### 04 · Web Crypto

- 编码、摘要、消息认证码的区别。
- SubtleCrypto 的 digest、importKey、sign。
- HMAC 与 SHA-256 的输入输出。
- 练习：在本地 API 中验证演示签名。

### 05 · 浏览器存储

- Cookie 属性与作用域。
- LocalStorage、SessionStorage 的生命周期。
- Application 面板检查和清理。
- 练习：观察本地页面保存的数据。

### 06 · WebSocket

- 握手、连接状态、消息帧。
- JSON 消息协议与事件分发。
- 练习：订阅本地库存变化。

## 第四阶段：综合复现

### 07 · 本地商品结算

- 从页面交互找到事件入口。
- 追踪商品列表、分页、优惠券预览。
- 确定输入、输出、边界条件。
- 将前端计算规则写成独立 Node 函数。
- 用单元测试验证正常值、边界值和错误值。

## 完成标准

每章至少完成：

1. 页面能运行。
2. 能说出入口函数和数据流。
3. 能解释关键变量。
4. 能独立完成练习。
5. 有一条自动化测试或可复现验证。
