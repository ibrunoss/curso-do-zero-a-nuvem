import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

import { validateCPF } from "../common/validators";
import environment from "../common/environment";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  gender: {
    type: String,
    required: false,
    enum: ["Male", "Female"],
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      message: "Invalid CPF ({VALUE})", //{PATH}:
    },
  },
});

const hashPassword = (obj, next) => {
  bcrypt
    .hash(obj.password, environment.security.salt)
    .then((hash) => {
      obj.password = hash;
      next();
    })
    .catch(next);
};

const saveMiddleware = function (next) {
  const user: UserDocument = <UserDocument>this;

  if (!user.isModified("password")) {
    return next();
  }
  hashPassword(user, next);
};

const updateMiddleware = function (next) {
  if (!this.getUpdate().password) {
    return next();
  }
  hashPassword(this.getUpdate(), next);
};

userSchema.pre("save", saveMiddleware);
userSchema.pre("findOneAndUpdate", updateMiddleware);
userSchema.pre("update", updateMiddleware);

export const User = mongoose.model<UserDocument>("User", userSchema);
