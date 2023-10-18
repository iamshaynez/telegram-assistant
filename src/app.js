import { ASSISTANT_KV } from "./env.js";
import { errorToString } from "./utils.js";

export async function getAppInfo(appCode) {
    try {
        const info_value = await ASSISTANT_KV.get(`APP-${appCode.toUpperCase()}`);
        console.log(`info_value: ${info_value}`)
        const info = JSON.parse(info_value);
        console.log(info.appName);
        return info;
    } catch (e) {
        console.log(errorToString(e))
        return null;
    }
}

export async function getAppName(appCode) {
    const appInfo = await getAppInfo(appCode);
    if(appInfo === null) {
        return appCode;
    } else {
        return appInfo.appName
    }
}

export async function getCurrentAppName() {
    const current_app = await ASSISTANT_KV.get("MODE");
    if(current_app === null) {
        return "未找到的当前应用"
    }
    return await getAppName(current_app)
}

// 入口方法，所有的流量由这个方法处置和调用
// 当前约定{message: string, photos: array_string_of_urls}
// photos optional
export async function handleRequest(request, current_app, env) {
    console.log(`forward request to app-${current_app}`);
    const res = await env[current_app.toUpperCase()].fetch(request);
    return JSON.parse(await res.text());
}
