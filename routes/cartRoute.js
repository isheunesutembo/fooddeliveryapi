const router=require('express').Router()
const cartController=require('../controllers/cartController')
const {verifyTokenAuthorization}=require('../middleware/verifyToken')
router.post("/",verifyTokenAuthorization,cartController.addProductToCart)
router.get("/decrement/:id",verifyTokenAuthorization,cartController.decrementProductQty)
router.get("/",verifyTokenAuthorization,cartController.getCart)
router.delete("/:id",verifyTokenAuthorization,cartController.removeCartItem)
router.get("/count",verifyTokenAuthorization,cartController.getCartCount)
module.exports=router;