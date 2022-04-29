import express from 'express'
const router = express.Router();
import userController from '../controllers/userController.js';
import checkUserAuth from '../middlewares/authMiddleware.js';

//Route level middleware -To  Protect route
router.use('/changepassword',checkUserAuth)

// Pubic Routes 
router.post('/register',userController.userRegistration)
router.post('/login',userController.userLogin)

//Protected Routes 
router.post('/changepassword',userController.changeUserPassword)




export default router 