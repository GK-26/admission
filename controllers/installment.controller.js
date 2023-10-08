let db = require('../models');
let Installment = db.installment;

exports.createInstallment = async (req, res)=>{
    let installmentBody = {
        year : req.body.year,
        installmentOne : req.body.installmentOne,
        installmentTwo : req.body.installmentTwo,
        installmentThree : req.body.installmentThree
    }
    

    try {
        let installment = await Installment.create(installmentBody);

        if(installment.lenght == 0){
            return res.status(400).send({
                success: false,
                message: `installment creation failed`
            })
        }

      
       return res.status(201).send({
        success: true,
        message: installment
       })

    } catch (error) {
        console.log(`error: ${error.message}`)
        return res.status(401).send({
            success: false,
            message: error.message
        })
    }
}


exports.getInstallment = async(req, res)=>{
    let year = req.params.year;
    try {
        let installment = await Installment.findOne({year: year})

       

        return res.status(200).send({
            success: true,
            message: installment
        })
    } catch (error) {
        console.log(`#####ERROR##### ${error}`)
        return res.status(500).send({
            success: false,
            message:error.message
        })
    } 
}


exports.getAllInstallments = async (req, res)=>{
    let year = req.params.year;
    try {
        let installment = await Installment.find()

        return res.status(200).send({
            success: true,
            message: installment
        })
    } catch (error) {
        console.log(`#####ERROR##### ${error}`)
        return res.status(500).send({
            success: false,
            message:error.message
        })
    } 
}

exports.deleteAllInstallments = async (req, res)=>{
    try {
        let installment = await Installment.deleteMany()

        return res.status(200).send({
            success: true,
            message: installment
        })
    } catch (error) {
        console.log(`#####ERROR##### ${error}`)
        return res.status(500).send({
            success: false,
            message:error.message
        })
    } 
}


exports.deleteInstallmentById = async (req ,res)=>{
    let installmentId = req.params.installmentId
    try {
        let installment = await Installment.deleteOne({_id: installmentId})

        return res.status(200).send({
            success: true,
            message: installment
        })
    } catch (error) {
        console.log(`#####ERROR##### ${error}`)
        return res.status(500).send({
            success: false,
            message:error.message
        })
    } 
}