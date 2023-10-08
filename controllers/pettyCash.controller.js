let db = require('../models');
let PettyCash = db.pettyCash;
let xlsx = require("xlsx")
let path = require('path')
const fs = require('fs')


exports.addPettyCash = async(req, res)=>{
    let pettyCashBody = {
        name,
        subject,
        description,
        date,
        amount,
        bill
    } = req.body
    try {
        let pettyCash = await PettyCash.create(pettyCashBody);
        return res.status(201).send({
            success: true,
            message: pettyCash
        })
    } catch (error) {
        console.log(`error: ${error.message}`)
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }

}
exports.getPettyCash = async(req, res)=>{
    // await PettyCash.collection.drop();
    try {
        let pettyCash = await PettyCash.find({}).select("-bill");;

        pettyCash = pettyCash.map(item =>({
            id: item._id,
            Name: item.name,
            Subject: item.subject,
            Date: item.date,
            description: item.description,
            Amount: item.amount
        }))
        return res.status(201).send({
            success: true,
            message: pettyCash
        })
    } catch (error) {
        console.log(`error: ${error.message}`)
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }

}

exports.createPettyCashExeclFile = async (req, res)=>{
    try {
        let pettyCash = await PettyCash.find({});
      
            // Prepare data for Excel sheet
            const worksheetData = pettyCash.map(item => ({
                Name: item.name,
                Subject: item.subject,
                Date: item.date,
                Amount: item.amount,
                File: item.file,
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
        message: {pettyCash : excelBuffer}});
      
            
          
    } catch (error) {
        console.log(`error : ${error.message}`);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


exports.addPettyCashBill = async (req, res)=>{
    const {fieldname, originalname, buffer, mimetype} = req.file;
    let billId = req.params.billId
    

    try {
        let bill = {
            fieldname: fieldname, 
            originalname: originalname, 
            fileType: mimetype,
            bill: buffer
        }

        let findBill = await PettyCash.findOne({_id: billId})
        if(!findBill){
            return res.status(500).send({
                success: false,
                message: `no bill found by Id`
            })
        }

        let pettyCash = await PettyCash.updateOne({_id: billId}, {bill: bill}, {new : true})


        return res.status(201).send({
            success: true,
            message: `bill upload success`
        })
    } catch (error) {
        console.log(`error while uploading profile picture : ###ERROR### ${error.message}`)
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

exports.getPettyCashBill = async (req, res)=>{
    let billId = req.params.billId
    try {
        let pettyCashBill = await PettyCash.findOne({_id: billId}).select("bill")
        if(!pettyCashBill){
            return res.status(404).send({
                success: false,
                message: `bill by id not found`
            })

        }
        return res.status(200).send(pettyCashBill.bill.bill)
    } catch (error) {
        console.log(`#####ERROR##### ${error.message}`)
        return res.status(500).send({
            success: false,
            message: ` some internal error`
        })
    }
}

exports.deletePettyCash = async (req, res) =>{
    try {
        let pettyCash = await PettyCash.deleteMany({});

        if(pettyCash.deletedCount <= 0){
            return res.status(200).send({
                success: false,
                message: `no pettyCash exists`
            })
           }
        return res.status(201).send({
            success: true,
            message: pettyCash
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


exports.deletePettyCashById = async (req, res) =>{
    let pettyCashId = req.params.pettyCashId;
    try {
        let pettyCash = await PettyCash.findByIdAndDelete(pettyCashId);


        if(pettyCash == null){
            return res.status(200).send({
                success: false,
                message: `no pettyCash found by the id`
            })  
        }
        return res.status(201).send({
            success: true,
            message: `pettyCash by id ${pettyCashId} Deleted`
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}