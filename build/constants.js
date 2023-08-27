"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAdmin = exports.Locations = exports.Conversations_IDS = void 0;
exports.Conversations_IDS = {
    elkhayder: 1272382441,
    elbihel: 1602323138,
    ouchato: 1705155345,
    hamdoune: 1879633608,
    ezzedi: 5152874036,
};
exports.Locations = [
    // {
    //    name: "Strasbourg",
    //    location: [
    //       { lon: 7.6881, lat: 48.6462 },
    //       { lon: 7.8361, lat: 48.4919 },
    //    ],
    // },
    {
        name: "Nantes",
        location: [
            { lon: -1.6418115, lat: 47.2958583 },
            { lon: -1.4788443, lat: 47.1805856 },
        ],
        participants: [exports.Conversations_IDS.elbihel, exports.Conversations_IDS.elkhayder],
    },
    {
        name: "Brest",
        location: [
            { lon: -4.5689169, lat: 48.4595521 },
            { lon: -4.4278311, lat: 48.3572972 },
        ],
        participants: [exports.Conversations_IDS.elkhayder],
    },
];
exports.SystemAdmin = exports.Conversations_IDS.elkhayder;
