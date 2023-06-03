import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  num: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
  },
});

const User = models.User || model("User", userSchema);

export default User;
