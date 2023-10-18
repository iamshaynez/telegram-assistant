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
                //parse_mode: "Markdown",
            }),
        }
    );
}

// {'chat_id': tg_chat_id, 'photo': photo_url, 'caption': message}
export async function sendMessageWithPhotos(text, photos) {
    // process photos list
    if (!Array.isArray(photos) || photos.length < 1) {
        throw new Exception(`Invalid photo list. Dropped message.`);
    }

    console.log(`sending ${text} with photos to ${ENV.TG_CHAT_ID}`);
    // for now, only send the first phot
    if (photos.length === 1) {
        return await fetch(
            `${ENV.TELEGRAM_API_DOMAIN}/bot${ENV.TG_BOT_TOKEN}/sendPhoto`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    method: "post",
                    caption: text,
                    chat_id: ENV.TG_CHAT_ID,
                    photo: photos[0],
                    //parse_mode: "Markdown",
                }),
            }
        );
    } else {
        // multiple photos
        return await fetch(
            `${ENV.TELEGRAM_API_DOMAIN}/bot${ENV.TG_BOT_TOKEN}/sendMediaGroup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    method: "post",
                    chat_id: ENV.TG_CHAT_ID,
                    media: getGroupMediaPhotos(photos),
                    //parse_mode: "Markdown",
                }),
            }
        );
    }
}

// convert photos urls array to group media
function getGroupMediaPhotos(photos) {
    let mediaGroup = photos.map((photoUrl) => ({
        type: "photo",
        media: photoUrl,
    }));
    return JSON.stringify(mediaGroup);
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
