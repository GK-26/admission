const mongoose = require('mongoose');
const constants = require("../utils/constants")


const userSchema = new mongoose.Schema({
  admissionNumber:{
    type: Number,
    required: true,
    unique: true
  },
  name : {
    type : String,
    required : true,
  },
  surName: {
    type: String,
    required: true
  },
  fathersName:{
    type: String,
    required: true
  },
  mobileNumber:{
    type: Number,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  medium: {
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  admissionFee: {
    type:Number
  },
  admissionFeePaid: {
    type: Boolean
  },
  commitmentFee: {
    type: Number
  },
 
  installment: {
    type: Number,
    default: null
  },
  installmentOne: {
    due: Number,
    paid: {
      type: Boolean,
      default: false
    }
  },
  installmentTwo: {
    due: Number,
    paid: {
      type: Boolean,
      default: false
    }
  },
  installmentThree: {
    due: Number,
    paid: {
      type: Boolean,
      default: false
    }
  },

  status: {
    type: String,
    default: "Inactive",
    enum: ["Inactive", "Active"]
  }
},{ timestamps : true , versionKey : false});

module.exports = mongoose.model("Student", userSchema)