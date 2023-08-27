"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatArea = exports.FormatPrice = exports.FormatHousing = exports.SnakeToTitleCase = void 0;
const SnakeToTitleCase = (str) => str
    .split("_")
    .map((x) => x[0].toUpperCase() + x.slice(1))
    .join(" ");
exports.SnakeToTitleCase = SnakeToTitleCase;
const FormatHousing = (result) => {
    // Label
    let message = "● Residence: [" +
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
    message += "● Area: " + (0, exports.FormatArea)(result.area) + "\n";
    message += "● Occupation modes: " + "\n";
    for (const mode of result.occupationModes) {
        message +=
            // Padding
            "    - " +
                (0, exports.SnakeToTitleCase)(mode.type) +
                " " +
                (0, exports.FormatPrice)(mode.rent) +
                "\n";
    }
    return message;
};
exports.FormatHousing = FormatHousing;
const FormatPrice = (rent) => {
    if (rent.min == rent.max)
        return rent.min / 100 + "€";
    return rent.min / 100 + "-" + rent.max / 100 + "€";
};
exports.FormatPrice = FormatPrice;
const FormatArea = (area) => {
    if (area.min == area.max)
        return area.min + "m²";
    return area.min + "-" + area.max + "m²";
};
exports.FormatArea = FormatArea;
