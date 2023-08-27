import { Accommodation, Rent, Area } from "./types";

export const SnakeToTitleCase = (str: string) =>
   str
      .split("_")
      .map((x) => x[0].toUpperCase() + x.slice(1))
      .join(" ");

export const FormatHousing = (result: Accommodation) => {
   // Label
   let message =
      "● Residence: [" +
      result.residence.label +
      "](https://trouverunlogement.lescrous.fr/tools/31/accommodations/" +
      result.id +
      ") \n";

   // Address
   message +=
      "● Address: [" +
      result.residence.address +
      "](https://maps.google.com/?q=" +
      result.residence.address +
      ")\n";
   message += "● Area: " + FormatArea(result.area) + "\n";
   message += "● Occupation modes: " + "\n";
   for (const mode of result.occupationModes) {
      message +=
         // Padding
         "    - " +
         SnakeToTitleCase(mode.type) +
         " " +
         FormatPrice(mode.rent) +
         "\n";
   }

   return message;
};

export const FormatPrice = (rent: Rent) => {
   if (rent.min == rent.max) return rent.min / 100 + "€";
   return rent.min / 100 + "-" + rent.max / 100 + "€";
};

export const FormatArea = (area: Area) => {
   if (area.min == area.max) return area.min + "m²";
   return area.min + "-" + area.max + "m²";
};
