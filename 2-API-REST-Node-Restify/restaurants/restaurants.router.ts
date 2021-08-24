import { Request, Response, Server } from "restify";
import { NotFoundError } from "restify-errors";

import ModelRouter from "../common/model-router";
import Restaurant from "./restaurants.model";
import { authorize } from "../security/auth.handler";
class RestaurantsRouter extends ModelRouter<Restaurant> {
  constructor() {
    super(Restaurant);
  }

  envelope(document) {
    const resource = super.envelope(document);
    resource._links.menu = `${resource._links.self}/menu`;
    return resource;
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

    application.get(this.basePath, findAll);
    application.get(`${this.basePath}/:id`, [validateId, findById]);
    application.get(`${this.basePath}/:id/menu`, [validateId, findMenu]);

    application.post(this.basePath, [authorize("admin"), save]);

    application.put(`${this.basePath}/:id`, [
      authorize("admin"),
      validateId,
      replace,
    ]);
    application.put(`${this.basePath}/:id/menu`, [
      authorize("admin"),
      validateId,
      replaceMenu,
    ]);

    application.patch(`${this.basePath}/:id`, [
      authorize("admin"),
      validateId,
      update,
    ]);

    application.del(`${this.basePath}/:id`, [
      authorize("admin"),
      validateId,
      remove,
    ]);
  }
}

export default new RestaurantsRouter();
