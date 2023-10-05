import { initEnv } from "./env.js";
import { errorToString } from "./utils.js";
import { handleRequest } from "./router.js";

export default {
    async fetch(request, env) {
        try {
            initEnv(env);
            //const resp = new Response("OK", {status:200})
            const resp = await handleRequest(request, env);
            return resp || new Response("NOTFOUND", { status: 404 });
        } catch (e) {
            console.error(e);
            return new Response(errorToString(e), { status: 500 });
        }
    },
};
