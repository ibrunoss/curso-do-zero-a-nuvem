import { Query } from "mongoose";
import { Server, Request, Response, Next } from "restify";

import ModelRouter from "../common/model-router";
import Review from "./reviews.model";

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review);
  }

  protected prepareOne(query: Query<Review, Review>): Query<Review, Review> {
    return query.populate("user", "name").populate("restaurant");
  }

  applyRoutes(application: Server) {
    const { validateId, findAll, findById, save } = this;

    application.get("/reviews", findAll);
    application.get("/reviews/:id", [validateId, findById]);
    application.post("/reviews", save);
  }
}

export default new ReviewsRouter();
