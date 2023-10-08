let controller = require('../controllers/installment.controller');

module.exports = (app)=>{
    app.post("/admission/api/createInstallment", controller.createInstallment)
    app.get("/admission/api/getInstallment/:year", controller.getInstallment)
    app.get("/admission/api/getAllInstallment", controller.getAllInstallments)
    app.delete("/admission/api/deleteAllInstallments", controller.deleteAllInstallments)
    app.delete("/admission/api/deleteInstallmentById/:installmentId", controller.deleteInstallmentById)
}