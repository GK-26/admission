const mongoose = require('mongoose');
const constants = require("../utils/constants")


const userSchema = new mongoose.Schema(
    {
      name: {
        type: String
      },
      subject: {
        type: String
      },
      description: {
        type: String
      },
      date: {
        type: Date,
      },
      amount: {
        type: Number,
        min: 2000
      },
      bill: {
        fieldname: String,
        originalname: String,
        fileType: String,
        bill: Buffer
      }
    },
    { timestamps: true, versionKey: false }
  );
  

module.exports = mongoose.model("Expenditure", userSchema)