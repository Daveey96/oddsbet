import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  balance: Number,
  verified: Boolean,
  token: String,
  currentStage: Number,
});

const User = models.User || model("User", userSchema);

export default User;
