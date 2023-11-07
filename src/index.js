import { initEnv, ASSISTANT_KV, ASSISTANT_APP_NAME, ENV } from "./env.js";
import { errorToString, assistantMessage } from "./utils.js";
import { sendMessage, sendMessageWithPhotos } from "./telegram.js";
import { getAppName, handleRequest, getCurrentAppName } from "./app.js";

export default {
    async fetch(request, env) {
        // pre-load headers and authenticate with token
        try {
            initEnv(env);
            let headers = parseHeaders(request);
            const secret_token = headers["x-telegram-bot-api-secret-token"];

            if (ENV.TG_SECRET_TOKEN === secret_token) {
                console.log(`Authentication successful...`);
            } else {
                console.log(
                    `Authentication failed with ${secret_token} recieved...`
                );
                return new Response("Authentication failed, dropped.", {
                    status: 200,
                });
            }
        } catch (e) {
            return new Response("dropped.", { status: 200 });
        }

        // process request. request load happens here.
        let requestClone = null;

        try {
            requestClone = request.clone();
            const body = await request.json();
            const text = body.message.text;
            const current_app = await ASSISTANT_KV.get("MODE");
            if (text.startsWith(`/`)) {
                const appCode = parseApp(text);
                await ASSISTANT_KV.put("MODE", appCode);
                const appName = await getAppName(appCode);
                await sendMessage(
                    assistantMessage(`切换当前助手程序为[${appName}]`)
                );
            }

            if (current_app === null) {
                // no app selected
                await sendMessage(assistantMessage("请先选择一个助手程序"));
            }

            // jsonObject standard format
            // message: text
            // photos: list of image object => image { url: "", text: ""} //  later to change
            if (!text.startsWith(`/`)) {
                const jsonObject = await handleRequest(
                    requestClone,
                    current_app,
                    env
                );

                const appName = await getCurrentAppName();
                console.log(
                    `json reply ${
                        jsonObject["message"]
                    }, string ${JSON.stringify(jsonObject)}`
                );

                if (jsonObject.hasOwnProperty("photos")) {
                    await sendMessageWithPhotos(
                        assistantMessage(jsonObject["message"], appName),
                        jsonObject["photos"]
                    );
                } else {
                    await sendMessage(
                        assistantMessage(jsonObject["message"], appName)
                    );
                }
                return new Response(jsonObject["message"], { status: 200 });
            }

            return new Response("COMPLETED", { status: 200 });
        } catch (e) {
            console.error(e);
            //await sendMessage(assistantMessage(errorToString(e)));
            return new Response(errorToString(e), { status: 200 });
        } finally {
            try {
                requestClone.json();
            } catch (e) {
                return new Response("Finally Handled", { status: 200 });
            }
        }
    },
};

function parseApp(str) {
    const index = str.indexOf(" ");
    if (index !== -1) {
        return str.substring(1, index);
    }
    return str.substring(1);
}

function parseHeaders(request) {
    let headers = {};
    let keys = new Map(request.headers).keys();
    let key;
    while ((key = keys.next().value)) {
        headers[key] = request.headers.get(key);
        //console.log(`key=[${key}],value=[${headers[key]}]`)
    }
    return headers;
}
