import type { RequestHandler } from "./$types";
import { createSSE } from "$lib/server/sse";
import { chatEmitter } from "$lib/server/emitters";

export const GET = (async ({ params }) => {
    const { readable, subscribeToEvent } = createSSE();
    const { room } = params;

    subscribeToEvent(chatEmitter, `${room}_chat_sent`);

    return new Response(readable, {
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'text/event-stream'
        }
    })
}) satisfies RequestHandler;
