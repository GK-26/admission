const mongoose = require('mongoose');
const constants = require("../utils/constants")


const userSchema = new mongoose.Schema({

  name : {
    type : String,
    required : true
  },
  profilePicture : {
    fieldname: String,
    originalname: String,
    fileType: String,
    profilePicture: Buffer
},
  password : {
    type : String,
    requried : true
  },
  designation: {
    type: String,
    requried: true
  },
  email : {
    type : String,
    required : true,
    lowercase : true,
    minLength : 10,
    unique : true
  },
 permissions: {
  type: [{
    type: String,
    enum: [constants.permissions.home, constants.permissions.student, constants.permissions.expenditure,
      constants.permissions.pettyCash, constants.permissions.installments]// Add your allowed roles here
  }],
  default: constants.permissions.home,
  required: true

 },
  userType : {
    type : String,
    required : true,
    default : constants.userTypes.user,
    enum : [constants.userTypes.user, constants.userTypes.admin],
    
  
  }


},{ timestamps : true , versionKey : false});

module.exports = mongoose.model("User", userSchema)