"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const menuSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});
const restaurantSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    menu: {
        type: [menuSchema],
        required: false,
        select: false,
        default: [],
    },
});
const Restaurant = mongoose_1.model("Restaurant", restaurantSchema);
exports.default = Restaurant;
