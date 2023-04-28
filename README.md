# Sveltekit SSE (Server-Sent Event) Example

This is an example repo showing how to implement SSEs in Sveltekit using the Web Streams (server) and EventSource (client) APIs.

It's a naive implementation, and WebSockets are probably a better choice for a chat application, but maybe this'll save someone else some research.

Chats are ephemeral, stored in server memory - check out the `surreal` branch of this repo for a version using an actual database.

## Running locally

1. Clone the repo and install dependencies.

2. `npm run build` and `npm run preview`

OR

2. `npm run dev`

## Suggestions?

If you have any feedback, questions, dark secrets, etc., please submit an issue or PR!

## License

MIT
