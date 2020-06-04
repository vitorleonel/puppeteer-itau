const { WebClient } = require("@slack/web-api");

const client = new WebClient(process.env.SLACK_TOKEN);

module.exports = client;
