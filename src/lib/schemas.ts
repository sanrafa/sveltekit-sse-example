import { RecordSchema } from "cirql";
import { z } from "zod";

export const Message = RecordSchema.extend({
    created_at: z.string(),
    user: z.string(),
    text: z.string().min(1, "A message is required."),
    room: z.enum(["room1", "room2"])
});

export const MessageSubmission = Message.omit({ created_at: true, id: true });

export type IMessage = z.infer<typeof Message>;

export const SSEvents = {
    room1: "room1_chat_sent",
    room2: "room2_chat_sent",
    general: "chat_sent"
}