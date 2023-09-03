import { InformAdmin, bot } from "./bot";
import DB from "./db";
import { FetchAllCities } from "./search";
import Cron from "node-cron";

export var retries = 0;

DB.read();

bot.start();

const CitiesFetcherCron = Cron.schedule(
   "*/5 * 6-20 * * *",
   () => {
      retries++;
      console.log("-------------------------------");
      console.log(`Retry #${retries}: Fetching Cities`);
      FetchAllCities();
   },
   {
      timezone: "Europe/Paris",
   }
);

const ScriptIsRunningAlert = () => {
   let message = `Script is still running, retry *#${retries}*`;
   console.info(message);

   InformAdmin(message);
};

// Script is Running
ScriptIsRunningAlert();
const ScriptIsRunningAlertCron = Cron.schedule(
   "0 0 */3 * * *",
   ScriptIsRunningAlert,
   {
      timezone: "Europe/Paris",
   }
);
