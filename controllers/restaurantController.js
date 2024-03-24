const Restaurant=require('../models/restaurant');

module.exports={
    addRestaurants:async(req,res)=>{
        const {title,time,imageUrl,owner,code,logoUrl,rating,coords}=req.body;

        if(!title||!time||!imageUrl||!owner||!code||!logoUrl||!coords||!coords.lattitude||!coords.longitude||!coords.address||!coords.title){
            return res.status(400).json({status:false,message:"All fields are required"})

        }

        try{
          const newRestaurant=new Restaurant(req.body);
          await newRestaurant.save();
          res.status(201).json({status:true,message:"Restaurant has been created successfully!"})
        }catch(error){
            res.status(500).json({status:false,message:error.message})

        }
    },
    getAllRestaurants:async(req,res)=>{
        try{
         const restaurants=await Restaurant.find({title:{$ne:"more"}},{__v:0})
         res.status(200).json(restaurants);
        }catch(error){
            res.status(500).json({status:false,message:error.message});

        }
    },
    getRestaurantById:async(req,res)=>{
        const id=req.params.id;
        try{
        const restaurant=await Restaurant.findById(id);
        res.status(200).json(restaurant);
        }catch(error){
            res.status(500).json({status:false,message:error.message})
            
        }
    },
    getRandomRestaurants:async(req,res)=>{
        const code=req.params.code;
        try{
            let randomRestaurant=[];
            if(code){
                randomRestaurant=Restaurant.aggregate([
                    {$match:{code:code,isAvailable:true}},
                    {$sample:{size:5}},
                    {$project:{__v:0}}
                ]);
                if(randomRestaurant.length===0){
                    randomRestaurant=Restaurant.aggregate([
                        {$match:{isAvailable:true}},
                        {$sample:{size:5}},
                        {$project:{__v:0}}
                    ]);
                }
                res.status(200).json(randomRestaurant);

            }

        }catch(error){
            res.status(500).json({status:false,message:error.message})
            
        }
    },
    getAllNearByRestaurant :async(req,res)=>{
        const code=req.params.code;
        try{
            let allNearByRestaurant=[];
            if(code){
                allNearByRestaurant=Restaurant.aggregate([
                    {$match:{code:code,isAvailable:true}},
                   
                    {$project:{__v:0}}
                ]);
                if(allNearByRestaurant.length===0){
                    allNearByRestaurant=Restaurant.aggregate([
                        {$match:{isAvailable:true}},
                        {$sample:{size:5}},
                        {$project:{__v:0}}
                    ]);
                }
                res.status(200).json(allNearByRestaurant);

            }

        }catch(error){
            res.status(500).json({status:false,message:error.message})
            
        }
    }

}
