const mongoose = require("mongoose");

const Increment = mongoose.model(
  "Increment",
  new mongoose.Schema({
    _id :{
      type: String,
      default: null,
      required: false
    },
    name: {
        type: String,
        default: null,
        required: false
    },
   sequence_value : {
      type: Number,
      required: true
   }
  })
);

module.exports = Increment;