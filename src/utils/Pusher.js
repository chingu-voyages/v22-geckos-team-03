import Pusher from "pusher-js";

const PUSHER_KEY = "6edf6832eba1a1944fc0";

export default new Pusher(PUSHER_KEY, {
  cluster: "us3",
  authEndpoint: "/.netlify/functions/auth",
});
