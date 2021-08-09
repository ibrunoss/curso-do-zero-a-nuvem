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

  envelope(document) {
    const resource = super.envelope(document);
    const restaurant = resource.restaurant._id || resource.restaurant;

    resource._links.restaurant = `/restaurants/${restaurant}`;

    return resource;
  }

  applyRoutes(application: Server) {
    const { validateId, findAll, findById, save } = this;

    application.get(this.basePath, findAll);
    application.get(`${this.basePath}/:id`, [validateId, findById]);
    application.post(this.basePath, save);
  }
}

export default new ReviewsRouter();
