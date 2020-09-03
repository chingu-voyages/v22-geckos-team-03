import Pusher from "pusher-js";

export default new Pusher("6edf6832eba1a1944fc0", {
  cluster: "us3",
  authEndpoint: "/.netlify/functions/auth",
});
