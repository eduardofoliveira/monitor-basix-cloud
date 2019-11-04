const esl = require("modesl");

const connectionOptions = {
  host: "127.0.0.1",
  port: 8021
};

const connection = esl.Connection.createInbound(connectionOptions, "ClueCon", function() {
  connection.api("status", function(res) {
    console.log(res.getBody());
  });
});
