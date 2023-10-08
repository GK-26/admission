let db = require('../models');
let Expenditure = db.expenditure;
let xlsx = require('xlsx')
let path = require('path')
const fs = require('fs')
exports.addExpenditure = async(req, res)=>{
    let expenditureBody = {
        name,
        subject,
        description,
        date,
        amount,
        bill
    } = req.body
    try {
        let expenditure = await Expenditure.create(expenditureBody);
        return res.status(201).send({
            success: true,
            message: expenditure
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }

}
exports.getExpenditure = async(req, res)=>{
    // await Expenditure.collection.drop();
  
    try {
        let expenditure = await Expenditure.find({}).select("-bill");

        
        expenditure = expenditure.map(item =>({
            id: item._id,
            Name: item.name,
            Subject: item.subject,
            Date: item.date,
            description: item.description,
            Amount: item.amount
        }))
        // const buffer = Buffer.from(expenditure.bill);
        // const textData = buffer.toString();
        return res.status(201).send(
            {
                success: true,
                message: expenditure
            }
        )
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }

}

exports.createExpenditureExeclFile = async (req, res)=>{
    try {
        let expenditure = await Expenditure.find({});
      
            // Prepare data for Excel sheet
           
            const worksheetData = expenditure.map(item => ({
                Name: item.name,
                Subject: item.subject,
                Date: item.date,
                Amount: item.amount,
            }));
            console.log(1234, worksheetData)
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
      return res.status(200).send(excelBuffer);
      
            
          
    } catch (error) {
        console.log(`error : ${error.message}`);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


exports.addExpenditureBill = async (req, res)=>{
    const {fieldname, originalname, buffer, mimetype} = req.file;
    let billId = req.params.billId
    

    try {
        let bill = {
            fieldname: fieldname, 
            originalname: originalname, 
            fileType: mimetype,
            bill: buffer
        }
        
        let findBill = await Expenditure.findOne({_id: billId})
        if(!findBill){
            return res.status(500).send({
                success: false,
                message: `no bill found by Id`
            })
        }
        let expenditure = await Expenditure.updateOne({_id: billId}, {bill: bill}, {new : true})

        return res.status(201).send({
            success: true,
            message: `bill upload success`
        })

        
    } catch (error) {
        console.log(`error while uploading expenditure Bill : ###ERROR### ${error.message}`)
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

exports.getExpenditureBill = async (req, res)=>{
    let billId = req.params.billId
    try {
        let expenditureBill = await Expenditure.findOne({_id: billId}).select("bill")
        if(!expenditureBill){
            return res.status(404).send({
                success: false,
                message: `bill by id not found`
            })

        }
        return res.status(200).send(expenditureBill.bill.bill)
    } catch (error) {
        console.log(`#####ERROR##### ${error.message}`)
        return res.status(500).send({
            success: false,
            message: ` some internal error`
    })
}}

exports.deleteExpenditure = async (req, res) =>{
    try {
        let expenditure = await Expenditure.deleteMany({});

        if(expenditure.deletedCount <= 0){
            return res.status(200).send({
                success: false,
                message: `no expenditure exists`
            })
           }
        return res.status(201).send({
            success: true,
            message: expenditure
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


exports.deleteExpenditureById = async (req, res) =>{
    let expenditureId = req.params.expenditureId;
    try {
        let expenditure = await Expenditure.findByIdAndDelete(expenditureId);


        if(expenditure == null){
            return res.status(200).send({
                success: false,
                message: `no expenditure found by the id`
            })  
        }
        return res.status(201).send({
            success: true,
            message: `expenditure by id ${expenditureId} Deleted`
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}