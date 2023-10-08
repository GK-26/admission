const { pettyCash } = require("../models");
const db = require("../models");
let Student = db.student;
let Fee = db.fee;
let xlsx = require("xlsx")


exports.addStudent = async (req, res)=>{
    // await Student.collection.drop();
    let studentBody = {
        admissionNumber: req.body.admissionNumber,
        name: req.body.name,
        commitmentFee: req.body.commitmentFee,
        admissionFee: req.body.admissionFee,
        admissionFeePaid: req.body.admissionFeePaid,
        surName: req.body.surName,
        fathersName: req.body.fathersName,
        mobileNumber: req.body.mobileNumber,
        group: req.body.group,
        medium: req.body.medium,
        address: req.body.address,
        status: req.body.status,
        installment: req.body.installment
    }
    const currentDate = new Date();
    

    try {
        let student = await Student.create(studentBody)
        let fee = await Fee.create()      
        if(student){
            return res.status(200).send({
                success: true,
                message: student
            })
        }
        console.log(`student : ${student}`);
    } catch (error) {
        console.log(`error: `, error.message);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
    

    
}
exports.getStudents = async (req, res)=>{
    // await Student.collection.drop()
    try {
        let student = await Student.find({})  
        if(student){
             student = student.map(item => ({
                id: item._id,
                Name: item.name, 
                admissionNumber: item.admissionNumber,
                Group: item.group,
                Medium: item.medium,
                CommitmentFee: item.commitmentFee,
                Feedue: item.installmentOne.due,
                Status: item.status
              }));
            return res.status(200).send({
                success: true,
                message: student
            })
        }
        console.log(`student : ${student}`);
    } catch (error) {
        console.log(`error: `, error.message);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
    

    
}

exports.getStudentById = async (req, res)=>{
    let studentId = req.params.studentId
    try {
        let student = await Student.findOne({_id: studentId})  
        if(student.length <= 0){
            return res.status(404).send({
                success: false,
                message: `no student found!`
            })
        }
            return res.status(200).send({
                success: true,
                message: student
            })
        
        console.log(`student : ${student}`);
    } catch (error) {
        console.log(`error: `, error.message);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
    

    
}

exports.admissionFeePaid = async (req, res)=>{
    let {admissionFeePaid, admissionFee}= req.body
    let studentId = req.params.studentId;
    try {
        let student = await Student.updateOne({_id: studentId}, {admissionFeePaid: admissionFeePaid, admissionFee: admissionFee})
        if(!student){
            console.log(`error: admissionFeePaid not updated`)
            return res.status(500).send({
                success: false,
                message: `admissionFeePaymentFailed`
            })
        }
        return res.status(201).send({
            success: true,
            message: `sucessfully admissionFee updated!`

        })
    } catch (error) {
        consolt.log(`error : `, error.message)
        return res.status(500).send({
            success: false,
            message: error.message
        })
    } 
}

exports.installment = async (req, res)=>{
    let {commitmentFee, installment}= req.body
    let studentId = req.params.studentId;
    try {
    
           let installmentObj = {
            commitmentFee: commitmentFee,
            installment: installment,
           }
           let findInstallment = await Student.findOne({_id: studentId})
          

        
         
           if(installment === 2  && 
           findInstallment.installment == 3 ){
                return res.status(400).send({
                    success: false,
                    message: `already threeMonths was enabled`
                })
           }

           if(installment === 3 &&
           findInstallment.installment === 2){
                return res.status(400).send({
                    success: false,
                    message: `already twoMonths was enabled`
                })

           }


           let student = await Student.findOneAndUpdate({_id: studentId},installmentObj, {new: true} )
           
           return res.status(201).send({
            success: true,
            message: student
           })

    } catch (error) {
        console.log(`error: ${error.message}`)
        return res.status(201).send({
            success: false,
            message: error.message
        })
    }
}

exports.installmentPaid = async (req, res)=>{
    let studentId = req.params.studentId;
    let {installmentOne, installmentTwo, installmentThree} = req.body
    try {
        let student = await Student.findOne({_id: studentId});

      
        if(student.installment == null){
            return res.status(500).send({
                success: false,
                message: `enable installment`
            })
           
        }

        let installmentObj = {}
        
        
      
        
           if(installmentOne){
            installmentObj.installmentOne = installmentOne
            installmentObj.installmentOne.due = student.installmentOne.due

           }
           if(installmentTwo){
            installmentObj.installmentTwo = installmentTwo
            installmentObj.installmentTwo.due = student.installmentTwo.due
           }
           
           if(installmentThree){
            if(student.installment == 2){
                return res.status(400).send({
                    success: false,
                    message: `student was enable for only two installments`
                })
            }
            installmentObj.installmentThree = installmentThree
            installmentObj.installmentThree.due = student.installmentThree.due
           }
           student = await Student.findOneAndUpdate({_id: studentId},installmentObj,{new: true} )
           
           return res.status(201).send({
            success: true,
            message: student
           })
    } catch (error) {
        console.log(`error: ${error.message}`)
        return res.status(201).send({
            success: false,
            message: error.message
        })
    }
}

exports.createStudentExeclFile = async (req, res)=>{
    try {
        let student = await Student.find({});
      
            // Prepare data for Excel sheet
            const worksheetData = student.map(item => ({
                Name: item.name, 
                admissionNumber: item.admissionNumber,
                Group: item.group,
                Medium: item.medium,
                CommitmentFee: item.commitmentFee,
                Feedue: item.installmentOne.due,
                Status: item.status
            }));
      
            // Create a new workbook and worksheet
            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.json_to_sheet(worksheetData);
      
            // Add the worksheet to the workbook
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
      
             // Save the workbook to a buffer
      const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Set the response headers for file download
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="output.xlsx"'
      });
      console.log('Excel sheet created successfully!');
      // Send the Excel file in the response
      return res.status(200).send({
        success: true,
        message: {student: excelBuffer}});
      
            
          
    } catch (error) {
        console.log(`error : ${error.message}`);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


exports.updateStudent = async(req, res)=>{
    let studentObj ={
        name,
        surName,
        fathersName,
        mobileNumber,
        medium,
        address,
    } = req.body
    let studentId = req.params.studentId
    try {

           let student = await Student.findOneAndUpdate({_id: studentId},studentObj,  { new: true } )
           
           return res.status(201).send({
            success: true,
            message: student
           })

    }catch (error) {
        console.log(`error: ${error.message}`)
        return res.status(500).send({
            success: false,
            message: `some internal Error`
        })
    }
}


exports.deleteAllStudents = async(req, res)=>{
    try {
        let student = await Student.deleteMany({})  
       if(student.deletedCount <= 0){
        return res.status(200).send({
            success: false,
            message: `no students exists`
        })
       }
       return res.status(200).send({
        success: true,
        message: student
    })
      
            
    
    } catch (error) {
        console.log(`error: `, error.message);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


exports.deleteStudentById = async(req, res)=>{
    let studentId = req.params.studentId
    try {
        let student = await Student.findByIdAndDelete(studentId)  
       

        if(student == null){
            return res.status(200).send({
                success: false,
                message: `no students found by the id`
            })  
        }
            return res.status(200).send({
                success: true,
                message: student
            })
    
    } catch (error) {
        console.log(`error: `, error.message);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}