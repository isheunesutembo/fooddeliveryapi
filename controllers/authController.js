const User=require('../models/User')
const CryptoJs=require('crypto-js')
const jwt=require('jsonwebtoken')
const otpGenerator=require('../uitls/otp_generator')
const sendMail=require('../uitls/smtp_function')
module.exports={
    createUser:async (req,res)=>{
        const emailRegEx=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailRegEx.test(req.body.email)){
            return res.status(400).json({status:false,message:'Email is not valid'})

        }
        const minPasswordLength=8;
        if(req.body.password<minPasswordLength){
            return res.status(400).json({status:false,message:'Password should be at least'+minPasswordLength+'characters long'}) 
        }
        try{
         const emailExist=await User.findOne({email:req.body.email});
         if(emailExist){
            return res.status(400).json({status:false,message:'Email already exists'});
         }
         const otp=generateOtp;
         const newUser=User({
            username:req.body.username,
            email:req.body.email,
            userType:"Client",
            password:CryptoJs.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString(),
            otp:otp
         })
         await newUser.save()
         sendMail(newUse.email,otpGenerator)
         res.status(200).json({status:true,message:"New user created successfully"})
        }catch(error){
            res.status(500).json({status:false,message:error.message})

        }
    },
    logInUser:async (req,res)=>{
        const emailRegEx=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailRegEx.test(req.body.email)){
            return res.status(400).json({status:false,message:'Email is not valid'})

        }
        const minPasswordLength=8;
        if(req.body.password<minPasswordLength){
            return res.status(400).json({status:false,message:'Password should be at least'+minPasswordLength+'characters long'}) 
        }
        try{
            const user=User.findOne({email:req.body.email})
            if(!user){
                return res.status(400).json({status:false,message:'User not found'})  
            }
            const decryptedPassword=CryptoJs.AES.decrypt(user.password,process.env.SECRET_KEY)
            const dePassword=decryptedPassword.toString(CryptoJs.enc.Utf8)
            if(dePassword!==req.body.password){
                return res.status(400).json({status:false,message:'Wrong password'}) 
            }
            const userToken=jwt.sign({
                id:user._id,
                userType:user.userType,
                email:user.email

            },process.env.JWT_SECRET,{expiresIn:"30d"})
            const{password,otp,...others}=user.doc;
            res.status(200).json({...others,userToken})
        }catch(error){
            res.status(500).json({status:false,message:error.message})
        }
    }
}