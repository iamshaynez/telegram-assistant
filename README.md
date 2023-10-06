# Telegram Assistant 网关服务

基于 Cloudflare Worker 构建了一个模块化的 Telegram 机器人网关。

## 架构

![image.png](https://vip2.loli.io/2023/10/06/l31ihTtwCMruSJ5.png)

详细说明见博客[文章](https://xiaowenz.com/blog/2023/10/modal-serverless-tg-bot/)

## 说明

### 本服务

- 依赖 Cloudflare 的 KV 存储。
- KV 中的部分 Metadata 需要手工添加，不添加现在也是工作的，只是丑一点。
- 需要开启 Worker 的 Router 并绑定在 TelegramBot 的 Webhook 上。
- TelegramBot 的菜单需要手工添加和配置。
- 需要配置环境变量（加密）
  - TG_BOT_TOKEN
  - TG_CHAT_ID

### 依赖服务

功能模块依靠 Binding Service 注入到网关中使用。

```toml
# wrangler.toml

[[services]]
binding = "TRANSLATOR"
service = "telegram-assistant-translator"

[[services]]
binding = "COUNTER"
service = "telegram-assistant-counter"
```

## 待办

- 清理和规范代码
- 更详细的文档
- 部署说明
- 自动注册 Webhook 和自动注册 Menu