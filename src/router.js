import { ASSISTANT_KV } from "./env.js";
import { renderHTML, errorToString, assistantMessage } from "./utils.js";
import { sendMessage } from "./telegram.js";

// 入口方法，所有的流量由这个方法处置和调用
export async function handleRequest(request, env) {
    const { pathname } = new URL(request.url);
    const body = await request.json();
    const text = body.message.text;

    console.log(`Get pathname: ${pathname}`);
    console.log(`Get body text: ${text}`);
    const current_app = await ASSISTANT_KV.get("MODE");
    console.log(`Current mode: ${current_app}`);
    if (current_app === null) {
        // no app selected
        await sendMessage(assistantMessage("请先选择一个助手程序"))
        return defaultIndexAction();
    }

    if (pathname === `/` && text.startsWith(`/`)) {
        const app = parseApp(text);
        await ASSISTANT_KV.put("MODE", app);
        await sendMessage(assistantMessage(`切换当前助手程序为{${app}}`))
        return defaultIndexAction();
    }

    if (pathname === `/` && !text.startsWith(`/`)) {
        console.log(`forward ${text} to app-${current_app}`);
    }

    return defaultIndexAction();
}

function parseApp(str) {
    const index = str.indexOf(" ");
    if (index !== -1) {
        return str.substring(1, index);
    }
    return str.substring(1);
}

async function defaultIndexAction() {
    const HTML = renderHTML(`
      <h1>Telegram-Counter</h1>
      <br/>
      <p>Deployed Successfully!</p>
      <br/>
      <br/>
    `);
    return new Response(HTML, {
        status: 200,
        headers: { "Content-Type": "text/html" },
    });
}
