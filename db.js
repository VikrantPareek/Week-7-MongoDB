let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
});

let TodoSchema = new Schema({
  title: String,
  isDOne: Boolean,
  userId: ObjectId,
});

let UserModel = mongoose.model("users", UserSchema);
let TodoModel = mongoose.model("todos", TodoSchema);

module.exports = {
  UserModel,
  TodoModel,
};
