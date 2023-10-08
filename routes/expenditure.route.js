let controller = require('../controllers/expenditure.controller');
let multer = require("multer");
let path = require('path')




const storage = multer.memoryStorage();
  
  const upload = multer({ storage });
  
    


module.exports = (app)=>{
    app.post("/admission/api/addExpenditure", controller.addExpenditure);
    app.post("/admission/api/addExpenditureBill/:billId", [upload.single('bill')], controller.addExpenditureBill);
    app.get("/admission/api/getExpenditureBill/:billId", controller.getExpenditureBill)
    app.get("/admission/api/getExpenditure", controller.getExpenditure);
    app.get("/admission/api/expenditureExeclFile", controller.createExpenditureExeclFile)
    app.delete("/admission/api/deleteExpenditure", controller.deleteExpenditure)
    app.delete("/admission/api/deleteExpenditureByID/:expenditureId", controller.deleteExpenditureById)
}