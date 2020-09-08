var pusherAPI = require("./utils/pusher-api");
var { query } = require("./utils/fauna");

function createQuery(name, message) {
  return `
    mutation AddMessage {
      createMessage(data: {
        name: "${name}"
        message: "${message}"
      }) {
          message
          name
      }
    }
  `;
}

exports.handler = async (event) => {
  var data;
  if (event.httpMethod == "POST") {
    data = JSON.parse(event.body);
  }
  if (data && data.name && data.message) {
    var sentMessage = query({ query: createQuery(data.name, data.message) });

    var pusher = pusherAPI();
    var statusCode = await new Promise((resolve, reject) => {
      pusher.trigger("chat-channel", "message", data, (err) => {
        if (err) reject(404);
        else resolve(200);
      });
    });

    await sentMessage;
    console.log(data);

    return {
      statusCode,
      body: statusCode == 200 ? "Boop!" : "Error!",
    };
  } else {
    return {
      statusCode: 400,
      body: "Error: Invalid message!",
    };
  }
};
