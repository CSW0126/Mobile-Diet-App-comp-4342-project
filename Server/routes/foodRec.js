//https://clarifai.com/clarifai/main/models/food-item-recognition?inputId=https%3A%2F%2Fs3.amazonaws.com%2Fsamples.clarifai.com%2Ffeatured-models%2Ffood-pepperoni-pizza.jpg
// https://www.nutritionix.com/

const https = require('https');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require("fs");
var mime = require('mime-types')
const { json } = require('body-parser');

router.post('/', (req, res, next) => {
    console.log(req.headers);
    console.log(req.body);
    next();
});
//setting of upload image (MAX)
const fileSizeInMB = 8;
//storage setting
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const now = new Date().toISOString();
        const date = now.replace(/:/g, '-');
        cb(null, date + "FoodImage." + mime.extension(file.mimetype));
    }
});
//file filter
const fileFilter = (req, file, cb) => {
    console.log(file);
    //reject file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Unexpected file type'), false);
    }
}
//upload setting
const upload = multer({
    storage: storage,
    //upload size setting
    limits: {
        fileSize: 1024 * 1024 * fileSizeInMB
    },
    fileFilter: fileFilter
});

router.post('/',upload.single('FoodImage'), (req, res, next) =>{
    console.log(req.file);
    // console.log(req.file.path);
    const imageUrl = req.file.path;

    if (fs.existsSync(imageUrl)) {
        const imageBytes = fs.readFileSync(imageUrl);
        //call food Rec API
        res.status(200).json({message:"finish"})

    } else {
        res.status(500).json({
            message: 'upload fail'
        })
    }
})

//export
module.exports = router;