var { query } = require("./utils/fauna");

exports.handler = async () => {
  const messages = await query({
    query: `
      query AllMessages {
        allMessages {
          data {
            name
            message
          }
        }
      }
    `,
  });
  console.log(messages.allMessages.data);

  return {
    statusCode: 200,
    body: JSON.stringify(messages.allMessages.data),
  };
};
