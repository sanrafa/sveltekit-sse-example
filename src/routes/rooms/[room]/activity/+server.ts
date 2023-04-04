import type { RequestHandler } from "./$types";

export const GET = (() => {
    return new Response("hello");
}) satisfies RequestHandler;