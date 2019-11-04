const esl = require("modesl");

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  let callid = "";

  conn.api(
    //"originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br &bridge({origination_caller_id_number=551112345678}sofia/gateway/basix-cloud/8981@cloud.cloudcom.com.br)",
    "originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br 99998888 XML public",
    result => {
      let [status, call_id] = result.body.split(" ");

      if (status === "+OK") {
        callid = call_id.replace("\n", "");
      }
    }
  );

  // conn.on("esl::event::**", event => {
  //   if (event.getHeader("Channel-Call-UUID") == callid) {
  //     let evento = event.getHeader("Event-Name");
  //     let callid = event.getHeader("Channel-Call-UUID");
  //     let from = event.getHeader("Other-Leg-Caller-ID-Number");
  //     let to = event.getHeader("Other-Leg-Callee-ID-Number");

  //     console.log({ evento, callid, from, to });
  //   }
  // });

  conn.on("esl::event::CHANNEL_BRIDGE::**", event => {
    if (event.getHeader("Channel-Call-UUID") == callid) {
      let evento = event.getHeader("Event-Name");
      let callid = event.getHeader("Channel-Call-UUID");
      let from = event.getHeader("Other-Leg-Caller-ID-Number");
      let to = event.getHeader("Other-Leg-Callee-ID-Number");

      console.log({ evento, callid, from, to });
    }
  });

  conn.on("esl::event::CHANNEL_HANGUP_COMPLETE::**", event => {
    if (event.getHeader("Channel-Call-UUID") == callid) {
      let evento = event.getHeader("Event-Name");
      let callid = event.getHeader("Channel-Call-UUID");
      let from = event.getHeader("Other-Leg-Caller-ID-Number");
      let to = event.getHeader("Other-Leg-Callee-ID-Number");

      console.log(JSON.stringify(event, null, 2));

      console.log({ evento, callid, from, to });
    }
  });
});
