const axios = require("axios");
const cron = require("node-cron");
var http = require("http");

const config = { timezone: "Africa/Casablanca" };

var retries = 0;

const sendMessage = (message) => {
   try {
      axios.default.get(
         "https://api.callmebot.com/whatsapp.php?phone=33745640961&apikey=6568151&text=" +
            encodeURIComponent(message)
      );
   } catch (e) {
      console.log(`Error: ${e}`);
   }
};

const handler = async () => {
   ++retries;
   try {
      const r = await axios.default
         .post("https://trouverunlogement.lescrous.fr/api/fr/search/27", {
            precision: 5,
            need_aggregation: true,
            page: 1,
            pageSize: 24,
            sector: null,
            idTool: 27,
            occupationModes: [],
            equipment: [],
            price: { min: 0, max: null },
            location: [
               { lon: 7.6881, lat: 48.6462 },
               { lon: 7.8361, lat: 48.4919 },
            ],
         })
         .then((r) => r.data);

      let message = `*Retry #${retries}*: Found ${r.results.total} result(s)`;

      console.log(message);

      if (r.results?.total == 0) return;

      sendMessage(message);
   } catch (e) {
      sendMessage(`Error, ${e}`);
   }
};

const scriptRunningInform = () => {
   let message = `Script is still running, retry *#${retries}*`;
   console.log(message);

   sendMessage(message);
};

cron.schedule("*/30 * * * * *", handler, config);
cron.schedule("* */6 * * *", scriptRunningInform, config);

scriptRunningInform();
