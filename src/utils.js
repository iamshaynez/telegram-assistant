import { ASSISTANT_APP_NAME } from "./env.js";
// 组装错误信息成文本，方便发送
export function errorToString(e) {
    return JSON.stringify({
        message: e.message,
        stack: e.stack,
        from: "assistant-gateway",
    });
}

// 拼凑小助手的消息发送模板
export function assistantMessage(text, appName = ASSISTANT_APP_NAME) {
    return `>> 小助手消息: 来自 [${appName}]\r\n\r\n${text}`;
}

