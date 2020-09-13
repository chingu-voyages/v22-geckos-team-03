// Pusher auth function
var pusherAPI = require("./utils/pusher-api");

exports.handler = async (event) => {
  if (event.httpMethod == "POST") {
    var { socket_id: socketId, channel_name: channel } = JSON.parse(event.body);
    if (socketId && channel) {
      var pusher = pusherAPI();

      var auth = pusher.authenticate(socketId, channel);
      // return generated auth code to client
      return { statusCode: 200, body: { auth } };
    } else {
      return {
        statusCode: 400,
        body: { data: "Invalid or missing socket ID or channel" },
      };
    }
  }
};
