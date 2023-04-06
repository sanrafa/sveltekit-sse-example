import { Cirql } from "cirql";
import { env } from "$env/dynamic/private";

const { DB_USER, DB_PASS, DB_URL, DB_NS, DB_DB } = env;

const client = new Cirql({
    connection: {
        endpoint: DB_URL,
        namespace: DB_NS,
        database: DB_DB
    },
    credentials: {
        user: DB_USER,
        pass: DB_PASS
    }
});

await client.ready();

export default client;

