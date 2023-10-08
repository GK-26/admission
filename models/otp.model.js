const mongoose = require('mongoose');
const constants = require("../utils/constants")


const userSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true,
    lowercase : true,
    minLength : 10
  },
  
  otp : {
    type : Number,
    requried : true
  },
  userId: { 
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user'
    },
    createdAt: {
      type: Date,
      expires: 300, // Set TTL to 300 seconds (5 minutes)
      default: Date.now
    }
  

},{ timestamps : true , versionKey : false});

module.exports = mongoose.model("Otp", userSchema)