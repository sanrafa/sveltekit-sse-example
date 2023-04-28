import chats from "$lib/server/state";
import { Message, MessageSubmission, SSEvents, type IMessage } from "$lib/schemas";
import { chatEmitter } from "$lib/server/emitters";
import type { PageServerLoad, Actions } from "./$types";
import { error, fail } from "@sveltejs/kit";
import { ZodError } from "zod";
import { randomUUID } from "crypto";

export const load = (async ({ params }) => {
    const { room: roomId } = params;
    const isRoute = Message.pick({ room: true }).safeParse(params);
    if (!isRoute.success) throw error(404, 'There be dragons...');
    const title = roomId === "room1" ? "Room 1" : "Room 2";
    const messages = Array.from(chats).filter(chat => chat.room === roomId);
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
            const id = randomUUID();
            const message: IMessage = { id, created_at: Date.now(), ...parsed };

            chats.add(message);

            const roomEvent = SSEvents[message.room];
            chatEmitter.emit(SSEvents.general, message);
            chatEmitter.emit(roomEvent, message);

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