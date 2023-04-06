import client from "$lib/server/db";
import { Message, MessageSubmission, SSEvents } from "$lib/schemas";
import { chatEmitter } from "$lib/server/emitters";
import { select, create } from "cirql";
import type { PageServerLoad, Actions } from "./$types";
import { error, fail } from "@sveltejs/kit";
import { ZodError } from "zod";

export const load = (async ({ params }) => {
    const { room: roomId } = params;
    const isRoute = Message.pick({ room: true }).safeParse(params);
    if (!isRoute.success) throw error(404, 'Not found');
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
                const roomEvent = SSEvents[message.room];
                chatEmitter.emit(SSEvents.general, message);
                chatEmitter.emit(roomEvent, message);
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