const Rating=require('../models/rating')
const Restaurant=require('../models/restaurant')
const Food=require('../models/food')

module.exports={
    addRating:async(req,res)=>{
        const newRating=new Rating({
            userId:req.user.id,
            ratingType:req.body.rating,
            product:req.body.product,
            rating:req.body.rating
        });
        try{
            await newRating.save()
            if(req.body.ratingType==='Restaurant'){
                const restaurants=Restaurant.aggregate([
                    {$match:{ratingType:req.body.ratingType,product:req.body.product}},
                    {$group:{_id:{$product},averageRating:{$avg:'rating'}}}
                ])
                if((await restaurants).length>0){
                    const averageRating=restaurants[0].averageRating;
                    await Restaurant.findByIdAndUpdate(req.body.product,{rating:averageRating},{new:true})
                }
            }else if(req.body.ratingType==='Food'){
                const foods=Food.aggregate([
                    {$match:{ratingType:req.body.ratingType,product:req.body.product}},
                    {$group:{_id:{$product},averageRating:{$avg:'rating'}}}
                ])
                if((await foods).length>0){
                    const averageRating=foods[0].averageRating;
                    await Food.findByIdAndUpdate(req.body.product,{rating:averageRating},{new:true})
                }
            }
            res.status(200).json({status:true,message:"rating updated successfully"})

        }catch(error){
            res.status(500).json({status:false,message:error.message})

        }
    },
    checkUserRating:async(req,res)=>{
     const ratingType=req.query.ratingType;
     const product=req.query.product;
      try{
        const existingRating=Rating.findOne({
            userId:req.user.id,
            rating:ratingType,
            product:product
         });
         if(existingRating){
            res.status(200).json({status:true,message:"You have already rated this restaurant"})
         }else{
            res.status(200).json({status:false,message:"User has not rated this restaurant"})
         }

      }catch(error){
        res.status(500).json({status:false,message:error.message})
      }

    }
}