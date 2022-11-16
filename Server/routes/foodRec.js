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
const nutritionix   = require("nutritionix-api");

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
            
            if(clarifaiRsult.status != 'success'){
                throw 'clarfai API error'
            }

            const turnResult = await jsonToArrayToQuery(clarifaiRsult.result)

            if(turnResult.status != 'success'){
                throw 'no data';
            }

            const respFromNutriDB = await doNutritionixDBRequest(turnResult.result)
   
            console.log(respFromNutriDB)

        } else {
            res.status(500).json({
                message: 'upload fail'
            })
        }
    }catch(err){

    }
})


function doNutritionixDBRequest(dbJSON){
    console.log("/doNutritionixDBRequest", dbJSON);



    return new Promise((resolve, reject)=>{
        // nutritionix.init(process.env.NUTRITIONIX_APP_ID, process.env.NUTRITIONIX_APP_KEY);
        // nutritionix.natural.search('Apple').then(result => {
        //     console.log(result);
        // });
        
        let data = "";
        var postData = JSON.stringify(dbJSON);
        console.log()
        var options = {
            host: 'trackapi.nutritionix.com',
            path: '/v2/natural/nutrients',
            port: 443,
            method: 'POST',
            headers: {
                'x-app-id': process.env.NUTRITIONIX_APP_ID,
                'x-app-key': process.env.NUTRITIONIX_APP_KEY,
                'x-remote-user-id': process.env.NUTRITIONIX_APP_REMOTE_ID
            }
        };

        console.log(options);

        var req = https.request(options, (res) =>{
            console.log("statusCode", res.statusCode);
            console.log("headers", res.headers);

            res.on('data', (d)=>{
                data += d
                console.log("data?", data)
            })

            res.on('end', ()=>{
                let jsondata = JSON.parse(data);
                console.log("jsondata", jsondata)

            })
        })

        req.on('error', (e)=>{
            console.error(e);

            reject({
                status: 'fail',
                message: e
            })
        })

        req.write(postData);
        req.end();
    })
}

function jsonToArrayToQuery(json){
    return new Promise((resolve, reject) =>{
        var result ="";
        var queryJSON = [];
        if(Object.keys(json).length!=0){
            for(var i in json){
                if(json[i].value >= 0.5){
                    result += "1 " + json[i].name + " ";
                }
            }
            queryJSON = {
                query: result, 
                locale: process.env.NUTRITIONIX_LOCALE
            }
            resolve({
                status: 'success',
                result: queryJSON
            });
        }else{
            reject({
                status: 'fail',
                message: 'Empty JSON'
            })
        }
    }

    )
}

function foodRec(imageBytes, callback =()=>{} ){
    const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " +  process.env.FOOD_REC_API_KEY);
    var jsonArr = [];

    return new Promise((resolve, reject) =>{
        try{
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
             
                resolve({
                    status: 'success',
                    result: jsonArr
                })
            }
    
        );
        }catch(e){
            return reject({
                status: 'fail',
                message: e
            })
        }
    })
}
//export
module.exports = router;