const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const AuthToken = require('../auth/check-token')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const e = require('express')


/* create user
URL:localhost:3000/user/signup
Method: POST
body:
{
    "username": "test",
    "password": "12345"
}
*/
router.post('/signup', (req, res) =>{
    let username = req.body.username
    console.log(req.body)
    if (username && username.length >= 4 && req.body.password){
        let password = req.body.password
        bcrypt.hash(password, 10, (err, hash)=>{
            if(err){
                return res.status(500).json({
                    error:err,
                    status : "fail"
                })
            }else{
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    username: username,
                    password: hash
                })
                user
                .save()
                .then(result =>{
                    result.password = undefined
                    const token = jwt.sign({
                        username : user.username,
                        _id : user._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "10d"
                    })
                    return res.status(201).json({
                        message: "user created",
                        user : result,
                        status : 'success',
                        token: token
                    })
                })
                .catch(err =>{
                    console.log(err)
                    return res.status(500).json({
                        error:err,
                        status: "fail"
                    })
                })
            }
        })
    }else{
        return res.status(500).json({
            error:"username / password error",
            status: "fail"
        })
    }

})

/* login
URL:localhost:3000/user/login
Method: POST
body:
{
    "username": "test",
    "password": "12345"
}
*/

router.post('/login', (req, res) =>{
    console.log(req.body)
    let username = req.body.username
    let password = req.body.password
    User.findOne({username:username})
    .exec()
    .then(user =>{
        if (!user){
            return res.status(401).json({
                status: "fail",
                message: "Auth fail"
            })
        }
        console.log(user)
        bcrypt.compare(password, user.password, (err, result) =>{
            if (err){
                console.log(err)
                return res.status(401).json({
                    status: "fail",
                    message: "Auth fail"
                })
            }
            user.password = undefined
            if (result){
                const token = jwt.sign({
                                username : user.username,
                                _id : user._id
                            }, process.env.JWT_KEY, {
                                expiresIn: "10d"
                            })
                return res.status(200).json({
                    user : user,
                    message: 'Auth success',
                    token: token,
                    status: "success"
                })
            }

            return res.status(401).json({
                status: "fail",
                message: "Auth fail"
            })
        })
    })
    .catch(err =>{
        console.log(err)
        return res.status(401).json({
            status: "fail",
            message: "Auth fail"
        })
    })
})

/* verify user by token
URL:localhost:3000/user/verify
Method: POST
body:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJfaWQiOiI2MzczYWNkYmQ2YzkyZDYwM2UwNzVhYzQiLCJpYXQiOjE2Njg1Mjc1MTgsImV4cCI6MTY2OTM5MTUxOH0.DowKonA76HoZDnDtYWl_HLZuYDqMwgt0ruv2cxFHSSk"
}
*/

router.post('/verify',AuthToken, (req,res)=>{
    try{
        username = req.username
        _id = req._id
        User.findOne({username:username, _id: _id})
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(401).json({
                    status: "fail",
                    message: "Auth fail"
                })
            }
            user.password = undefined
            const token = jwt.sign({
                            username : user.username,
                            _id : user._id
                        }, process.env.JWT_KEY, {
                            expiresIn: "10d"
                        })
            
            return res.status(200).json({
                message: 'Auth success',
                status: 'success',
                token: token,
                user: user
            })
        })
        .catch(err =>{
            console.log(err)
            return res.status(401).json({
                status: "fail",
                message: "Auth fail"
            })
        })

    }catch(e){
        return res.status(401).json({
            status: "fail",
            message: "Auth fail"
        })
    }
})

/* edit
URL:localhost:3000/user/edit
Method: POST
body:
{
    "user": "{
        _id : xxxxxxxxxxxxx
        username: xxx
        xxx: xxx
        ...
    },
    "token": xxxxxxxxx
}
*/
router.post('/edit',AuthToken, (req,res)=>{
    try{
        console.log(req.body)
        username = req.username
        _id = req._id
        request_user = req.body.user

        //if _id not match
        if (request_user._id != _id){
            console.log("request_user._id != _id")
            return res.status(401).json({
                status: "fail",
                message: "Auth fail"
            })
        }

        //EDIT
        User.findById(request_user._id).exec()
        .then((user) =>{
            if(!user){
                //user not exist
                console.log("!user")
                return res.status(401).json({
                    status: "fail",
                    message: "Auth fail"
                })
            }

            User.findByIdAndUpdate(request_user._id, request_user, { new: true }).exec()
            .then(updatedUser =>{
                updatedUser.password = undefined
                const token = jwt.sign({
                                username : updatedUser.username,
                                _id : updatedUser._id
                            }, process.env.JWT_KEY, {
                                expiresIn: "10d"
                            })
                return res.status(200).json({
                    message: 'Auth success',
                    status: 'success',
                    token: token,
                    user: updatedUser
                })

            }).catch(err =>{
                console.log(err)
                return res.status(401).json({
                    status: "fail",
                    message: "Auth fail"
                })
            })

        }).catch(err =>{
            console.log(err)
            return res.status(401).json({
                status: "fail",
                message: "Auth fail"
            })
        })

    }catch(e){
        console.log(e)
        res.status(401).json({
            status: "fail",
            message: "Auth fail"
        })
    }
})





module.exports = router