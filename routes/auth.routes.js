const controller = require('../controllers/auth.controller');
const middleware = require('../middlewares/auth.middleware');
const multer = require('multer')
const path = require('path');

// console.log(1234, middlewares)
    // Multer storage configuration

  
    const storage = multer.memoryStorage();
  
    const upload = multer({ storage });
    
      
  


module.exports = (app) =>{
    app.post("/admission/api/signup",[middleware.checkDuplicateUsernameOrEmail, middleware.verifyAdmin], controller.signup);
    app.post("/admission/api/signin", controller.signin);
    app.put("/admission/api/updateUser/:userId", controller.updateUser)
    app.get("/admission/api/getUser/:userId", controller.getUser);
    app.get("/admission/api/getAllUsers", controller.getAllUsers);
    // app.post("/admission/api/v1/auth/forget-password", controller.);
    app.post("/admission/api/send-otp/:email", controller.sendOtp)
    app.post("/admission/api/verify-otp/:email", controller.verifyOtp)
    app.post("/admission/api/password-reset/:email", [middleware.verifyToken],  controller.passwordReset);
    app.post("/admission/api/upload-profilePicture/:userId",[upload.single('image')], controller.uploadProfilePicture)
    app.get("/admission/api/get-profilePicture/:userId", controller.getProfilePhoto)
    app.post("/admission/api/admin-permissions/:userId", controller.grantPermissions)
  }