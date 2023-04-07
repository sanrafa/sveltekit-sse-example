<script lang="ts">
  import { onMount } from "svelte";
  import { SSEvents, type IMessage } from "$lib/schemas";
  import { writable } from "svelte/store";
  import { scale } from "svelte/transition";

  const recentMsg = writable<IMessage>();

  onMount(() => {
    const source = new EventSource("/rooms/activity");

    source.addEventListener(SSEvents.general, (event) => {
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
  <p class="alert" transition:scale={{ duration: 150 }}>
    User {$recentMsg.user.substring(0, 8)} says
    <strong>{$recentMsg.text}</strong>
    in Room {$recentMsg.room.at(-1)}
  </p>
{/if}

<style>
  h1 {
    font-size: 4rem;
    padding: 1.5rem;
  }

  ul {
    list-style: none;
    min-width: 75%;
    display: grid;
    place-items: center;
    gap: 0.5em;
    margin-bottom: 1rem;
  }

  ul li {
    padding: 0.5rem;
  }

  ul a {
    text-decoration: none;
    font-size: 3rem;
    background-color: rgb(164, 219, 244);
    padding: 0.25rem 1rem;
    border-radius: 4px;
    transition: all 150ms ease;
  }

  ul a:hover {
    background-color: rgb(52, 110, 218);
    color: white;
  }

  .alert {
    font-size: 1rem;
    padding: 2rem;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0px 1px rgba(0, 0, 0, 0.114);
    margin-bottom: 1rem;
  }
</style>
