import { EventEmitter } from "events";
import { Server, Response, Next } from "restify";
import { NotFoundError } from "restify-errors";

export default abstract class Router extends EventEmitter {
  abstract applyRoutes(application: Server);

  envelope(document: any): any {
    return document;
  }

  render(response: Response, next: Next) {
    return (document) => {
      if (document) {
        this.emit("beforeRender", document);
        response.json(this.envelope(document));
      } else {
        throw new NotFoundError("Documento não encontrado");
      }
      return next();
    };
  }

  renderAll(response: Response, next: Next) {
    return (documents: any[]) => {
      if (documents) {
        documents.forEach((document, i, a) => {
          this.emit("beforeRender", document);
          a[i] = this.envelope(document);
        });
        response.json(documents);
      } else {
        response.json([]);
      }
      return next();
    };
  }
}
