const router=require('express').Router()
const restaurantController=require('../controllers/restaurantController')

router.post("/",restaurantController.addRestaurants)
router.get("/:code",restaurantController.getRandomRestaurants)
router.get("/all:code",restaurantController.getAllNearByRestaurant)
router.get("/byId/:id",restaurantController.getRestaurantById)

module.exports=router;