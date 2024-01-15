const router=require('express').Router()
const userController=require('../controllers/userController')

router.get("/",userController.getUser)
router.get("/",userController.verifyAccount)
router.get("/",userController.verifyPhone)
router.delete("/",userController.deleteUser)



module.exports=router;