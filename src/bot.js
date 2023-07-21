const TeleBot = require("telebot");
const { Locations, SystemAdmin } = require("./constants");
const { FormatHousing } = require("./formatters");
const axios = require("axios");

require("dotenv").config();

var retries = 0;

const bot = new TeleBot({ token: process.env.TELEGRAM_BOT_TOKEN });

const CheckCity = async (city) => {
   console.log(`Retry #${retries}: Checking ${city.name}`);
   try {
      const data = await axios.default
         .post("https://trouverunlogement.lescrous.fr/api/fr/search/31", {
            idTool: 31,
            need_aggregation: true,
            page: 1,
            pageSize: 24,
            sector: null,
            occupationModes: [],
            residence: null,
            precision: 6,
            equipment: [],
            price: { min: 0, max: 10000000 },
            location: city.location,
         })
         .then((x) => x.data);

      if (data.results?.total == 0) return;

      InformParticipants(city, data);
   } catch (e) {
      InformAdmin(`Error Checking City ${city.name}: ${e}`);
   }
};

const SendTelegramMessage = (to, message) => {
   bot.sendMessage(to, message, { parseMode: "Markdown" });
};

const InformParticipants = (city, data) => {
   let message = `Found *${data.results?.total}* in *${city.name}*: \n`;

   for (const result of data.results?.items) {
      message += "\n-------------------\n";
      message += FormatHousing(result);
      message += "-------------------\n";
   }
   for (const participant of city.participants) {
      SendTelegramMessage(participant, message);
   }
};

const InformAdmin = (message) => {
   console.log("Sending to Admin:", message);
   SendTelegramMessage(SystemAdmin, message);
};

const handler = async () => {
   ++retries;
   for (const city of Locations) {
      await CheckCity(city);
   }
};

const scriptRunningInform = () => {
   let message = `Script is still running, retry *#${retries}*`;
   console.log(message);

   InformAdmin(message);
};

module.exports = () => {
   setInterval(handler, 15 * 1000); // 15 seconds
   setInterval(scriptRunningInform, 6 * 60 * 60 * 1000); // 6 hours
   scriptRunningInform();
   bot.start();
};
