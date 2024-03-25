const User=require('../models/User')
const cryptoJs=require('crypto-js')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const generateOtp=require('../uitls/otp_generator')
const sendMail=require('../uitls/smtp_function')
module.exports={
    createUser:async (req,res)=>{
        const emailRegEx=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailRegEx.test(req.body.email)){
            return res.status(400).json({status:false,message:'Email is not valid'})

        }
        const minPasswordLength=8;
        if(req.body.password<minPasswordLength){
            return res.status(400).json({status:false,message:"Password should be at least"+minPasswordLength+"characters long"})
        }
        try{
        const emailExists=await User.findOne({email:req.body.email})
        if(emailExists){
            return res.status(400).json({status:false,message:"Email already exist"})
        }
        const salt=await bcrypt.genSalt(10)
        hashedPassword=await bcrypt.hash(req.body.password,salt)
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            userType:"Client",
            password:hashedPassword
        })
        await newUser.save()
        res.status(201).json({status:true,message:"User successfully created."})
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
           // const decryptedPassword =cryptoJs.AES.decrypt(user.password,process.env.SECRET_KEY)
           // const dePassword = decryptedPassword.toString(cryptoJs.enc.Utf8)
            bcrypt.compare(req.body.password.toString(),user.password,(err,res)=>{
                if(err){
                    return res.status.json({status:false,message:err.message})
                }
            })
           /* if(dePassword !== req.body.password){
                return res.status(400).json({status:false,message:'Wrong password'}) 
            }
            */
            const userToken=jwt.sign({
                id:user._id,
                userType:user.userType,
                email:user.email

            },process.env.JWT_SECRET,{expiresIn:"30d"})
            const{password,otp, ...others}=user._doc;
            res.status(200).json({...others,userToken})
        }catch(error){
            res.status(500).json({status:false,message:error.message})
        }
    }
}