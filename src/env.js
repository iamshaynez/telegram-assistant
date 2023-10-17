const ENV_VALUE_TYPE = {
    TG_BOT_TOKEN: "string",
    TG_CHAT_ID: "string",
    TG_SECRET_TOKEN: "string",
};

export const ENV = {
    // Telegram Bot Token
    TG_BOT_TOKEN: null,
    // Telegram Bot Chat send messages to
    TG_CHAT_ID: null,
    // Telegram Secret Token
    TG_SECRET_TOKEN: null,

    TELEGRAM_API_DOMAIN: "https://api.telegram.org",
};

export const CONST = {
    USER_AGENT:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15",
};

export const ASSISTANT_APP_NAME = "小助手网关";

export let AI = null;
export let ASSISTANT_KV = null;

export function initEnv(env) {
    AI = env.AI;
    ASSISTANT_KV = env.ASSISTANT_KV;

    for (const key in ENV) {
        if (env[key]) {
            switch (ENV_VALUE_TYPE[key] || typeof ENV[key]) {
                case "number":
                    ENV[key] = parseInt(env[key]) || ENV[key];
                    break;
                case "boolean":
                    ENV[key] = (env[key] || "false") === "true";
                    break;
                case "string":
                    ENV[key] = env[key];
                    break;
                case "object":
                    if (Array.isArray(ENV[key])) {
                        ENV[key] = env[key].split(",");
                    } else {
                        try {
                            ENV[key] = JSON.parse(env[key]);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    break;
                default:
                    ENV[key] = env[key];
                    break;
            }
        }
    }
}
