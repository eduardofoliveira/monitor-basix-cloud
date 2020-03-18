require("dotenv").config();
const esl = require("modesl");
const sms = require("./sendSms");
const email = require('./sendEmail')
const moment = require('moment')

let farm_018_failure = false;
let farm_147_failure = false;
let farm_Allianz_failure = false;

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  let callid18 = "";
  let callid147 = "";
  let callidAllianz = "";

  setInterval(() => {
    console.log(moment(new Date()).format('DD-MM-YYYY HH:mm:ss'))

    conn.api(
      //"originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br &bridge({origination_caller_id_number=551112345678}sofia/gateway/basix-cloud/8981@cloud.cloudcom.com.br)",
      "originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/500001@monitora18.cloudcom.com.br 99998888 XML public",
      async result => {
        let [status, call_id] = result.body.split(" ");

        if (status === "+OK") {
          callid18 = call_id.replace("\n", "");
        } else {
          if (!farm_018_failure) {
            await sms.enviarSms(`Falha ao enviar chamada para PBX 18\n${result.body}`, "5511961197559");
            await sms.enviarSms(`Falha ao enviar chamada para PBX 18\n${result.body}`, "5511984303738");
            await sms.enviarSms(`Falha ao enviar chamada para PBX 18\n${result.body}`, "5511982516476");
            await email.sendMail(`suporte.basix@cloudcom.com.br, eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br`, `Falha ao enviar chamada para PBX 18`, `Falha ao enviar chamada para PBX 18 ${result.body}`)
          }
          farm_018_failure = true;
        }
      }
    );

    conn.api(
      //"originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br &bridge({origination_caller_id_number=551112345678}sofia/gateway/basix-cloud/8981@cloud.cloudcom.com.br)",
      "originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/500002@monitora147.cloudcom.com.br 99998888 XML public",
      async result => {
        let [status, call_id] = result.body.split(" ");

        if (status === "+OK") {
          callid147 = call_id.replace("\n", "");
        } else {
          if (!farm_147_failure) {
            await sms.enviarSms(`Falha ao enviar chamada para PBX 147\n${result.body}`, "5511961197559");
            await sms.enviarSms(`Falha ao enviar chamada para PBX 147\n${result.body}`, "5511984303738");
            await sms.enviarSms(`Falha ao enviar chamada para PBX 147\n${result.body}`, "5511982516476");
            await email.sendMail(`suporte.basix@cloudcom.com.br, eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br`, `Falha ao enviar chamada para PBX 147`, `Falha ao enviar chamada para PBX 147 ${result.body}`)
          }
          farm_147_failure = true;
        }
      }
    );

    conn.api(
      //"originate {origination_caller_id_number=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/basix-cloud/Eduardo@cloud.cloudcom.com.br &bridge({origination_caller_id_number=551112345678}sofia/gateway/basix-cloud/8981@cloud.cloudcom.com.br)",
      "originate {origination_caller_id_number=551112345678,origination_caller_id_name=551112345678,sip_contact_user=551112345678,bridge_generate_comfort_noise=true}sofia/gateway/astpp/3010500003@54.233.223.179 99998888 XML public",
      async result => {
        let [status, call_id] = result.body.split(" ");

        if (status === "+OK") {
          callidAllianz = call_id.replace("\n", "");
        } else {
          if (!farm_Allianz_failure) {
            await sms.enviarSms(`Falha ao enviar chamada para Basix Allianz\n${result.body}`, "5511961197559");
            await sms.enviarSms(`Falha ao enviar chamada para Basix Allianz\n${result.body}`, "5511984303738");
            await sms.enviarSms(`Falha ao enviar chamada para Basix Allianz\n${result.body}`, "5511982516476");
            await email.sendMail(`suporte.basix@cloudcom.com.br, eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br`, `Falha ao enviar chamada para PBX Allianz`, `Falha ao enviar chamada para PBX Allianz ${result.body}`)
          }
          farm_Allianz_failure = true;
        }
      }
    );
  }, 60000);

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

  conn.on("esl::event::CHANNEL_HANGUP_COMPLETE::**", async event => {
    if (event.getHeader("Channel-Call-UUID") == callid18) {
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

        if (farm_018_failure) {
          sms.enviarSms(`Farm do PBX 18 normalizado \n${hangup_cause}`, "5511961197559");
          sms.enviarSms(`Farm do PBX 18 normalizado \n${hangup_cause}`, "5511984303738");
          sms.enviarSms(`Farm do PBX 18 normalizado \n${hangup_cause}`, "5511982516476");
          email.sendMail(`suporte.basix@cloudcom.com.br, eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br`, `Farm do PBX 18 normalizado`, `Farm do PBX 18 normalizado ${hangup_cause}`)
        }
        farm_018_failure = false;
        console.log("18 Functionando");

        // console.log(qualidade_percentagem);
        // console.log(qualidade_mos);
        // console.log(pacotes_entrada);
        // console.log(pacotes_saida);
        // console.log(duration);
        // console.log(billsec);
        // console.log(start);
        // console.log(answer);
        // console.log(end);
        // console.log(last_app);
        // console.log(remove_media_ip);
        // console.log(endpoint_disposition);
        // console.log(hangup_cause);
        // console.log("");
      } else {
        if (!farm_018_failure) {
          sms.enviarSms(
            `Falha no PBX 18 após conectar\nDuracao: ${billsec}\nMedia: ${remove_media_ip}\nEndpoint: ${endpoint_disposition}\nDesconexao: ${hangup_cause}`,
            "5511961197559"
          );
          sms.enviarSms(
            `Falha no PBX 18 após conectar\nDuracao: ${billsec}\nMedia: ${remove_media_ip}\nEndpoint: ${endpoint_disposition}\nDesconexao: ${hangup_cause}`,
            "5511984303738"
          );
          sms.enviarSms(
            `Falha no PBX 18 após conectar\nDuracao: ${billsec}\nMedia: ${remove_media_ip}\nEndpoint: ${endpoint_disposition}\nDesconexao: ${hangup_cause}`,
            "5511982516476"
          );
          email.sendMail(`suporte.basix@cloudcom.com.br, eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br`, `Falha no PBX 18 após conectar`, `Falha no PBX 18 após conectar`)
        }
        farm_018_failure = true;

        console.log("18 Erro na conexão da chamada");
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

    if (event.getHeader("Channel-Call-UUID") == callid147) {
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

        if (farm_147_failure) {
          sms.enviarSms(`Farm do PBX 147 normalizado \n${hangup_cause}`, "5511961197559");
          sms.enviarSms(`Farm do PBX 147 normalizado \n${hangup_cause}`, "5511984303738");
          sms.enviarSms(`Farm do PBX 147 normalizado \n${hangup_cause}`, "5511982516476");
          email.sendMail(`suporte.basix@cloudcom.com.br, eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br`, `Farm do PBX 147 normalizado`, `Farm do PBX 147 normalizado ${hangup_cause}`)
        }
        farm_147_failure = false;
        console.log("147 Functionando");
        // console.log("147 Functionando");
        // console.log(qualidade_percentagem);
        // console.log(qualidade_mos);
        // console.log(pacotes_entrada);
        // console.log(pacotes_saida);
        // console.log(duration);
        // console.log(billsec);
        // console.log(start);
        // console.log(answer);
        // console.log(end);
        // console.log(last_app);
        // console.log(remove_media_ip);
        // console.log(endpoint_disposition);
        // console.log(hangup_cause);
        // console.log("");
      } else {
        if (!farm_147_failure) {
          sms.enviarSms(
            `Falha no PBX 147 após conectar\nDuracao: ${billsec}\nMedia: ${remove_media_ip}\nEndpoint: ${endpoint_disposition}\nDesconexao: ${hangup_cause}`,
            "5511961197559"
          );
          sms.enviarSms(
            `Falha no PBX 147 após conectar\nDuracao: ${billsec}\nMedia: ${remove_media_ip}\nEndpoint: ${endpoint_disposition}\nDesconexao: ${hangup_cause}`,
            "5511984303738"
          );
          sms.enviarSms(
            `Falha no PBX 147 após conectar\nDuracao: ${billsec}\nMedia: ${remove_media_ip}\nEndpoint: ${endpoint_disposition}\nDesconexao: ${hangup_cause}`,
            "5511982516476"
          );
          email.sendMail(`suporte.basix@cloudcom.com.br, eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br`, `Falha no PBX 147 após conectar`, `Falha no PBX 147 após conectar`)
        }
        farm_147_failure = true;

        console.log("147 Erro na conexão");
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

    if (event.getHeader("Channel-Call-UUID") == callidAllianz) {
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

      if (billsec > 0/* && pacotes_entrada > 0 && pacotes_saida > 0*/) {
        // Functionando

        if (farm_Allianz_failure) {
          await sms.enviarSms(`Farm do PBX Allianz normalizado \n${hangup_cause}`, "5511961197559");
          await sms.enviarSms(`Farm do PBX Allianz normalizado \n${hangup_cause}`, "5511984303738");
          await sms.enviarSms(`Farm do PBX Allianz normalizado \n${hangup_cause}`, "5511982516476");
          await email.sendMail(`suporte.basix@cloudcom.com.br, eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br`, `Farm do PBX Allianz normalizado`, `Farm do PBX Allianz normalizado ${hangup_cause}`)
        }
        farm_Allianz_failure = false;
        // console.log("147 Functionando");
        // console.log(qualidade_percentagem);
        // console.log(qualidade_mos);
        // console.log(pacotes_entrada);
        // console.log(pacotes_saida);
        // console.log(duration);
        // console.log(billsec);
        // console.log(start);
        // console.log(answer);
        // console.log(end);
        // console.log(last_app);
        // console.log(remove_media_ip);
        // console.log(endpoint_disposition);
        // console.log(hangup_cause);
        // console.log("");
      } else {
        if (!farm_Allianz_failure) {
          sms.enviarSms(
            `Falha no PBX Allianz após conectar\nDuracao: ${billsec}\nMedia: ${remove_media_ip}\nEndpoint: ${endpoint_disposition}\nDesconexao: ${hangup_cause}`,
            "5511961197559"
          );
          sms.enviarSms(
            `Falha no PBX Allianz após conectar\nDuracao: ${billsec}\nMedia: ${remove_media_ip}\nEndpoint: ${endpoint_disposition}\nDesconexao: ${hangup_cause}`,
            "5511984303738"
          );
          sms.enviarSms(
            `Falha no PBX Allianz após conectar\nDuracao: ${billsec}\nMedia: ${remove_media_ip}\nEndpoint: ${endpoint_disposition}\nDesconexao: ${hangup_cause}`,
            "5511982516476"
          );
          email.sendMail(`suporte.basix@cloudcom.com.br, eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br`, `Falha no PBX Allianz após conectar`, `Falha no PBX Allianz após conectar`)
        }
        farm_Allianz_failure = true;

        console.log("Allianz Erro na conexão");
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
