import type { RequestHandler } from "./$types";
import { createSSE } from "$lib/server/sse";
import { chatEmitter } from "$lib/server/emitters";

export const GET = (async () => {
    const { readable, subscribeToEvent } = createSSE();

    subscribeToEvent(chatEmitter, "chat_sent");

    return new Response(readable, {
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'text/event-stream'
        }
    })
}) satisfies RequestHandler;
