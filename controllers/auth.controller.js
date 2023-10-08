const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const db = require("../models");
const User = db.user;
const Otp = db.otp;
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const fs = require("fs")
const path = require('path');
const constants = require("../utils/constants")



//register or sign-up

exports.signup = async (req, res) => {

    // await User.collection.drop();
    let userObj = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    userType: req.body.userType,
    designation: req.body.designation
   };
//    let image = req.file;
   try{

    let user = await User.create(userObj)
    // Create a new instance of MyModel and save the image data to MongoDB
 
    // user.profilePicture.data = image.buffer;
    // user.profilePicture.contentType = image.mimetype;
    // await user.save() 
  

    if(user){
        console.log(`user : `, user);
        return res.status(201).send({
            success: true,
            message: user
        })
    }
   }catch(err){
    console.log(`error : `, err.message)
    return res.status(500).send({
        success: false,
        message: `error: ${err.message}`

    })
   }
} 


//sign-in

exports.signin = async (req, res) => {
    let {email, password} = req.body;
    try {
        let user = await   User.findOne({email: req.body.email})

        if (!user) {
            return res.status(404).send({success: false, message: "User not found" });
        }

        var isValidPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!isValidPassword) {
            return res.status(401).send({
                success: false,
                message: "Invalid Password"
            })
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 3600 // 1 hr
        })

          return  res.status(200).send({
            success: true,
            user: user,
            accessToken: token
            })


    } catch (error) {
        console.log(`error: ${error.message}`)
        return res.status(500).send({ success: false, message: err.message });
    }
}

