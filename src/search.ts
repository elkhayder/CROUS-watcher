import { FormatHousing } from "./formatters";
import axios from "axios";
import type { Accommodation, City, SearchCityResponse } from "./types";
import DB from "./db";
import { SendTelegramMessage, InformAdmin } from "./bot";
import { retries } from ".";

export const FetchAllCities = () => {
   for (const city of DB.data.cities) {
      FetchCity(city);
   }
};

export const FetchCity = async (city: City) => {
   const retry = retries;
   try {
      console.log(`    Retry #${retry}: Fetching ${city.name}`);

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
            location: city.bounds,
         })
         .then((x) => x.data);

      if (data.results.total == 0) {
         console.log(`    Retry #${retry}: No results in ${city.name}`);
         return;
      }

      const results: Accommodation[] = data.results.items;

      InformParticipants(city, results);
   } catch (e) {
      InformAdmin(`Error fetching ${city.name}: ${e}`);
   }
};

export const SearchCity = async (
   query: string,
   limit = 3
): Promise<SearchCityResponse[] | null> => {
   const OSM_keys = ["region", "state", "city", "town", "village"];
   try {
      const data = await axios
         .get("https://trouverunlogement.lescrous.fr/photon/api", {
            params: {
               q: query,
               limit,
               lang: "fr",
            },
         })
         .then((x) => x.data);

      return data.features.filter(
         (x: SearchCityResponse) =>
            x.properties.osm_key == "place" &&
            OSM_keys.includes(x.properties.osm_value) &&
            x.properties.extent != null
      );
   } catch (e) {
      InformAdmin(`Error fetching: ${e}`);
   }
   return null;
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

      if (!user) {
         console.error("Couldn't find user with id: " + participant);
         continue;
      }

      SendTelegramMessage(user, message);
   }
};
