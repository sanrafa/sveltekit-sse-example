import client, { Message, MessageSubmission } from "$lib/server/db";
import { select, create } from "cirql";
import type { PageServerLoad, Actions } from "./$types";
import { error } from "@sveltejs/kit";
import { ZodError, z } from "zod";

export const load = (async ({ params }) => {
    const { room: roomId } = params;
    if (!["room1", "room2"].includes(roomId)) throw error(404, 'Not found');
    const title = roomId === "room1" ? "Room 1" : "Room 2";
    const messages = await client.execute({
        query: select().from('message').where({ room: roomId }),
        schema: Message
    });

    return {
        room: {
            id: roomId,
            title,
            messages
        }
    }

}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        try {
            const formData = await request.formData();
            const chatObj = {
                text: formData.get('chat'),
                room: formData.get('room'),
                user: formData.get('user')
            };
            const parsed = MessageSubmission.parse(chatObj);
            await client.execute({
                query: create('message').content(parsed).return("after"),
                schema: z.any()
            });
        } catch (error) {
            console.error(error);
            if (error instanceof ZodError) console.log(error.issues);
        }

    }
} satisfies Actions;