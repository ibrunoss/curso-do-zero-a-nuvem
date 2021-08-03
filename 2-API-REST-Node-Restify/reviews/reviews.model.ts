import { Schema, Document, Types, model } from "mongoose";

import Restaurant from "../restaurants/restaurants.model";
import User from "../users/user.model";

interface Review extends Document {
  date: Date;
  rating: number;
  comments: string;
  restaurant: Types.ObjectId | Restaurant;
  user: Types.ObjectId | User;
}

const reviewSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comments: {
    type: String,
    required: true,
    maxlength: 500,
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Review = model<Review>("Review", reviewSchema);

export default Review;
