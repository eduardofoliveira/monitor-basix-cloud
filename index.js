const esl = require("modesl");

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.api("status", function(res) {
    console.log(res.getBody());
  });
});
