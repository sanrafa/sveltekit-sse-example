# Sveltekit SSE (Server-Sent Event) Example

This is an example repo showing how to implement SSEs in Sveltekit using the Web Streams (server) and EventSource (client) APIs.

It's a naive implementation, and WebSockets are probably a better choice for a chat application, but maybe this'll save someone else a bunch of research.

The database used is [SurrealDB](https://surrealdb.com/) with the impressive [Cirql](https://github.com/StarlaneStudios/cirql) query builder. Highly recommend trying it, but the app uses a single table defined in `lib/schemas` - should be easy to fork and replace Surreal with your datastore of choice.

## Running locally

**Prerequisite:** [SurrealDB version 1.0.0-beta9 or higher](https://surrealdb.com/docs/installation)

1. Clone the repo and run `npm install`
2. Start the SurrealDB instance in a separate terminal
   - `surreal start -l trace -u root -p root memory` to start an in-memory instance with default user
3. Copy `.env.example` to new `.env` file and fill in values
4. `npm run seed`
5. `npm run dev`
6. The app should be running on port 5173

## Suggestions?

If you have any feedback, questions, dark secrets, etc., please submit an issue or PR!

## License

MIT
