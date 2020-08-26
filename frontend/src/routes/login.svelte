<style>
  input {
    min-height: 2rem;
    font-size: 1rem;
  }
</style>

<svelte:head>
  <title>Login</title>
</svelte:head>

<!-- TODO: wire up form submit handler -->
<form on:submit|preventDefault={(e) => ''}>
  <input type="text" placeholder="user" />
  <input type="password" placeholder="password" />
</form>
