const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
// const AuthToken = require('../auth/check-token')
const User = require('../models/user')

/* create user
URL:localhost:3000/admin/create_user
Method: POST
Json body example:
{
    "token" : "YOUR AUTH TOKEN",
    "deviceID" : "05db321a36ca921f",
    "username" : "test1"
}
*/
router.post('/create_user', async(req, res) =>{
    const deviceID = req.body.deviceID
    const username = req.body.username

    if (deviceID == undefined || username == undefined){
        res.status(401).json({
            message:"Input Json format error"
        })
        return
    }

    const filter = {"deviceID": deviceID}
    const opt = { upsert: true, new: true, setDefaultsOnInsert: true };
    const updateObj = {
        deviceID : deviceID,
        username : username
    }
    console.log(filter)
    console.log(updateObj)

    try{
        let user = await User.findOneAndUpdate(filter,{$set:updateObj}, opt).exec()
        console.log(user)
        res.status(200).json({
            deviceID: deviceID,
            message: "record updated",
            result: user
        })
    }catch(error){
        res.status(500).json({
            deviceID: deviceID,
            status:"fail",
            message: error
        })
    }
})

router.get('/get_key', (req, res) =>{
    //set "true" to get key, "false" to disable the function
    const activate = true

    if (activate){
        const token = jwt.sign(
            {
                name: "admin",
                application: 'TreeI'
            },
            process.env.JWT_KEY
        )
    
        res.status(200).json({
            token:token
        })
    }else{
        res.status(404).json({
            message: "Function not activate"
        })
    }

})


module.exports = router