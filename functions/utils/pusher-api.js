var Pusher = require("pusher");

module.exports = function (
  {
    appId = "1063365",
    key = "6edf6832eba1a1944fc0",
    secret = process.env.PUSHER_SECRET,
    cluster = "us3",
  } = {},
  log = false
) {
  // Enable Pusher logging
  Pusher.logToConsole = log;

  return new Pusher({ appId, key, secret, cluster });
};
