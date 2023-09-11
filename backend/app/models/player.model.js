const mongoose = require("mongoose");

const Player = mongoose.model(
  "Player",
  new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: {
        type: Number,
        required: true
    },
    squadNo: {
        type: Number,
        required: true
    },
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "League"
    },
    academy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Academy"
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    playerNo: {
        type: Number,
        unique : true,
        required: true
    },
    emiratesIdNo: {
        type: String,
        unique : true,
        required: true
    },
    eidFront: {
        type: String,
        default: null,
        required: false
    },
    eidBack: {
        type: String,
        default: null,
        required: false
    },
    playerImage: {
        type: String,
        default: null,
        required: false
    },
    playerStatus: {
        type: String,
        default: null,
        required: false
    },
    user:  {
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

module.exports = Player;
