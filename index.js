const axios = require("axios");

const timeout = 5 * 60 * 1000;

var retries = 0;

const sendMessage = (message) => {
   axios.default.get(
      "https://api.callmebot.com/whatsapp.php?phone=+212645262126&apikey=487766&text=" +
         encodeURIComponent(message)
   );
};

const handler = async () => {
   ++retries;
   try {
      const r = await axios.default
         .post(
            "https://private-no-cors-proxy.herokuapp.com/https://trouverunlogement.lescrous.fr/api/fr/search/26",
            {
               precision: 5,
               need_aggregation: true,
               page: 1,
               pageSize: 24,
               sector: null,
               idTool: 26,
               occupationModes: [],
               equipment: [],
               price: { min: 0, max: null },
               location: [
                  { lon: 7.6881, lat: 48.6462 },
                  { lon: 7.8361, lat: 48.4919 },
               ],
            }
         )
         .then((r) => r.data);

      let message = `*Retry #${retries}*: Found ${r.results.total} result(s)`;

      console.log(message);

      if (r.results?.total == 0) return;

      sendMessage(message);
   } catch (e) {
      console.log(`Error, ${e}`);
   }
};

const scriptRunningInform = () => {
   let message = `Script is still running, retry *#${retries}*`;
   console.log(message);

   sendMessage(message);
};

setInterval(scriptRunningInform, timeout * 4);

setInterval(handler, timeout);

handler();
scriptRunningInform();
