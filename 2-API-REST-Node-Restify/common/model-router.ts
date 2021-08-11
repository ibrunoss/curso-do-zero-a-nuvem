import { Model, Document, Query, Types } from "mongoose";
import { NotFoundError } from "restify-errors";

import Router from "./router";

export default abstract class ModelRouter<D extends Document> extends Router {
  basePath: string;

  pageSize: number = 2;

  constructor(protected model: Model<D>) {
    super();

    this.basePath = `/${this.model.collection.name}`;
  }

  protected prepareOne(query: Query<D, {}>): Query<D, {}> {
    return query;
  }

  envelope(document: any): any {
    const resource = Object.assign({ _links: {} }, document.toJSON());
    resource._links.self = `${this.basePath}/${resource._id}`;
    return resource;
  }

  envelopeAll(documents: any[], options: any = {}): any {
    const resources: any = {
      _links: { self: options.url },
      items: documents,
    };

    if (options.page && options.count && options.pageSize) {
      if (options.page > 1) {
        resources._links.previous = `${this.basePath}?_page=${
          options.page - 1
        }`;
      }

      const remaining = options.count - options.page * options.pageSize;

      if (remaining > 0) {
        resources._links.next = `${this.basePath}?_page=${options.page + 1}`;
      }
    }

    return resources;
  }

  validateId = (req, resp, next) => {
    const { id } = req.params;

    if (Types.ObjectId.isValid(id)) {
      return next();
    }

    next(new NotFoundError("Document not found"));
  };

  findAll = (req, resp, next) => {
    let page = parseInt(req.query._page || 1);
    page = page > 0 ? page : 1;

    const skip = (page - 1) * this.pageSize;

    this.model
      .countDocuments({})
      .exec()
      .then((count) => {
        const options = {
          page,
          count,
          pageSize: this.pageSize,
          url: req.url,
        };

        return this.model
          .find()
          .skip(skip)
          .limit(this.pageSize)
          .then(this.renderAll(resp, next, options));
      })
      .catch(next);
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
