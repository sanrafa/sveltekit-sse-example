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

