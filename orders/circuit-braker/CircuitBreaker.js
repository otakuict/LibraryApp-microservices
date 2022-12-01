const fetch = require("node-fetch");
const EventTracking = require("./EventTracking");
const config = require("./config");
const axios = require("axios");
const event = EventTracking();
var lastFailedCall = 0; // timestamp
var failedCalls = 0;
const CircuitBreaker = () => {
  return {
    callAPI: async (url) => {
      const now = Date.now();
      /* Se ocorrer erro, aguarda 10s até a  fazer requisição novamente */

      if (failedCalls >= 3) {
        if (lastFailedCall && now - lastFailedCall <= 10000) {
          console.log("Skipping call");

          console.log(
            "lastfail call logic",
            lastFailedCall && now - lastFailedCall
          );
          console.log("-------------------------");
          return "something wrong";
        }
      }
      try {
        const port = config.port;
        const response = await await axios.get(url);
        const json = await response;

        event.healthcheckStatus(json.status);
        console.log("test", json.data);
        failedCalls = 0;
        return json.data;
      } catch (e) {
        /*
         * Quando há erro na requisição, quarda o timestamp de
         * quando ocorreu o erro e conta a quantidade de erros
         * */
        lastFailedCall = Date.now();
        failedCalls++;
        console.log("failcount", failedCalls);
        event.healthcheckFailed(e.message);

        /* Se a quantidade de erros for maior que 3 mostra uma mensagem diferente */
        if (failedCalls >= 5) {
          event.healthcheckFailed("FIX THIS NOW!");
        }
      }
    },
  };
};

module.exports = CircuitBreaker;
