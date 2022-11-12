const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
// const AuthToken = require('../auth/check-token')
const User = require('../models/user')


/* create user
URL:localhost:3000/user/create_user
Method: POST
*/
router.post('/create_user', async(req, res) =>{

})

router.post('/login', async(req, res) =>{

})

router.post('/view', async (req,res)=>{

})

router.post('/edit', async(req,res)=>{

})





module.exports = router