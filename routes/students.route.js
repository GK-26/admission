const controller = require('../controllers/student.controller');

module.exports = (app) =>{

    app.post("/admission/api/addStudent", controller.addStudent);
    app.get("/admission/api/getStudent", controller.getStudents);
    app.get("/admission/api/getStudent/:studentId", controller.getStudentById)
    app.get("/admission/api/studentExeclFile", controller.createStudentExeclFile);
    app.put("/admission/api/updateStudent/:studentId", controller.updateStudent)
    app.post("/admission/api/admissionFeePaid/:studentId", controller.admissionFeePaid);
    app.post("/admission/api/installment/:studentId", controller.installment);
    app.post("/admission/api/installmentPaid/:studentId", controller.installmentPaid);
    app.delete("/admission/api/deleteAllStudents", controller.deleteAllStudents);
    app.delete("/admission/api/deleteStudentById/:studentId", controller.deleteStudentById)
    
}