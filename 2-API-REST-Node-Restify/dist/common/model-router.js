"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const restify_errors_1 = require("restify-errors");
const router_1 = require("./router");
class ModelRouter extends router_1.default {
    constructor(model) {
        super();
        this.model = model;
        this.pageSize = 2;
        this.validateId = (req, resp, next) => {
            const { id } = req.params;
            if (mongoose_1.Types.ObjectId.isValid(id)) {
                return next();
            }
            next(new restify_errors_1.NotFoundError("Document not found"));
        };
        this.findAll = (req, resp, next) => {
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
        this.findById = (req, resp, next) => {
            this.prepareOne(this.model.findById(req.params.id))
                .then(this.render(resp, next))
                .catch(next);
        };
        this.save = (req, resp, next) => {
            const document = new this.model(req.body);
            document.save().then(this.render(resp, next)).catch(next);
        };
        this.replace = (req, resp, next) => {
            const options = { runValidators: true };
            this.model
                .replaceOne({ _id: req.params.id }, req.body, options)
                .exec()
                .then((result) => {
                if (result.n) {
                    return this.model.findById(req.params.id);
                }
                throw new restify_errors_1.NotFoundError("Document not found");
            })
                .then(this.render(resp, next))
                .catch(next);
        };
        this.update = (req, resp, next) => {
            const options = { new: true, runValidators: true };
            this.model
                .findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.remove = (req, resp, next) => {
            this.model
                .remove({ _id: req.params.id })
                .exec()
                .then((result) => {
                if (result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError("Documento não encontrado");
                }
                return next();
            })
                .catch(next);
        };
        this.basePath = `/${this.model.collection.name}`;
    }
    prepareOne(query) {
        return query;
    }
    envelope(document) {
        const resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }
    envelopeAll(documents, options = {}) {
        const resources = {
            _links: { self: options.url },
            items: documents,
        };
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resources._links.previous = `${this.basePath}?_page=${options.page - 1}`;
            }
            const remaining = options.count - options.page * options.pageSize;
            if (remaining > 0) {
                resources._links.next = `${this.basePath}?_page=${options.page + 1}`;
            }
        }
        return resources;
    }
}
exports.default = ModelRouter;
