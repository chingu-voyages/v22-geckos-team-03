<script>
  // TODO: wire up form submit handler
  function loginSubmit(e) {
    console.log(e.target[0].value, e.target[0].value);
  }
</script>

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
<form on:submit|preventDefault={loginSubmit}>
  <input type="text" placeholder="user" />
  <input type="password" placeholder="password" />
  <button type="submit">Login</button>
</form>
