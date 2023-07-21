const SnakeToTitleCase = (str) =>
   str
      .split("_")
      .map((x) => x[0].toUpperCase() + x.slice(1))
      .join(" ");

const FormatHousing = (result) => {
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

const FormatPrice = (price) => {
   if (price.min == price.max) return price.min / 100 + "€";
   return price.min / 100 + "-" + price.max / 100 + "€";
};

const FormatArea = (area) => {
   if (area.min == area.max) return area.min + "m²";
   return area.min + "-" + area.max + "m²";
};

module.exports = {
   SnakeToTitleCase,
   FormatHousing,
   FormatPrice,
};
