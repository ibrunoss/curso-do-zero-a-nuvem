import * as restify from "restify";

export default abstract class Router {
  abstract applyRoutes(application: restify.Server);
}
