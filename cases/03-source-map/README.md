# 案例 03：Bundle 与 Source Map

## 目标

理解原始模块如何被构建工具合并、压缩，并通过 Source Map 映射回源文件。

## 操作步骤

1. 执行 npm run build。
2. 检查 dist/assets 目录。
3. 找到包含 formatOrder 的生成文件。
4. 打开对应 .map 文件，检查 file、sources 和 sourcesContent。
5. 在 DevTools Sources 中定位 labs/02-bundles/order-logic.js。
6. 给 formatOrder 设置断点，重新执行页面操作。
7. 记录原始参数、itemTotal 和 payable。

## 必须回答

- Bundle 和原始模块有什么关系？
- Source Map 是否等于原始源代码？
- sourcesContent 缺失时，调试体验会有什么变化？
- 为什么生产环境的 Source Map 发布策略需要谨慎？

## 验收

能从生成文件定位到原始模块，并解释一条调用链。
