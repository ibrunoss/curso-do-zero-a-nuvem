import { Request, Response, Server } from "restify";
import { NotFoundError } from "restify-errors";

import ModelRouter from "../common/model-router";
import Restaurant from "./restaurants.model";

class RestaurantsRouter extends ModelRouter<Restaurant> {
  constructor() {
    super(Restaurant);
  }

  findMenu = (req: Request, res: Response, next) => {
    Restaurant.findById(req.params.id, "+menu")
      .then((restaurant) => {
        if (!restaurant) {
          throw new NotFoundError("Restaurant not found");
        }

        res.json(restaurant.menu);

        return next();
      })
      .catch(next);
  };

  replaceMenu = (req: Request, res: Response, next) => {
    Restaurant.findById(req.params.id)
      .then((restaurant) => {
        if (!restaurant) {
          throw new NotFoundError("Restaurant not found");
        }

        restaurant.menu = req.body; //Deve ser um ARRAY de MenuItem
        return restaurant.save();
      })
      .then((restaurant) => {
        res.json(restaurant.menu);

        return next();
      })
      .catch(next);
  };
  applyRoutes(application: Server) {
    const {
      validateId,
      findAll,
      findById,
      save,
      replace,
      update,
      remove,
      findMenu,
      replaceMenu,
    } = this;

    application.get("/restaurants", findAll);
    application.get("/restaurants/:id", [validateId, findById]);
    application.get("/restaurants/:id/menu", [validateId, findMenu]);

    application.post("/restaurants", save);

    application.put("/restaurants/:id", [validateId, replace]);
    application.put("/restaurants/:id/menu", [validateId, replaceMenu]);

    application.patch("/restaurants/:id", [validateId, update]);

    application.del("/restaurants/:id", [validateId, remove]);
  }
}

export default new RestaurantsRouter();
