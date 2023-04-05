<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import type { ActionData } from "./$types";
  import type { IMessage } from "$lib/schemas";

  export let form: ActionData;
  export let data;
  const {
    room: { messages, title },
  } = data;
  const messageStore = writable<IMessage[]>(messages);
  const user = getContext<Writable<string>>("user");

  onMount(() => {
    const source = new EventSource(`${$page.url}/activity`, {
      withCredentials: false,
    });
    source.addEventListener(`${$page.params?.room}_chat_sent`, (event) => {
      const message = JSON.parse(event.data);
      messageStore.update((v) => [...v, message]);
    });
    return () => {
      source.close();
    };
  });
</script>

<h1>{title}</h1>
<p><strong>Posting as:</strong> {$user}</p>

<form method="post" use:enhance>
  <input type="text" name="chat" id="chat" />
  <input type="hidden" name="room" value={data.room.id} />
  <input type="hidden" name="user" value={$user} />
  <button type="submit">SUBMIT</button>
  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}
</form>

<div class="msg_box">
  {#if $messageStore.length > 0}
    <ul>
      {#each $messageStore as msg}
        <li>{msg.text}</li>
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
    background-color: lightgrey;
    max-width: 50%;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>
