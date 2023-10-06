import { ENV } from "./env.js";

// send text message to telegram
export async function sendMessage(text) {
    console.log(`sending ${text} to ${ENV.TG_CHAT_ID}`);
    return await fetch(
        `${ENV.TELEGRAM_API_DOMAIN}/bot${ENV.TG_BOT_TOKEN}/sendMessage`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                method: "post",
                text: text,
                chat_id: ENV.TG_CHAT_ID,
            }),
        }
    );
}

// bind webhook for bot
// 目前并没有使用，也没有测试过
export async function bindTelegramWebHook(token, url) {
    return await fetch(`${ENV.TELEGRAM_API_DOMAIN}/bot${token}/setWebhook`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url: url,
        }),
    }).then((res) => res.json());
}
