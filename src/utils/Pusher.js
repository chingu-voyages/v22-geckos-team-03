import Pusher from "pusher-js";

export default new Pusher(process.env.PUSHER_KEY, {
  cluster: "us3",
  authEndpoint: "/.netlify/functions/auth",
});
