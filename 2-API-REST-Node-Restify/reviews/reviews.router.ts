import { Server, Request, Response, Next } from "restify";

import ModelRouter from "../common/model-router";
import Review from "./reviews.model";

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review);
  }

  findById = (req: Request, resp: Response, next: Next) => {
    Review.findById(req.params.id)
      .populate("user", "name")
      .populate("restaurant")
      .then(this.render(resp, next))
      .catch(next);
  };

  applyRoutes(application: Server) {
    const { validateId, findAll, findById, save } = this;

    application.get("/reviews", findAll);
    application.get("/reviews/:id", [validateId, findById]);
    application.post("/reviews", save);
  }
}

export default new ReviewsRouter();
