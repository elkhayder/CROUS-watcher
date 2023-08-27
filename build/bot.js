"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telebot_1 = __importDefault(require("telebot"));
const formatters_1 = require("./formatters");
const axios_1 = __importDefault(require("axios"));
const db_1 = __importDefault(require("./db"));
require("dotenv").config();
var retries = 0;
const bot = new telebot_1.default({ token: process.env.TELEGRAM_BOT_TOKEN });
const FetchCities = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(`Retry #${retries}: Fetching Cities`);
    try {
        const data = yield axios_1.default
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
            // France's bounds
            location: [
                {
                    lon: -9.9079,
                    lat: 51.7087,
                },
                {
                    lon: 14.3224,
                    lat: 40.5721,
                },
            ],
        })
            .then((x) => x.data);
        if (((_a = data.results) === null || _a === void 0 ? void 0 : _a.total) == 0)
            return;
        ParseResults(data.results.items);
    }
    catch (e) {
        InformAdmin(`Error fetching: ${e}`);
    }
});
const SendTelegramMessage = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.info(`Sending message to ${to.firstName} ${to.lastName}: ${message}`);
        bot.sendMessage(to.conversationId, message, { parseMode: "Markdown" });
    }
    catch (e) {
        console.error(`Error sending telegram message to ${to.firstName} ${to.lastName}: ${e}`);
    }
});
const InformAdmin = (message) => {
    SendTelegramMessage(db_1.default.admin, message);
};
const ParseResults = (results) => {
    for (const city of db_1.default.data.cities) {
        const data = results.filter((x) => {
            const lat = x.area.max;
            const lon = x.area.min;
            return (lat >= city.bounds[0].lat &&
                lat <= city.bounds[1].lat &&
                lon >= city.bounds[0].lon &&
                lon <= city.bounds[1].lon);
        });
        if (data.length == 0)
            continue;
        InformParticipants(city, data);
    }
};
const InformParticipants = (city, data) => {
    let message = `Found *${data.length}* in *${city.name}*: \n`;
    for (const result of data) {
        message += "\n-------------------\n";
        message += (0, formatters_1.FormatHousing)(result);
        message += "-------------------\n";
    }
    for (const participant of city.participants) {
        SendTelegramMessage(participant, message);
    }
};
const handler = () => {
    ++retries;
    FetchCities();
};
const scriptRunningInform = () => {
    let message = `Script is still running, retry *#${retries}*`;
    console.info(message);
    InformAdmin(message);
};
exports.default = () => {
    db_1.default.read();
    setInterval(handler, 15 * 1000); // 15 seconds
    setInterval(scriptRunningInform, 6 * 60 * 60 * 1000); // 6 hours
    scriptRunningInform();
    bot.start();
};
