const Conversations_IDS = {
   elkhayder: 1272382441,
   elbihel: 1602323138,
};

const Locations = [
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
      participants: [Conversations_IDS.elbihel, Conversations_IDS.elkhayder],
   },
   {
      name: "Brest",
      location: [
         { lon: -4.5689169, lat: 48.4595521 },
         { lon: -4.4278311, lat: 48.3572972 },
      ],
      participants: [Conversations_IDS.elkhayder],
   },
];

const SystemAdmin = Conversations_IDS.elkhayder;

module.exports = {
   Locations,
   SystemAdmin,
};
