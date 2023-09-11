const mongoose = require("mongoose");

const Fixture = mongoose.model(
  "Fixture",
  new mongoose.Schema({
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true
    },
    homeTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
      },
    awayTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
      },
    user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
    createdAt: {
        type: Date,
        default: Date.now,
        required: false
    }
  })
);

module.exports = Fixture;