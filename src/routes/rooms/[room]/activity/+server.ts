import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (() => {
    return new Response("hello");
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
    console.log("DB event triggered!");
    const data = await request.json();
    // log data from database to prove event triggered
    console.log(data);
    return json({ ok: true });
}) satisfies RequestHandler;