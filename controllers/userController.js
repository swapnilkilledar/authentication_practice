import userModel from "../models/user.js"; 
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class userController{
    static userRegistration =async (req,res) =>{
        const { name, email, password, password_confirmation , tc} = req.body

        const user = await userModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"Email already Exist"})
        } else {
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                    try{
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password,salt)
                    const doc = new userModel({
                        name:name,
                        email:email,
                        password: hashPassword,
                        tc:tc
                    })
                    await doc.save()
                    const saved_user = await userModel.findOne({email:email})

                    //Genrate JWT token 
                    const token =jwt.sign({userId:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})

                    res.send({"status":"success","message":"Registered Successfully","token":token})
                    } catch (error) {
                        console.log(error)
                        res.send({"status":"failed","message":"unable to register"}) 
                    } 

                } else {
                    res.send({"status":"failed","message":"Password & Confirm password doesn't match"}) 
                } 

            }else {
                res.send ({"status":"failed","message":"All Fields are required"})

            }
        }
    }

    static userLogin = async (req,res) => {
        try{
            const {email, password} = req.body
            if (email && password){
                const user = await userModel.findOne({email:email})
                if( user  != null){
                    const isMatch = await bcrypt.compare(password,user.password)
                    if ((user.email== email) && isMatch){
                        //Generate token
                        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})

                        res.send({"status":"Success","message":"Login Success","token":token})
                    }else {
                        res.send({"status":"failed","message":"Email or Password is not valid"})
                    }

                } else {
                    res.send ({"status":"failed","message":"You are Not a Registered User"})
                }
            }else {
                res.send ({"status":"failed","message":"All Fields are required"})
            }
        }catch(error){
            console.log(error)
            res.send ({"status":"failed","message":"Unable to Login"})
        }
    }

    static changeUserPassword =async(req, res) =>{

        const{password, password_confirmation}= req.body
        if(password && password_confirmation) {
            if(password!==password_confirmation){
                res.send({"status":"failed","message":"New Password and confirm password are not matching"})
            }else{
                const salt = await bcrypt.genSalt(10)
                const newhashPassword = await bcrypt.hash(password,salt)
                await userModel.findByIdAndUpdate(req.user._id,{$set:{password :newhashPassword}})
                res.send({"status":"success","message":"password change successfully"})
            }

        }else{
            res.send({"status":"failed","message":"Both fields are required"})
        }
    }  
}



export default userController 