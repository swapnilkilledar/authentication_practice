import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'


var checkUserAuth = async(req,res,next) => {
let token 
const {authorization} = req.headers
if (authorization && authorization.startsWith('Bearer')) {
    try{

        //Get Token from header 
        token = authorization.split(' ')[1]

        //Verify token 

        const {userId} = jwt.verify(token,process.env.JWT_SECRET_KEY)

        //Get user from token 

        req.user = await userModel.findById(userId).select('-password') 
        next()
        

    }catch(error){
        console.log(error)
        res.status(401).send({"status":"failed","message":"Unauthorized User"})
    }
}
        if(!token){
            res.status(401).send({"status":"failed","message":"Unauthorized Token , No Token"})
        }
}


export default checkUserAuth