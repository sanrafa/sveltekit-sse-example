import client, { Message, MessageSubmission } from "$lib/server/db";
import { chatEmitter } from "$lib/server/emitters";
import { select, create } from "cirql";
import type { PageServerLoad, Actions } from "./$types";
import { error, fail } from "@sveltejs/kit";
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
            const message = await client.execute({
                query: create('message').content(parsed).return("after"),
                schema: Message
            });
            if (message) {
                const room = message.room;
                chatEmitter.emit('chat_sent', message);
                chatEmitter.emit(`${room}_chat_sent`, message);
            }
        } catch (error) {
            if (error instanceof ZodError) {
                const textError = error.issues.find(iss => iss.path.includes("text"));
                if (textError) {
                    return fail(400, { error: textError.message });
                }
            }
            return fail(500, { error: "An unexpected error occurred." });
        }

    }
} satisfies Actions;