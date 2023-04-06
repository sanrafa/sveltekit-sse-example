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

<header>
  <p>USER ID: {$user ?? ""}</p>
  <a href="/">GO HOME</a>
</header>
<slot />
