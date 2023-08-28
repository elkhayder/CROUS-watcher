import TeleBot from "telebot";
import DB from "./db";
import { User } from "./types";
import { randomUUID } from "crypto";
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
   bot.sendMessage(conversationId, reply);
});

bot.inlineKeyboard;
