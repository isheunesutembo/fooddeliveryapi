const Order=require('../models/order')

module.exports={
    placeOrder:async(req,res)=>{
        const newOrder=new Order({
            ...req.body,
            userId:req.user.id
        });
        try{
        await newOrder.save()
        const orderId=newOrder._id
        res.status(200).json({status:true,message:"Order placed successfully!",orderId:orderId})
        }catch(error){
        res.status(500).json({status:true,message:error.message})
        }
    },
    getUserOrders:async(req,res)=>{
        const userId=req.user.id;
        const {paymentStatus,orderStatus}=req.query;
        let query={userId};
        

    }
}