import { Cirql, RecordSchema } from "cirql";
import { env } from "$env/dynamic/private";
import { z } from "zod";

const { DB_USER, DB_PASS } = env;

const client = new Cirql({
    connection: {
        endpoint: "http://localhost:8000",
        namespace: "test",
        database: "test"
    },
    credentials: {
        user: DB_USER,
        pass: DB_PASS
    }
});

await client.ready();

export default client;

export const Message = RecordSchema.extend({
    created_at: z.string(),
    user: z.string(),
    text: z.string(),
    room: z.string().refine((val) => ["room1", "room2"].includes(val))
});

export const MessageSubmission = Message.omit({ created_at: true, id: true });