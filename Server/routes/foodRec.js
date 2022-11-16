//https://clarifai.com/clarifai/main/models/food-item-recognition?inputId=https%3A%2F%2Fs3.amazonaws.com%2Fsamples.clarifai.com%2Ffeatured-models%2Ffood-pepperoni-pizza.jpg
// https://www.nutritionix.com/

const https = require('https');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require("fs");
var mime = require('mime-types')
const { json } = require('body-parser');
const { foodObject } = require('../models/food.js');

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

router.post('/',upload.single('FoodImage'), async (req, res, next) =>{
    try{
        console.log(req.file);
        // console.log(req.file.path);
        const imageUrl = req.file.path;

        if (fs.existsSync(imageUrl)) {
            const imageBytes = fs.readFileSync(imageUrl);
            //call food Rec API
            res.status(200).json({message:"finish"})
         
            const clarifaiRsult  =  await foodRec(imageBytes)
            console.log("clarifaiRsult is ", clarifaiRsult)
            
            if(clarifaiRsult == null){
                throw 'clarfai API error'
            }

            const turnResult = await jsonToArrayToQuery(clarifaiRsult.turnResult)
            console.log("what is this", turnResult)

            const respFromNutriDB = await doNutritionixDBRequest(turnResult)

            console.log(respFromNutriDB)

        } else {
            res.status(500).json({
                message: 'upload fail'
            })
        }
    }catch(err){

    }
})




function foodRec(imageBytes ){
    const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " +  process.env.FOOD_REC_API_KEY);
    var jsonArr = [];

    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: process.env.FOOD_REC_MODEL_ID,
            inputs: [{data: {image: {base64 : imageBytes}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }

            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                jsonArr.push({
                    name: c.name,
                    value: c.value
                })
            }
            console.log("here we go ", jsonArr)
            
            if (typeof callback === 'function') {
                return callback(jsonArr);
              }
        }
        
    );

}
//export
module.exports = router;