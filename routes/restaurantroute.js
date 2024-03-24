const router=require('express').Router()
const restaurantController=require('../controllers/restaurantController')
const {verifyTokenAndAuthorization}=require('../middleware/verifyToken')
router.post("/",verifyTokenAndAuthorization,restaurantController.addRestaurants)
router.get("/",verifyTokenAndAuthorization,restaurantController.getAllRestaurants)
router.get("/:code",verifyTokenAndAuthorization,restaurantController.getRandomRestaurants)
router.get("/all/:code",verifyTokenAndAuthorization,restaurantController.getAllNearByRestaurant)
router.get("/byId/:id",verifyTokenAndAuthorization,restaurantController.getRestaurantById)

module.exports=router;