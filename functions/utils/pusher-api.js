var Pusher = require("pusher");

module.exports = function (
  {
    appId = "1063365",
    key = process.env.PUSHER_KEY,
    secret = process.env.PUSHER_SECRET,
    cluster = "us3",
  } = {},
  log = false
) {
  // Enable Pusher logging
  Pusher.logToConsole = log;

  return new Pusher({ appId, key, secret, cluster });
};
