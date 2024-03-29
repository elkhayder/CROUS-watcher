import TeleBot from "telebot";
import DB from "./db";
import { City, User } from "./types";
import { randomUUID } from "crypto";
import { SearchCity } from "./search";
require("dotenv").config();

export const bot = new TeleBot({ token: process.env.TELEGRAM_BOT_TOKEN! });

export const SendTelegramMessage = async (to: User, message: string) => {
   try {
      console.info(
         `Sending message to ${to.firstName} ${to.lastName}: ${message}`
      );
      bot.sendMessage(to.conversationId, message, { parseMode: "Markdown" });
   } catch (e) {
      console.error(
         `Error sending telegram message to ${to.firstName} ${to.lastName}: ${e}`
      );
   }
};

export const InformAdmin = (message: string) => {
   SendTelegramMessage(DB.admin, message);
};

bot.on("/start", (msg) => {
   console.info(
      `Received /start from ${msg.from.firstName} ${msg.from.lastName}`
   );

   const conversationId = msg.chat.id;
   const firstName = msg.from.first_name;
   const lastName = msg.from.last_name;

   var reply;

   if (DB.data.users.find((x) => x.conversationId == conversationId)) {
      console.info(`User ${firstName} ${lastName} already exists`);
      reply = `Yo are already registered!`;
   } else {
      console.info(`User ${firstName} ${lastName} does not exist, creating`);
      DB.data.users.push({
         conversationId,
         firstName,
         lastName,
         id: randomUUID(),
         verified: false,
      });
      DB.save();
      reply = `Welcome to the CROUS bot! You have been successfully registered to the list, add your cities with /addcity`;
   }

   return bot.sendMessage(conversationId, reply);
});

bot.on("/addcity", async (msg) => {
   const conversationId = msg.chat.id;
   if (!DB.data.users.find((x) => x.conversationId == conversationId)) {
      bot.sendMessage(
         conversationId,
         "You are not registered, please use /start"
      );
      return;
   }

   const city = msg.text.replace("/addcity", "").trim() as string;
   if (city.length == 0) {
      return bot.sendMessage(conversationId, "Please specify a city");
   }

   const result = await SearchCity(city);
   if (result === null) {
      bot.sendMessage(conversationId, "Internal server error");
      return;
   }

   if (result.length == 0) {
      return bot.sendMessage(
         conversationId,
         "No results found, try to correct typos if any."
      );
   }

   const replyMarkup = bot.inlineKeyboard(
      result.map((x) => {
         const label = `${x.properties.name} - ${x.properties.state}`;
         const DBCityObject: City = {
            name: x.properties.name,
            bounds: [
               { lat: x.properties.extent[0], lon: x.properties.extent[1] },
               { lat: x.properties.extent[2], lon: x.properties.extent[3] },
            ],
            participants: [],
         };
         return [
            bot.inlineButton(label, {
               callback: { type: "addcity", city: DBCityObject },
            }),
         ];
      })
   );

   return bot.sendMessage(msg.from.id, `Your search result for **${city}**`, {
      replyMarkup,
   });
});

bot.on("callbackQuery", (msg) => {
   console.log(JSON.stringify(msg));

   return bot.answerCallbackQuery(msg.id, {
      text: `Inline button callback: ${msg.data}`,
   });
});
