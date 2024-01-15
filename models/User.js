const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema({
   username:{type:String,required:true,unique:true},
   email:{type:String,required:true} ,
   otp:{type:String ,required:true,default:'none'},
   verification:{type:Boolean,default:false},
   phone:{type:String,default:"01234"},
   phoneVerification:{type:Boolean,default:false},
   address:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Address",
    required:false
   },
   userType:{type:String,required:true,default:'Client',enum:['Client','Admin','Vendor','Driver']},
   profile:{type:String,default:''},
   
},{timestamps:true});

module.exports=mongoose.model('User',UserSchema)