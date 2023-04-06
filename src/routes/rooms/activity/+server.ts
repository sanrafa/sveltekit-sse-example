import type { RequestHandler } from "./$types";
import { createSSE } from "$lib/server/sse";
import { chatEmitter } from "$lib/server/emitters";
import { SSEvents } from "$lib/schemas";

export const GET = (async () => {
    const { readable, subscribeToEvent } = createSSE();

    subscribeToEvent(chatEmitter, SSEvents.general);

    return new Response(readable, {
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'text/event-stream'
        }
    })
}) satisfies RequestHandler;
