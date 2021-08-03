import { Model, Document, Query, Types } from "mongoose";
import { NotFoundError } from "restify-errors";

import Router from "./router";

export default abstract class ModelRouter<D extends Document> extends Router {
  constructor(protected model: Model<D>) {
    super();
  }

  protected prepareOne(query: Query<D, {}>): Query<D, {}> {
    return query;
  }

  validateId = (req, resp, next) => {
    const { id } = req.params;

    if (Types.ObjectId.isValid(id)) {
      return next();
    }

    next(new NotFoundError("Document not found"));
  };

  findAll = (req, resp, next) => {
    this.model.find().then(this.renderAll(resp, next)).catch(next);
  };

  findById = (req, resp, next) => {
    this.prepareOne(this.model.findById(req.params.id))
      .then(this.render(resp, next))
      .catch(next);
  };

  save = (req, resp, next) => {
    const document = new this.model(req.body);
    document.save().then(this.render(resp, next)).catch(next);
  };

  replace = (req, resp, next) => {
    const options = { runValidators: true };
    this.model
      .replaceOne({ _id: req.params.id }, req.body, options)
      .exec()
      .then((result) => {
        if (result.n) {
          return this.model.findById(req.params.id);
        }
        throw new NotFoundError("Document not found");
      })
      .then(this.render(resp, next))
      .catch(next);
  };

  update = (req, resp, next) => {
    const options = { new: true, runValidators: true };
    this.model
      .findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(resp, next))
      .catch(next);
  };

  remove = (req, resp, next) => {
    this.model
      .remove({ _id: req.params.id })
      .exec()
      .then((result) => {
        if (result.n) {
          resp.send(204);
        } else {
          throw new NotFoundError("Documento não encontrado");
        }
        return next();
      })
      .catch(next);
  };
}
