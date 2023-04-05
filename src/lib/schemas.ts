import type { Message } from "./server/db";
import type { z } from "zod";


export type IMessage = z.infer<typeof Message>;