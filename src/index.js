import { initEnv, ASSISTANT_KV } from "./env.js";
import { errorToString, assistantMessage } from "./utils.js";
import { sendMessage } from "./telegram.js";
import { handleRequest } from "./router.js";

export default {
    async fetch(request, env) {
		let requestClone = null;
        try {
            initEnv(env);
			requestClone = request.clone()
            const body = await request.json();
            const text = body.message.text;
			const current_app = await ASSISTANT_KV.get("MODE");

			if (text.startsWith(`/`)) {
				const app = parseApp(text);
				await ASSISTANT_KV.put("MODE", app);
				await sendMessage(assistantMessage(`切换当前助手程序为{${app}}`))
			}

			if (current_app === null) {
				// no app selected
				await sendMessage(assistantMessage("请先选择一个助手程序"))
			}

			if (!text.startsWith(`/`)) {
				const message = await handleRequest(requestClone, current_app, env);
				await sendMessage(assistantMessage(message));
				return new Response(message, { status: 200 });
			}
            
            return new Response("COMPLETED", { status: 200 });
        } catch (e) {
            console.error(e);
			await sendMessage(assistantMessage(errorToString(e)));
            return new Response(errorToString(e), { status: 200 });
        } finally {
			try {
				requestClone.json()
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