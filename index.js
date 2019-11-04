const esl = require("modesl");

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  let callid = "";

  conn.api(
    "originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br &bridge({origination_caller_id_number=551112345678}sofia/gateway/basix-cloud/8951@cloud.cloudcom.com.br)",
    result => {
      let [status, call_id] = result.body.split(" ");
      if (status === "+OK") {
        callid = call_id;
      }
    }
  );

  conn.on("esl::event::CHANNEL_BRIDGE::**", event => {
    if (event.getHeader("Channel-Call-UUID") === callid) {
      console.log(event);
    }
  });

  conn.on("esl::event::CHANNEL_HANGUP_COMPLETE::**", event => {
    if (event.getHeader("Channel-Call-UUID") === callid) {
      console.log(event);
    }
  });
});
