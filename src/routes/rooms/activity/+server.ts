import type { RequestHandler } from "./$types";

export const GET = (() => {
    return new Response("hi");
}) satisfies RequestHandler;