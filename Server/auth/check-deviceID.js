// const e = require("express")
// const User = require("../models/user")

// module.exports = async(req,res,next)=>{
//     try{
//         let filter = {
//             deviceID : req.body.deviceID
//         }
//         console.log(filter)
//         let user = await User.find(filter)
//         console.log(user)
//         if(user.length == 0){
//             res.status(404).json({
//                 message: "Auth failed"
//             })
//         }else{
//             next()
//         }
//     }catch(error){
//         console.log(error)
//         return res.status(401).json({
//             message: "Auth failed"
//         })
//     }

// }