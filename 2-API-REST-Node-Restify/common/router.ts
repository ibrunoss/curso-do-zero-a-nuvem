import { EventEmitter } from "events";
import { Server, Response, Next } from "restify";
import { NotFoundError } from "restify-errors";

export default abstract class Router extends EventEmitter {
  abstract applyRoutes(application: Server);

  render(response: Response, next: Next) {
    return (document) => {
      if (document) {
        this.emit("beforeRender", document);
        response.json(document);
      } else {
        throw new NotFoundError("Documento não encontrado");
      }
      return next();
    };
  }
}
