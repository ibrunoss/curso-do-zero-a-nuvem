import { Request, Response } from "restify";
import { BadRequestError } from "restify-errors";

const handleError = (
  req: Request,
  res: Response,
  err: any,
  done: () => any
) => {
  const error: any = {};
  const transformErr = () => {
    err.toJSON = () => ({ message: err.message });
    err.toString = () => err.message;
  };

  switch (err.name) {
    case "MongoError":
      transformErr();
      if (err.code === 11000) {
        err.statusCode = 400;
      }
      break;

    case "ValidationError":
      const messages: any[] = [];
      for (let name in err.errors) {
        messages.push({ message: err.errors[name].message });
      }
      error.toJSON = () => ({ message: err.message, errors: messages });
      res.json(400, error);
      break;
    default:
      transformErr();
  }

  return done();
};

export default handleError;
