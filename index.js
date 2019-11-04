const esl = require("modesl");

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  // conn.execute(
  //   "originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br &bridge({origination_caller_id_number=551112345678}sofia/gateway/basix-cloud/Luiz@cloud.cloudcom.com.br)",
  //   function(res) {
  //     console.log(res.getBody());
  //   }
  // );

  // conn.execute(
  //   "originate",
  //   "{origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br &bridge({origination_caller_id_number=551112345678}sofia/gateway/basix-cloud/Luiz@cloud.cloudcom.com.br)",
  //   function(res) {
  //     console.log(res.getBody());
  //   }
  // );

  // conn.originate(
  //   "{origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br &bridge{origination_caller_id_number=551112345678}sofia/gateway/basix-cloud/Luiz@cloud.cloudcom.com.br",
  //   function(res) {
  //     console.log(res.getBody());
  //   }
  // );
  conn.api(
    "originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br &bridge({origination_caller_id_number=551112345678}sofia/gateway/basix-cloud/8951@cloud.cloudcom.com.br)",
    result => {
      console.log(result);
    }
  );

  conn.on("esl::event::CHANNEL_BRIDGE::**", event => {
    console.log(event.getHeader("Channel-Call-UUID"));
  });

  conn.on("esl::event::CHANNEL_HANGUP_COMPLETE::**", event => {
    console.log(event.getHeader("Channel-Call-UUID"));
  });
});
