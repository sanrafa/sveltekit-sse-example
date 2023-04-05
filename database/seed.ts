import fs from "node:fs/promises";
import path from "node:path";
import invariant from "tiny-invariant";
import { CirqlStateless, query } from "cirql";
import { z } from "zod";

const { DB_USER, DB_PASS } = process.env;
invariant(DB_USER && DB_PASS);

async function setupQueries(filename: string) {
    const filePath = `${path.resolve()}/database/${filename}.srql`;
    const script = await fs.readFile(filePath, { encoding: "utf8" });
    const commentRegex = /\/\*[\s\S]*?\*\//sg;
    const sanitized = script.replace(commentRegex, '');
    const scriptArray = sanitized.split("\n\n").filter(val => !!val);
    const queries = scriptArray.map(q => ({
        query: query(q),
        schema: z.any()
    }));
    return queries;
}

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
    const queries = await setupQueries("message");
    console.log("Creating MESSAGE table---");
    await client.transaction(...queries);
    console.log("MESSAGE table created.");
} catch (error) {
    console.error(error);
}


