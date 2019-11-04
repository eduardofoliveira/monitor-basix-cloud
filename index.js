const esl = require("modesl");

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  let callid = "";

  conn.api(
    //"originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br &bridge({origination_caller_id_number=551112345678}sofia/gateway/basix-cloud/8981@cloud.cloudcom.com.br)",
    "originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/IVR_Monitora18@monitora18.cloudcom.com.br 99998888 XML public",
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

  // conn.on("esl::event::CHANNEL_BRIDGE::**", event => {
  //   if (event.getHeader("Channel-Call-UUID") == callid) {
  //     let evento = event.getHeader("Event-Name");
  //     let callid = event.getHeader("Channel-Call-UUID");
  //     let from = event.getHeader("Other-Leg-Caller-ID-Number");
  //     let to = event.getHeader("Other-Leg-Callee-ID-Number");

  //     console.log({ evento, callid, from, to });
  //   }
  // });

  conn.on("esl::event::CHANNEL_HANGUP_COMPLETE::**", event => {
    if (event.getHeader("Channel-Call-UUID") == callid) {
      let qualidade_percentagem = event.getHeader("variable_rtp_audio_in_quality_percentage");
      let qualidade_mos = event.getHeader("variable_rtp_audio_in_mos");
      let pacotes_entrada = event.getHeader("variable_rtp_audio_in_packet_count");
      let pacotes_saida = event.getHeader("variable_rtp_audio_out_packet_count");

      let duration = event.getHeader("variable_duration");
      let billsec = event.getHeader("variable_billsec");

      let start = event.getHeader("variable_start_stamp");
      let answer = event.getHeader("variable_answer_stamp");
      let end = event.getHeader("variable_end_stamp");

      let last_app = event.getHeader("variable_last_app");
      let remove_media_ip = event.getHeader("variable_remote_media_ip");
      let endpoint_disposition = event.getHeader("variable_endpoint_disposition");
      let hangup_cause = event.getHeader("variable_hangup_cause");

      if (billsec > 0 && pacotes_entrada > 0 && pacotes_saida > 0) {
        // Functionando
        console.log("Functionando");

        console.log(qualidade_percentagem);
        console.log(qualidade_mos);
        console.log(pacotes_entrada);
        console.log(pacotes_saida);
        console.log(duration);
        console.log(billsec);
        console.log(start);
        console.log(answer);
        console.log(end);
        console.log(last_app);
        console.log(remove_media_ip);
        console.log(endpoint_disposition);
        console.log(hangup_cause);
        console.log("");
      } else {
        console.log("Erro na conexão");

        console.log(qualidade_percentagem);
        console.log(qualidade_mos);
        console.log(pacotes_entrada);
        console.log(pacotes_saida);
        console.log(duration);
        console.log(billsec);
        console.log(start);
        console.log(answer);
        console.log(end);
        console.log(last_app);
        console.log(remove_media_ip);
        console.log(endpoint_disposition);
        console.log(hangup_cause);
        console.log("");
        // Enviar e-mail com os detalhes
      }
      // let evento = event.getHeader("Event-Name");
      // let callid = event.getHeader("Channel-Call-UUID");
      // let from = event.getHeader("Other-Leg-Caller-ID-Number");
      // let to = event.getHeader("Other-Leg-Callee-ID-Number");

      // console.log(JSON.stringify(event, null, 2));

      // console.log({ evento, callid, from, to });
    }
  });
});
