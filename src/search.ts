import { FormatHousing } from "./formatters";
import axios from "axios";
import { Accommodation, City } from "./types";
import DB from "./db";
import { SendTelegramMessage, InformAdmin } from "./bot";

export const FetchCities = async () => {
   try {
      const data = await axios
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

      if (data.results.total == 0) return;

      ParseResults(data.results.items);
   } catch (e) {
      InformAdmin(`Error fetching: ${e}`);
   }
};

const ParseResults = (results: Accommodation[]) => {
   for (const city of DB.data.cities) {
      const data = results.filter((x) => {
         const lat = x.residence.location.lat;
         const lon = x.residence.location.lon;
         return (
            lat <= city.bounds[0].lat &&
            lat >= city.bounds[1].lat &&
            lon >= city.bounds[0].lon &&
            lon <= city.bounds[1].lon
         );
      });

      if (data.length == 0) continue;

      InformParticipants(city, data);
   }
};

const InformParticipants = (city: City, data: Accommodation[]) => {
   let message = `Found *${data.length}* in *${city.name}*: \n`;

   for (const result of data) {
      message += "\n-------------------\n";
      message += FormatHousing(result);
      message += "-------------------\n";
   }

   for (const participant of city.participants) {
      const user = DB.data.users.find((x) => x.id == participant);
      if (!user) continue;
      SendTelegramMessage(user, message);
   }
};
