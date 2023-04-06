import type { RequestHandler } from "./$types";
import { SSEvents, Message } from "$lib/schemas";
import { createSSE } from "$lib/server/sse";
import { chatEmitter } from "$lib/server/emitters";

export const GET = (async ({ params }) => {
    const { readable, subscribeToEvent } = createSSE();
    const Room = Message.shape.room;
    const room = Room.parse(params.room);
    const event = SSEvents[room];
    subscribeToEvent(chatEmitter, event);
    return new Response(readable, {
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'text/event-stream'
        }
    })
}) satisfies RequestHandler;
