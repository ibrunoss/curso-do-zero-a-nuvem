import { EventEmitter } from "events";
import { Server, Response, Next } from "restify";
import { NotFoundError } from "restify-errors";

export default abstract class Router extends EventEmitter {
  abstract applyRoutes(application: Server);

  envelope(document: any): any {
    return document;
  }

  envelopeAll(documents: any[], options: any = {}): any {
    return documents;
  }

  render(response: Response, next: Next) {
    return (document) => {
      if (document) {
        this.emit("beforeRender", document);
        response.json(this.envelope(document));
      } else {
        throw new NotFoundError("Documento não encontrado");
      }
      return next(false);
    };
  }

  renderAll(response: Response, next: Next, options: any = {}) {
    return (documents: any[]) => {
      if (documents) {
        documents.forEach((document, i, a) => {
          this.emit("beforeRender", document);
          a[i] = this.envelope(document);
        });
        response.json(this.envelopeAll(documents, options));
      } else {
        response.json(this.envelopeAll([], options));
      }
      return next(false);
    };
  }
}
