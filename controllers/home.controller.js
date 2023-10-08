let db = require('../models');
let Students = db.student
let Expenditure = db.expenditure;
let PettyCash = db.pettyCash;


exports.home =  async(req, res)=>{

    try {
        
        let activeStudents = await  Students.countDocuments({ status: "Active" })
        let inactiveStudents = await  Students.countDocuments({ status: "Inactive" })

        let expenditure = await Expenditure.find({}, 'amount');
        expenditure = expenditure.reduce((total, el) => total+el.amount, 0)


        let pettyCash = await PettyCash.find({}, 'amount');
        pettyCash = pettyCash.reduce((total, el) => total+el.amount, 0)

        let student = await Students.find({})
        student = student.map(item => ({
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
            message: 
                {activeStudents: activeStudents,
                inactiveStudents: inactiveStudents,
                expenditure: expenditure,
                pettyCash: pettyCash,
                students: student}
            
        })
    } catch (error) {
        console.log(`error: ${error.message}`)
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}