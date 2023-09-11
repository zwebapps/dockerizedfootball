const mongoose = require("mongoose");

const Academy = mongoose.model(
  "Academy",
  new mongoose.Schema({
    academyName: {
        type: String,
        unique : true,
        required: true
    },
    coach: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
  })
);

module.exports = Academy;