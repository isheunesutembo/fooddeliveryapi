const router=require('express').Router()
const foodController=require('../controllers/foodController')
const {verifyVendor}=require('../middleware/verifyToken')
router.post("/",foodController.addFood)
router.get("/:id",foodController.getFoodById)
router.get("/random/:code",foodController.getRandomFood)
router.get("/search/:search",foodController.searchFood)
router.get("/recommendation/:code",foodController.getRandomFood)
router.get("/restaurant-foods/:id",foodController.getFoodByRestaurant)
router.get("/category/:code",foodController.getRandomFoodsByCategoryAndCode)

module.exports=router;