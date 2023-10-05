

// 入口方法，所有的流量由这个方法处置和调用
export async function handleRequest(request, current_app, env) {
    console.log(`forward to app-${current_app}`);
    //console.log(env.TRANSLATOR)
    const res = await env[current_app.toUpperCase()].fetch(request);
    console.log(`Debug message 2`);
    const message = JSON.parse(await res.text()).message;
    console.log(`Translated message: ${message}`);

    return message;
}