exports.updateUser = async (req, res)=>{
    let userId = req.params.userId
    let {name, email, designation} = req.body
    try {
        let user = await User.findOneAndUpdate({_id: userId}, {name: name, email: email, designation: designation}, {new: true})
        // await User.update({_id: userId}, {name: name, designation: designation, email: email, })

        return res.status(200).send({
            success: true,
            message: user
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

exports.getUser = async (req, res) =>{
    let userId = req.params.userId
    try {
        
        let user = await User.findOne({_id: userId});
        // delete user.profilePicture.originalname;
        // delete user.profilePicture.path;
        // delete user.profilePicture.image;
    
        
        // if (user.profilePicture) {
        //     delete user.profilePicture.originalname;;
        //     delete user.profilePicture.image;
        //   }
        return res.status(200).send({
            success: true,
            message: user
        })
    } catch (error) {
        console.log(`error in getting the user ###ERROR### ${error.message}`);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

exports.getAllUsers = async (req, res) =>{
    console.log(12345)
    try {
        
        let user = await User.find({});
        // delete user.profilePicture.originalname;
        // delete user.profilePicture.path;
        // delete user.profilePicture.image;
    
        
        // if (user.profilePicture) {
        //     delete user.profilePicture.originalname;;
        //     delete user.profilePicture.image;
        //   }
        return res.status(200).send({
            success: true,
            message: user
        })
    } catch (error) {
        console.log(`error in getting the user ###ERROR### ${error.message}`);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

exports.sendOtp = async (req, res, next)=>{
    let email = req.params.email;
try {
    let user = await User.findOne({email: email})
    await Otp.deleteOne({email: email})
    if (!user) {
        return res.status(404).send({success: false, message: "User not found" });
    }

     // Configure Nodemailer
     const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'gajelli.kiransai@gmail.com',
        pass: 'wdnemrbhbntflnrk',
        },
    });

    // Generate a random OTP
    const otp = randomstring.generate({ length: 6, charset: 'numeric' });

    

    const mailOptions = {
        from: 'gajelli.kiransai@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP is: ${otp}`,
      };

      
        // Send the email with the OTP
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP email' });
        } else {
        console.log('OTP email sent:', info.response);
            
            Otp.create({
                email: req.params.email,
                otp: otp,
                userId: user._id
            }).then(otp =>{
                console.log(`otp: ${otp}`)
            }).catch(err=>{
                console.log(`error: ${err.message}`)
            })       
        return res.status(200).json({success: true, message: 'OTP email sent' });
        }
    });

} catch (error) {
    console.log(`sendOtp Error: ${error.message}`)    
         return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

exports.verifyOtp = async (req, res, next)=>{
    let email = req.params.email;
    let userOtp = req.body.otp;
    try {
        let otp = await Otp.findOne({email: email})
        let userId = await User.findOne({email: email}, '_id')
        if(!otp){
            return res.status(500).send({
                success: false,
                message: `no otp sent`
            })
        }
      
        if(otp.otp !== userOtp){
            return res.status(500).send({
                success: false,
                message: `invalid OTP`
            })
        }

        var token = await jwt.sign({_id: userId}, config.secret, {
            expiresIn: 3600 // 1 hr
        })
        return res.status(200).send({
            success: true,
            message: {
                token: token
            }
        })
    } catch (error) {
        console.log(`error: ${error.message}`)
        return res.status(500).send({
            success: false,
            message: `Invalid OTP`
        })
    }

}

exports.passwordReset = async (req, res)=>{

    let email = req.params.email;
    let password = bcrypt.hashSync(req.body.password, 10)

    try {

       let user =  User.updateOne({ email: email }, { password: password}).then(result => {
        console.log(result); // Result of the update operation
      })
      .catch(error => {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: `password update Failed!`
        })
      });
       return res.status(200).send({
        success: true,
        message: `password updated successfully`
       })
    } catch (error) {
        console.log(`error : `, error.message)
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }

}

exports.uploadProfilePicture = async(req, res)=>{

    const {fieldname, originalname, buffer, mimetype} = req.file;

    let profilePicture = {
        fieldname: fieldname, 
        originalname: originalname, 
        fileType: mimetype,
        profilePicture: buffer
    }
    let userId = req.params.userId
    

    try {
  
        let user = await User.updateOne({_id: userId}, {profilePicture: profilePicture}, {new : true})
        return res.status(201).send({
            success: true,
            message: `profile picture upload success`
        })
    } catch (error) {
        console.log(`error while uploading profile picture : ###ERROR### ${error.message}`)
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

exports.getProfilePhoto = async(req, res)=>{
    let userId = req.params.userId
    try {
        let user = await User.findOne({_id: userId}).select("profilePicture")
        if(!user){
            return res.status(404).send({
                success: false,
                message: `profile picture by id not found`
            })

        }
        return res.status(200).send(user.profilePicture.profilePicture)
    } catch (error) {
        console.log(`#####ERROR##### ${error.message}`)
        return res.status(500).send({
            success: false,
            message: ` some internal error`
    })
}}
exports.grantPermissions = async (req, res) =>{
    let userId = req.params.userId;
    let permissions = req.body.permissions;
    console.log(123, permissions)
    permissions.push('home')
    console.log(456, permissions)
    try {
        for(let i = 0; i< permissions.length; i++){
          if(!Object.values(constants.permissions).includes(permissions[i])){
            return res.status(400).send({
                success: false,
                message: `only these enums are accepted ${Object.values(constants.permissions)}`
            })
          }
        }
        let user = await User.findOneAndUpdate({_id: userId}, {permissions: permissions}, {new: true})

        return res.status(201).send({
            success: true,
            message: user
        })
        
    } catch (error) {
        console.log(`#####ERROR#############${error}`)

        return res.status(400).send({
            success: false,
            message: error
        })
    }
}



// Store temporary OTPs in memory (replace with a database for a production environment)



// // API endpoint for resetting the password using OTP
// app.post('/reset-password', (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   // Check if the provided OTP matches the stored OTP
//   if (otp !== otps[email]) {
//     return res.status(400).json({ message: 'Invalid OTP' });
//   }

//   // Reset the password (replace with your own logic to update the password)
//   // For simplicity, we are just printing the new password here
//   console.log(`New password for ${email}: ${newPassword}`);

//   // Clear the stored OTP
//   delete otps[email];

//   res.status(200).json({ message: 'Password reset successful' });
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
