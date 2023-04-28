<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import type { ActionData } from "./$types";
  import { SSEvents, type IMessage } from "$lib/schemas";

  export let form: ActionData;
  export let data;
  const {
    room: { messages, title, id: roomId },
  } = data;

  const messageStore = writable<IMessage[]>(messages);
  const user = getContext<Writable<string>>("user");

  onMount(() => {
    const source = new EventSource(`${$page.url}/activity`, {
      withCredentials: false,
    });
    const event = SSEvents[roomId as keyof typeof SSEvents];
    source.addEventListener(event, (e) => {
      const message = JSON.parse(e.data);
      messageStore.update((v) => [...v, message]);
    });
    return () => {
      source.close();
    };
  });
</script>

<h1>{title}</h1>

<form method="post" use:enhance>
  {#if form?.error}
    <p class="error" id="error">{form.error}</p>
  {/if}
  <input type="hidden" name="room" value={data.room.id} />
  <input type="hidden" name="user" value={$user} />
  <input
    type="text"
    name="chat"
    id="chat"
    aria-describedby="error"
    aria-invalid={form?.error ? "true" : "false"}
    aria-required="true"
    aria-label="Chatbox"
  />
  <button type="submit">Submit</button>
</form>

<div class="msg_box">
  {#if $messageStore.length > 0}
    <ul>
      {#each [...$messageStore].sort((a, z) => z.created_at - a.created_at) as msg}
        <li>
          <div class="msg">
            <span
              ><span style="font-weight: bold;">{msg.user.substring(0, 8)}</span
              > says</span
            >
            <p>{msg.text}</p>
            <small
              >{new Intl.DateTimeFormat("en-US", {
                timeStyle: "short",
                dateStyle: "short",
              }).format(new Date(msg.created_at))}</small
            >
          </div>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No messages.</p>
  {/if}
</div>

<style>
  .msg_box {
    margin-top: 8px;
    padding: 1rem;
    background-color: rgba(157, 210, 235, 0.25);
    border-radius: 4px;
    width: 90%;
  }

  .msg_box ul {
    display: grid;
    gap: 4px;
  }

  .msg_box li {
    list-style: none;
  }
  .msg {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    padding: 0.5rem;
  }
  .msg span {
    font-size: 1rem;
  }

  .error {
    color: red;
    font-weight: bold;
    font-size: 1rem;
  }

  small {
    font-size: 0.75rem;
  }

  h1 {
    padding: 1rem;
  }

  form {
    display: grid;
    place-items: center;
    gap: 1rem;
    width: 100%;
  }

  form > input[type="text"] {
    all: unset;
    background-color: white;
    border-radius: 6px;
    font-size: 1.5rem;
    padding: 0.4rem;
    box-shadow: 0px 0.5px 2px rgba(52, 110, 218, 0.5);
    min-width: 50%;
    text-align: center;
  }

  form > input[type="text"]:focus {
    outline: 2px solid orange;
  }

  form > button {
    all: unset;
    font-size: 1.5rem;
    text-transform: uppercase;
    padding: 0.5rem;
    background-color: rgb(52, 110, 218);
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }

  form > button:focus {
    outline: 2px solid orange;
  }

  form > button:hover {
    background-color: rgb(164, 219, 244);
    color: inherit;
    transition: all 150ms ease;
  }

  @media screen and (min-width: 640px) {
    .msg_box {
      width: 75%;
    }
  }
</style>
