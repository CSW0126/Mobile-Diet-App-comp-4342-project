const mongoose = require('mongoose')
const Nutrition = require('./nutrition')
const NutritionModel = mongoose.model('Nutrition', Nutrition)

module.exports = new mongoose.Schema({
    name: {type:String, default: ""},
    imageUrl : {type:String, default: ""},
    unit : {type: String, default: ""},
    quantity :{type: Number, default: 1},
    nutrition: {type: Nutrition, default: ()=>{return new NutritionModel({})}}

    
})


function foodRec(){
    const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " +  process.env.FOOD_REC_API_KEY);
    const imageBytes = fs.readFileSync("uploads/apple.jpg"); 

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
                console.log(c.name + ": " + c.value);
            }
        }
    );
}
