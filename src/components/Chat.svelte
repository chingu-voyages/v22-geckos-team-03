<script>
  import Pusher from "pusher-js";
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { fly, fade } from "svelte/transition";
  import netlifyIdentity from "netlify-identity-widget";
  import pusher from "../utils/Pusher";

  let messages = [];
  let chatMessage = "";

  let username;
  let dbQuery;
  let subscribed = false;

  onMount(() => {
    netlifyIdentity.init({
      container: "#netlify-modal", // defaults to document.body
      locale: "en", // defaults to 'en'
      logo: false,
    });
    netlifyIdentity.on("login", () => {
      netlifyIdentity.close();
      username = localStorage.getItem("gotrue.user");
      username = JSON.parse(username).user_metadata.full_name;
      loadServices();
    });
    netlifyIdentity.on("close", async () => {
      if (!username) {
        netlifyIdentity.open();
      }
    });
    netlifyIdentity.on("logout", () => (username = null));

    username = localStorage.getItem("gotrue.user");
    username =
      (username && JSON.parse(username).user_metadata.full_name) || null;
    // username = "dev_env"; // Comment out line in prod, for dev testing purposes only w/ Netlify Identity's buggy dev login
    if (!username) {
      // not logged in, open login
      netlifyIdentity.open();
    } else {
      loadServices();
    }

    function loadServices() {
      // preload the messages
      dbQuery = fetch("/.netlify/functions/get-messages").then((res) =>
        res.json()
      );

      // sub to the chat channel
      const channel = pusher.subscribe("chat-channel");
      channel.bind("message", (data) => {
        messages = [...messages, data];
      });

      subscribed = true;
    }
  });
</script>

<style>
  .background {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 100vw;
    min-height: 100vh;
    background: #f4f8fb;
    margin: 0;
  }
  .chat-container {
    display: inline-block;
    padding: 1em;
  }
  p {
    margin: 0;
  }
  .msgbox {
    display: inline-block;
    border-radius: 1em;
    border-top-left-radius: 0;
    background: #e4eaf2;
    margin-bottom: 1em;
    padding: 0.5em 1em;
  }
  .name {
    font-weight: 500;
  }
  input {
    max-height: 50%;
    display: inline-block;
    border: 1px solid lightgray;
    border-radius: 0.2em;
    padding: 0.7em;
  }
  .logout-btn {
    height: 2.2em;
    padding: 0 1em;
    font-weight: 500;
    color: white;
    background-color: hsl(251, 94%, 66%);
    border: none;
    border-radius: 1em;
  }
  .logout-btn:hover {
    background-color: hsl(251, 94%, 62%);
  }
  .logout-btn:active {
    background-color: hsl(251, 94%, 58%);
  }
  .outline {
    outline: none;
    transition: all 0.15s ease-out;
  }
  .outline:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
  }

  @media (min-width: 720px) {
    .chat-container {
      border: 1px solid lightgray;
      border-radius: 1em;
    }
  }
</style>

<div id="netlify-modal" />

<div class="background">
  {#if dbQuery && username}
    {#await dbQuery then dbMessages}
      <div transition:fade class="chat-container">
        <div style="display: flex; justify-content: space-between;">
          <h1>Chat</h1>
          <button
            class="logout-btn outline"
            on:click={() => {
              netlifyIdentity.logout();
              netlifyIdentity.open();
            }}>Logout</button>
        </div>

        <div transition:fly={{ y: -20, duration: 200 }}>
          {#each [...dbMessages, ...messages] as { name, message }}
            <!-- make inline div stack -->
            <div transition:fade>
              <p class="name">{name}</p>
              <div class="msgbox">
                <p class="message">{message}</p>
              </div>
            </div>
          {/each}
        </div>

        {#if subscribed}
          <form
            on:submit|preventDefault={() => {
              console.log(chatMessage);
              const resp = fetch('/.netlify/functions/send-message', {
                method: 'post',
                body: JSON.stringify({
                  name: username,
                  message: chatMessage,
                }),
              });
              chatMessage = '';
            }}>
            <input
              class="outline"
              type="text"
              placeholder="Type in something..."
              on:change={(e) => (chatMessage = e.target.value)}
              value={chatMessage} />
          </form>
        {/if}
      </div>
    {/await}
  {/if}
</div>
