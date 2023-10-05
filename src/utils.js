

// 组装错误信息成文本，方便发送
export function errorToString(e) {
    return JSON.stringify({
        message: e.message,
        stack: e.stack,
        from: "assistant-gateway"
    });
}

// 拼凑小助手的消息发送模板
export function assistantMessage(text) {
    return `---- 小助手消息 ----\r\n${text}\r\n--------------------`;
}
