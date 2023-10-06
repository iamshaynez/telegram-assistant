import { initEnv, ASSISTANT_KV, ASSISTANT_APP_NAME } from "./env.js";
import { errorToString, assistantMessage } from "./utils.js";
import { sendMessage } from "./telegram.js";
import { getAppName, handleRequest, getCurrentAppName } from "./app.js";

export default {
    async fetch(request, env) {
        let requestClone = null;
        try {
            initEnv(env);
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

            if (!text.startsWith(`/`)) {
                const message = await handleRequest(
                    requestClone,
                    current_app,
                    env
                );
				
				const appName = await getCurrentAppName();
                await sendMessage(assistantMessage(message, appName));
                return new Response(message, { status: 200 });
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
