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

router.post('/',upload.single('FoodImage'), async (req, res, next) =>{
    try{
        console.log(req.file);
        // console.log(req.file.path);
        const imageUrl = req.file.path;

        if (fs.existsSync(imageUrl)) {
            const imageBytes = fs.readFileSync(imageUrl);
            //call food Rec API

            const clarifaiRsult  =  await foodRec(imageBytes)
            // console.log("clarifaiRsult is ", clarifaiRsult)
            
            if(clarifaiRsult.status != 'success'){
                throw 'clarfai API error'
            }

            const turnResult = await jsonToArrayToQuery(clarifaiRsult.result)

            if(turnResult.status != 'success'){
                throw 'no data';
            }

            const respFromNutriDB = await doNutritionixDBRequest(turnResult.result)

            let outputJson = await reformatJSON(clarifaiRsult.result, respFromNutriDB.result)

            if(outputJson.status != 'success'){
                throw 'reformat JSON error'
            }

            res.status(200).json({ data: outputJson.result})
        } else {
            res.status(500).json({
                message: 'upload fail'
            })
        }
    }catch(err){

    }
})


function doNutritionixDBRequest(dbJSON){
    return new Promise((resolve, reject)=>{
        let data = "";
        dbJSON.query = "1 lettuce 1 abc 1 tomato 1 garlic 1 radish 1 salad 1 cabbage 1 onion 1 happy 1 berry 1 asparagus 1 cherry tomato 1 lemon 1 mushroom 1 carrot 1 eggplant 1 broccoli 1 antipasto 1 sweet 1 romaine ";
        var postData = JSON.stringify(dbJSON);


        var options = {
            host: 'trackapi.nutritionix.com',
            path: '/v2/natural/nutrients',
            port: 443,
            method: 'POST',
            headers: {
                'x-app-id' : process.env.NUTRITIONIX_APP_ID,
                'x-app-key' : process.env.NUTRITIONIX_APP_KEY,
                'x-remote-user-id': process.env.NUTRITIONIX_APP_REMOTE_ID
            }
        };

        var req = https.request(options, (res) =>{
            console.log("statusCode", res.statusCode);
            console.log("headers", res.headers);

            res.on('data', (d)=>{
                data += d
            })

            res.on('end', ()=>{
                let jsondata = JSON.parse(data);
                resolve({
                    status: 'success',
                    result: jsondata
                })
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
                    result += "1 " + json[i].name + " ";
            }
            queryJSON = {
                query: result, 
                locale: process.env.NUTRITIONIX_LOCALE,
                num_servings: 0,
                line_delimited: false,
                use_raw_foods: false,
                include_subrecipe: false,
                lat: 0,
                lng: 0,
                meal_type: 0,
                use_branded_foods: false,
                taxonomy: false,
                ingredient_statement: false,
                last_modified: false
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

function reformatJSON( clarifaiResult, jsonNutriDBResult){
    console.log("/reformatJSON")
    return new Promise((resolve, reject) =>{
        var outputJson = [];
        var NutriDBResult = jsonNutriDBResult.foods
        var count = 0;
        if(clarifaiResult != null && NutriDBResult != null){
            for(var i in clarifaiResult){
                var j = i-count;
        
                outputJson[i] = {
                    "foodName" : clarifaiResult[i].name,
                    "value" : clarifaiResult[i].value,
                }
           
                if(clarifaiResult[i].name != NutriDBResult[j].food_name){
                    count ++;    
                }else{
                    outputJson[i] = {
                        "foodName" : clarifaiResult[i].name,
                        "value" : clarifaiResult[i].value,
                        "qty" : NutriDBResult[j].serving_qty,
                        "unit" : NutriDBResult[j].serving_unit,
                        "calories" : NutriDBResult[j].nf_calories,
                        "total_fat" : NutriDBResult[j].nf_total_fat,
                        "saturated_fat": NutriDBResult[j].nf_saturated_fat,
                        "cholesterol" : NutriDBResult[j].nf_cholesterol,
                        "sodium" : NutriDBResult[j].nf_sodium,
                        "total_carbohydrate" : NutriDBResult[j].nf_total_carbohydrate,
                        "dietary_fiber" : NutriDBResult[j].nf_dietary_fiber,
                        "sugars" : NutriDBResult[j].nf_sugars,
                        "protein" : NutriDBResult[j].nf_protein,
                        "potassium" : NutriDBResult[j].nf_potassium,
                        "photo" : NutriDBResult[j].photo.thumb
                    }
                }
                console.log("/outputJson", outputJson)

            }          
            
            resolve({
                status: 'success',
                result: outputJson
            })
        }else{
            reject({
                status: 'fail',
                message: 'Empty JSON'
            })
        }
    })
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