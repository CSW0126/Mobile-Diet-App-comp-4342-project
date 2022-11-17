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

            res.status(200).json({ 
                status: "success",
                food: outputJson.result})
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

router.post('/foodRecTest',upload.single('FoodImage'), (req, res, next) =>{
    console.log(req.file);
    // console.log(req.file.path);
    const imageUrl = req.file.path;

    if (fs.existsSync(imageUrl)) {
        const imageBytes = fs.readFileSync(imageUrl);
        //call food Rec API
        res.status(200).json({
            status: "success",
            food: [
                {
                    "foodName": "sweet",
                    "value": 0.9969269
                },
                {
                    "foodName": "bread",
                    "value": 0.99217105,
                    "qty": 1,
                    "unit": "slice",
                    "calories": 77.14,
                    "total_fat": 0.97,
                    "saturated_fat": 0.2,
                    "cholesterol": 0,
                    "sodium": 142.1,
                    "total_carbohydrate": 14.33,
                    "dietary_fiber": 0.78,
                    "sugars": 1.64,
                    "protein": 2.57,
                    "potassium": 36.54,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/8_thumb.jpg"
                },
                {
                    "foodName": "dairy product",
                    "value": 0.984934
                },
                {
                    "foodName": "pastry",
                    "value": 0.9815415,
                    "qty": 1,
                    "unit": "pastry",
                    "calories": 297.1,
                    "total_fat": 15.57,
                    "saturated_fat": 8.85,
                    "cholesterol": 42.5,
                    "sodium": 288.1,
                    "total_carbohydrate": 33.42,
                    "dietary_fiber": 1.9,
                    "sugars": 11.91,
                    "protein": 5.69,
                    "potassium": 108,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/1351_thumb.jpg"
                },
                {
                    "foodName": "butter",
                    "value": 0.98013735,
                    "qty": 1,
                    "unit": "tbsp",
                    "calories": 101.81,
                    "total_fat": 11.52,
                    "saturated_fat": 7.29,
                    "cholesterol": 30.53,
                    "sodium": 91.31,
                    "total_carbohydrate": 0.01,
                    "dietary_fiber": 0,
                    "sugars": 0.01,
                    "protein": 0.12,
                    "potassium": 3.41,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/328_thumb.jpg"
                },
                {
                    "foodName": "cake",
                    "value": 0.97416174,
                    "qty": 1,
                    "unit": "piece",
                    "calories": 261.97,
                    "total_fat": 12,
                    "saturated_fat": 1.97,
                    "cholesterol": 50.25,
                    "sodium": 180.23,
                    "total_carbohydrate": 37.65,
                    "dietary_fiber": 0.2,
                    "sugars": 28,
                    "protein": 2,
                    "potassium": 35.51,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/320_thumb.jpg"
                },
                {
                    "foodName": "cheese",
                    "value": 0.87737894,
                    "qty": 1,
                    "unit": "slice (1 oz)",
                    "calories": 113.12,
                    "total_fat": 9.33,
                    "saturated_fat": 5.28,
                    "cholesterol": 27.72,
                    "sodium": 182.84,
                    "total_carbohydrate": 0.87,
                    "dietary_fiber": 0,
                    "sugars": 0.13,
                    "protein": 6.4,
                    "potassium": 21.28,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/1034_thumb.jpg"
                },
                {
                    "foodName": "corn bread",
                    "value": 0.82167166,
                    "qty": 1,
                    "unit": "piece",
                    "calories": 172.9,
                    "total_fat": 4.62,
                    "saturated_fat": 1.01,
                    "cholesterol": 26,
                    "sodium": 427.7,
                    "total_carbohydrate": 28.28,
                    "dietary_fiber": null,
                    "sugars": null,
                    "protein": 4.36,
                    "potassium": 95.55,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/507_thumb.jpg"
                },
                {
                    "foodName": "pie",
                    "value": 0.76276326,
                    "qty": 1,
                    "unit": "piece (1/8 of 9\" dia)",
                    "calories": 296.25,
                    "total_fat": 13.75,
                    "saturated_fat": 4.75,
                    "cholesterol": 0,
                    "sodium": 251.25,
                    "total_carbohydrate": 42.5,
                    "dietary_fiber": 2,
                    "sugars": 19.56,
                    "protein": 2.38,
                    "potassium": 81.25,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/1291_thumb.jpg"
                },
                {
                    "foodName": "flour",
                    "value": 0.6593867,
                    "qty": 1,
                    "unit": "cup",
                    "calories": 455,
                    "total_fat": 1.23,
                    "saturated_fat": 0.19,
                    "cholesterol": 0,
                    "sodium": 2.5,
                    "total_carbohydrate": 95.39,
                    "dietary_fiber": 3.38,
                    "sugars": 0.34,
                    "protein": 12.91,
                    "potassium": 133.75,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/206_thumb.jpg"
                },
                {
                    "foodName": "cream",
                    "value": 0.64617336,
                    "qty": 1,
                    "unit": "fl oz",
                    "calories": 101.32,
                    "total_fat": 10.75,
                    "saturated_fat": 6.86,
                    "cholesterol": 33.67,
                    "sodium": 8.05,
                    "total_carbohydrate": 0.82,
                    "dietary_fiber": 0,
                    "sugars": 0.87,
                    "protein": 0.85,
                    "potassium": 28.31,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/273_thumb.jpg"
                },
                {
                    "foodName": "milk",
                    "value": 0.59103906
                },
                {
                    "foodName": "biscuits",
                    "value": 0.5890875,
                    "qty": 1,
                    "unit": "biscuit (2-1/2\" dia)",
                    "calories": 211.8,
                    "total_fat": 9.78,
                    "saturated_fat": 2.59,
                    "cholesterol": 1.8,
                    "sodium": 348,
                    "total_carbohydrate": 26.76,
                    "dietary_fiber": 0.9,
                    "sugars": 1.31,
                    "protein": 4.2,
                    "potassium": 72.6,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/2462_thumb.jpg"
                },
                {
                    "foodName": "candy",
                    "value": 0.58555377,
                    "qty": 1,
                    "unit": "piece",
                    "calories": 23.64,
                    "total_fat": 0.01,
                    "saturated_fat": 0,
                    "cholesterol": 0,
                    "sodium": 2.28,
                    "total_carbohydrate": 5.88,
                    "dietary_fiber": 0,
                    "sugars": 3.77,
                    "protein": 0,
                    "potassium": 0.3,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/241_thumb.jpg"
                },
                {
                    "foodName": "knish",
                    "value": 0.56059897,
                    "qty": 1,
                    "unit": "piece",
                    "calories": 74.41,
                    "total_fat": 2.63,
                    "saturated_fat": 0.27,
                    "cholesterol": 9.3,
                    "sodium": 73.83,
                    "total_carbohydrate": 11.08,
                    "dietary_fiber": 0.7,
                    "sugars": 0.6,
                    "protein": 1.66,
                    "potassium": 101,
                    "photo": "https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png"
                },
                {
                    "foodName": "dough",
                    "value": 0.54743946,
                    "qty": 1,
                    "unit": "pie crust (average weight)",
                    "calories": 1019.05,
                    "total_fat": 58.3,
                    "saturated_fat": 21.97,
                    "cholesterol": null,
                    "sodium": 936.61,
                    "total_carbohydrate": 117.04,
                    "dietary_fiber": 4.12,
                    "sugars": null,
                    "protein": 6.8,
                    "potassium": 167.17,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/1263_thumb.jpg"
                },
                {
                    "foodName": "cookie",
                    "value": 0.49080485,
                    "qty": 1,
                    "unit": "medium (3\" diameter)",
                    "calories": 147.6,
                    "total_fat": 7.42,
                    "saturated_fat": 2.43,
                    "cholesterol": 0,
                    "sodium": 93.3,
                    "total_carbohydrate": 19.61,
                    "dietary_fiber": 0.6,
                    "sugars": 9.87,
                    "protein": 1.53,
                    "potassium": 51.3,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/57_thumb.jpg"
                },
                {
                    "foodName": "chocolate",
                    "value": 0.37058443,
                    "qty": 1,
                    "unit": "piece",
                    "calories": 37.45,
                    "total_fat": 2.08,
                    "saturated_fat": 1.3,
                    "cholesterol": 1.61,
                    "sodium": 5.53,
                    "total_carbohydrate": 4.16,
                    "dietary_fiber": 0.24,
                    "sugars": 3.61,
                    "protein": 0.54,
                    "potassium": 26.04,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/268_thumb.jpg"
                },
                {
                    "foodName": "egg",
                    "value": 0.31874698,
                    "qty": 1,
                    "unit": "large",
                    "calories": 71.5,
                    "total_fat": 4.76,
                    "saturated_fat": 1.56,
                    "cholesterol": 186,
                    "sodium": 71,
                    "total_carbohydrate": 0.36,
                    "dietary_fiber": 0,
                    "sugars": 0.19,
                    "protein": 6.28,
                    "potassium": 69,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/775_thumb.jpg"
                },
                {
                    "foodName": "mochi",
                    "value": 0.3007092,
                    "qty": 1,
                    "unit": "piece",
                    "calories": 125.52,
                    "total_fat": 2.6,
                    "saturated_fat": 2.09,
                    "cholesterol": 2.02,
                    "sodium": 9.19,
                    "total_carbohydrate": 24.9,
                    "dietary_fiber": 0.24,
                    "sugars": 16.56,
                    "protein": 1.25,
                    "potassium": 50.03,
                    "photo": "https://nix-tag-images.s3.amazonaws.com/3390_thumb.jpg"
                }
            ],
        })

    } else {
        res.status(500).json({
            message: 'upload fail'
        })
    }
})
//export
module.exports = router;