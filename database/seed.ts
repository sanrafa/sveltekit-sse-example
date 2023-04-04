import fs from "node:fs/promises";
import path from "node:path";
import invariant from "tiny-invariant";
import { CirqlStateless, query } from "cirql";
import { z } from "zod";

const { DB_USER, DB_PASS } = process.env;
invariant(DB_USER && DB_PASS);

try {
    const client = new CirqlStateless({
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
    const filePath = path.resolve();

    const script = await fs.readFile(`${filePath}/database/message.srql`, { encoding: "utf8" });
    const queries = script.split("\n\n").map(q => ({
        query: query(q),
        schema: z.any()
    }));
    console.log("Creating MESSAGE table---");
    await client.transaction(...queries);
    console.log("MESSAGE table created.");
} catch (error) {
    console.error(error);
}


