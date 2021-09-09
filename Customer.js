const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    First_name: Number,
    Last_name: String,
    email: String,
    Gender: String,
  },


  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
