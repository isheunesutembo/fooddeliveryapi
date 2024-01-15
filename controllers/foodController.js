const Food=require('../models/food')
module.exports={
    addFood:async(req,res)=>{
        const {title,foodTags,category,code,restaurant,time,price,additives,imageUrl}=req.body;
        if(!title||!foodTags||!category||!code||!restaurant||!time||!price||!additives||!imageUrl){
            res.status(400).json({status:false,message:"You have a missing field"})
           }
      try{
       
       const newFood=req.body(Food)
       await newFood.save();
       res.status(200).json({status:true,message:"New food added successfully!"})
      }catch(error){
        res.status(500).json({status:false,message:error.message})

      }
    },
    getFoodById:async(req,res)=>{
        const id=req.params.id;
        try{
          const food=await Food.findById(id);
          res.status(200).json(food);
        }catch(error){
            res.status(500).json({status:false,message:error.message})

        }
    },
    getRandomFood:async(req,res)=>{
        const code=req.params.code;
        try{
            let foods;
            if(code){
                foods=await Food.aggregate([
                {$match:{code:code,isAvailable:true}},
                {$sample:{size:5}},
                {$project:{__v:0}}
                ])
            }
            if(foods.length===0){
                foods=await Food.aggregate([
                    {$match:{isAvailable:true}},
                    {$sample:{size:5}},
                    {$project:{__v:0}}
                    ])
            }
            res.status(200).json(foods);

        }catch(error){
            res.status(500).json({status:false,message:message.error})
        }
    },
    getFoodByRestaurant:async(req,res)=>{
        const id=req.params.id;
        try{
            const foods=await Food.find({restaurant:id})
            res.status.json(foods)
        }
        catch(error){
            res.status(500).json({status:false,message:error.message})
        }
    },
    getFoodByCategoryAndCode:async(req,res)=>{
        const{category,code}=req.params;
        try{
            const foods=await Food.aggregate([
                {$match:{category:category,code:code,isAvailable:true}}
            ])
            if(foods.length===0){
                return res.status(200).json([]);
            }
            res.status.json(foods);

        }catch(error){
            res.status(500).json({status:false,message:error.message})
        }

    },
    searchFood:async(req,res)=>{
        const search=req.params.search;
        try{
         const results=await Food.aggregate([
            {
                search:{
                    index:"foods",
                    text:{
                        path:{
                            wildcard:"*"
                        }
                    }

                }
            }
         ])
         res.status(200).json(results)
        }catch(error){
            res.status(500).json({status:false,message:error.message})
        }
    },
    getRandomFoodsByCategoryAndCode:async(req,res)=>{
         const {code,category}=req.params;
         try{
            let foods;
            foods=await Food.aggregate([
                {$match:{category:category,code:code,isAvailable:true}},
                {$sample:{size:10}}
            ])
            if(!foods||foods.length===0){
                foods=await Food.aggregate([
                    {$match:{code:code,isAvailable:true}},
                    {$sample:{size:10}}
                ])
            }else if(!foods||foods.length===0){
                foods=await Food.aggregate([
                    {$match:{code:code,isAvailable:true}},
                    {$sample:{size:10}}
                ])
            }
            res.status(200).json(foods);

         }catch(error){
            res.status(500).json({status:false,message:true})
         }
    }

}