<script lang="ts">
  import { browser } from "$app/environment";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  let uid: string;

  if (browser) {
    const userId = localStorage.getItem("userid");
    if (userId) {
      uid = userId;
    } else {
      uid = crypto.randomUUID();
      localStorage.setItem("userid", uid);
    }
  }

  const user = writable<string>();
  $: user.set(uid);

  setContext("user", user);
</script>

<div>
  <header class="header">
    <p>Posting as: <span>{$user?.substring(0, 8) ?? ""}</span></p>
    <a href="/">Home</a>
  </header>
  <main>
    <slot />
  </main>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: system-ui, sans-serif;
  }

  :global(html, body) {
    background-color: aliceblue;
    color: rgb(0, 15, 49);
  }

  :global(a:visited) {
    color: inherit;
  }

  div {
    padding: 0.5rem;
    height: 100vh;
  }

  main {
    display: grid;
    place-items: center;
    font-size: 2rem;
    gap: 0.5em;
  }

  .header {
    background-color: lightsteelblue;
    min-height: 5vh;
    padding: 0.5rem 1rem;
    margin-top: 0.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    box-shadow: 1px 3px 4px rgba(37, 37, 37, 0.09);
  }

  .header > * {
    display: block;
  }

  .header > p {
    line-height: 1.5;
    margin: 0;
  }

  .header > a {
    text-decoration: none;
    background-color: rgb(164, 219, 244);
    font-weight: 500;
    border-radius: 6px;
    max-width: fit-content;
    padding: 0.75rem;
    text-transform: uppercase;
    transition: all 175ms ease-in-out;
  }

  .header > a:hover {
    background-color: rgb(52, 110, 218);
    color: white;
  }

  p > span {
    font-weight: bold;
    font-size: 1.1rem;
  }
</style>
