<script lang="ts">
  import { onMount } from "svelte";
  import type { IMessage } from "$lib/schemas";
  import { writable } from "svelte/store";

  const recentMsg = writable<IMessage>();

  onMount(() => {
    const source = new EventSource("/rooms/activity");

    source.addEventListener("chat_sent", (event) => {
      const message = JSON.parse(event.data);
      recentMsg.update(() => message);
    });

    return () => {
      source.close();
    };
  });
</script>

<h1>SSE Chat</h1>
<p>Select a chatroom:</p>
<ul>
  <li><a href="/rooms/room1">Room 1</a></li>
  <li><a href="/rooms/room2">Room 2</a></li>
</ul>

{#if $recentMsg}
  <p>
    User {$recentMsg.user.substring(0, 8)} says
    <strong>{$recentMsg.text}</strong>
    in Room {$recentMsg.room.at(-1)}
  </p>
{/if}
