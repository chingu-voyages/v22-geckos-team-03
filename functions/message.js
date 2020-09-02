// Currently unused
// TODO: Remove if unused during prod. Also auth.js
var pusherAPI = require("./utils/pusher-api");

exports.handler = async ({ body }) => {
  var { message, name } = JSON.parse(body);
  if (message && name) {
    var pusher = pusherAPI();

    pusher.trigger("private-chat", "message-added", { message, name });
    return {
      statusCode: 200,
    };
  }
};
