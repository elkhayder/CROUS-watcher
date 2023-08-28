import { InformAdmin, bot } from "./bot";
import DB from "./db";
import { FetchCities } from "./search";

var retries = 0;

DB.read();

bot.start(); // TODO: Handle

// handler
setInterval(() => {
   retries++;
   console.log(`Retry #${retries}: Fetching Cities`);
   FetchCities();
}, 5 * 1000); // 5 seconds

const ScriptIsRunningAlert = () => {
   let message = `Script is still running, retry *#${retries}*`;
   console.info(message);

   InformAdmin(message);
};

// Script is Running
ScriptIsRunningAlert();
setInterval(ScriptIsRunningAlert, 6 * 60 * 60 * 1000); // 6 hours
