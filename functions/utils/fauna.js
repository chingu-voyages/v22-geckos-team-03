const fetch = require("node-fetch");

async function query({ query, variables = {} }) {
  const result = await fetch("https://graphql.fauna.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FAUNA_SECRET}`,
    },
    body: JSON.stringify({ query, variables }),
  }).then((response) => response.json());

  // TODO send back helpful information if there are errors

  return result.data;
}

exports.query = query;
