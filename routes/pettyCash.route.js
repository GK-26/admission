let controller = require('../controllers/pettyCash.controller');
let multer = require("multer");
let path = require('path')



const storage = multer.memoryStorage();
  
  const upload = multer({ storage });
  
    



module.exports = (app)=>{
    app.post("/admission/api/pettyCash", controller.addPettyCash);
    app.get("/admission/api/pettyCash", controller.getPettyCash);
    app.get("/admission/api/pettyCashExeclFile", controller.createPettyCashExeclFile);
    app.post("/admission/api/addPettyCashBill/:billId", [upload.single('bill')], controller.addPettyCashBill)
    app.get("/admission/api/getPettyCashBill/:billId", controller.getPettyCashBill)
    app.delete("/admission/api/deleteAllPettyCash", controller.deletePettyCash);
    app.delete("/admission/api/deletePettyCashById/:pettyCashId", controller.deletePettyCashById)
  }