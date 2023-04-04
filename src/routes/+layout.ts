import type { LayoutLoad } from "./$types";

export const load = (() => {
    const uuid = crypto.randomUUID();

    return {
        user: uuid
    }
}) satisfies LayoutLoad;