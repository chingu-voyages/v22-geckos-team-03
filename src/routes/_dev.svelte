<script>
  (async () => {
    let res = await fetch("/.netlify/functions/get-messages");
    console.log(await res.json());
  })();
</script>
