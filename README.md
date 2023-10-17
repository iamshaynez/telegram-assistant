# Telegram Assistant 网关服务

基于 Cloudflare Worker 构建了一个模块化的 Telegram 机器人网关。

## 架构

![image.png](https://vip2.loli.io/2023/10/06/l31ihTtwCMruSJ5.png)

详细说明见博客[文章](https://xiaowenz.com/blog/2023/10/modal-serverless-tg-bot/)

通过 Bot Menu 选择和切换应用，并通过对话进行交互。交互方式如下图：

![image.png](https://vip2.loli.io/2023/10/06/PAq2KCF8iaYXIvw.png)

## 说明

### 本服务

#### 依赖 Cloudflare 的 KV 存储。KV 中的部分 Metadata 需要手工添加，不添加现在也是工作的，只是丑一点。

**MetaData 范例：**

```
Key = APP-COUNTER
Value = {"appCode": "counter", "appName": "打卡助手"}
```

#### 需要开启 Worker 的 Router 并绑定在 TelegramBot 的 Webhook 上。

手工调用 
```
https://api.telegram.org/bot{my_bot_token}/setWebhook?url={url_to_send_updates_to}&secret_token={tg_secret_token}
```

#### TelegramBot 的菜单需要手工添加和配置。

在 BotFather -> Edit Bot 中添加需要的应用服务的命令和名称

#### Cloudflare Dashboard 中添加以下环境变量（加密）

- TG_BOT_TOKEN
- TG_CHAT_ID
- TG_SECRET_TOKEN: 1-256 位 Token，用来做鉴权认证。

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

**目前可以参考的服务模块**

- [打卡小助手](https://github.com/iamshaynez/telegram-assistant-counter) 打卡小助手
- [翻译小助手](https://github.com/iamshaynez/telegram-assistant-translator) 基于 CF AI 模型 
- [LLama-2-7b](https://github.com/iamshaynez/telegram-assistant-llm) 基于 @cf/meta/llama-2-7b-chat-int8
- [智谱AI ChatGLM](https://github.com/iamshaynez/telegram-assistant-zhipu)  基于 ChatGLM Std


## 待办

- 清理和规范代码
- 更详细的文档
- 部署说明
- 自动注册 Webhook 和自动注册 Menu