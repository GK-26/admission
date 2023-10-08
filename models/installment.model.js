const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
      year: {
        type: Number,
        unique: true,
        required: true
      },
      installmentOne: {
        type: Date,
        required: true
      },
      installmentTwo: {
        type: Date,
        required: true
      },
      installmentThree: {
        type: Date,
        required: true
      }
    },
    { timestamps: true, versionKey: false }
  );
  

module.exports = mongoose.model("Installment", userSchema)