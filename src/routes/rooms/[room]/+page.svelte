<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";

  export let data;
  const user = getContext<Writable<string>>("user");
  const {
    room: { messages, title },
  } = data;
</script>

<h1>{title}</h1>
<p><strong>Posting as:</strong> {$user}</p>

<form method="post">
  <input type="text" name="chat" id="chat" />
  <input type="hidden" name="room" value={data.room.id} />
  <input type="hidden" name="user" value={$user} />
  <button type="submit">SUBMIT</button>
</form>

<div class="msg_box">
  {#if messages.length > 0}
    <ul>
      {#each messages as msg}
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
</style>
