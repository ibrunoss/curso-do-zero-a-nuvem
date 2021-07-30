import { Request, Response } from "restify";

const handleError = (
  req: Request,
  res: Response,
  err: any,
  done: () => any
) => {
  err.toJSON = () => ({ message: err.message });
  err.toString = () => err.message;

  switch (err.name) {
    case "MongoError":
      if (err.code === 11000) {
        err.statusCode = 400;
      }
      break;

    case "ValidationError":
      err.statusCode = 400;
      break;
  }

  return done();
};

export default handleError;
