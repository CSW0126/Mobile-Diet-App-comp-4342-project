import { Constants } from 'expo-camera';
import { Url, GlobalVariables } from '../constants/Index'
import { Buffer } from "buffer";
import mime from "mime"

export const FoodHelper = {
    AsyncFoodRec: async (uri) => {
        try{
            let url = Url.apiUrl.FoodUrl.foodRec
            console.log(url)
            let formData = new FormData();
            formData.append("FoodImage", {uri : uri, name: 'FoodImage.jpg', type: mime.getType(uri)})
            console.log(formData)
            let response = await fetch(url, {
                        headers: {
                            // Accept: 'application/json',
                            // 'Content-Type': 'application/json'
                            'content-type': 'multipart/form-data',
                        },
                        method: 'POST',
                        body: formData
                    })
        
            let respJson = await response.json();
            return respJson;
        }catch (e){
            console.log(e)
            let msg = {};
            msg.status = 'fail'
            msg.message = 'Network Error'
            return msg;
        }
    },
    AsyncFoodRecTest: async (uri) =>{
        try{
            let url = Url.apiUrl.FoodUrl.foodRecTest
            console.log(url)
            let formData = new FormData();
            formData.append("FoodImage", {uri : uri, name: 'FoodImage.jpg', type: mime.getType(uri)})
            console.log(formData)
            let response = await fetch(url, {
                        headers: {
                            // Accept: 'application/json',
                            // 'Content-Type': 'application/json'
                            'content-type': 'multipart/form-data',
                        },
                        method: 'POST',
                        body: formData
                    })
        
            let respJson = await response.json();
            return respJson;
        }catch (e){
            console.log(e)
            let msg = {};
            msg.status = 'fail'
            msg.message = 'Network Error'
            return msg;
        }
    },
    ConvertFoodJSONToDBFormat: (foodJSON, qty) => {
        try {
            //console.log(foodJSON._id)
            let food = {
                _id: (foodJSON._id ? foodJSON._id : null),
                name: foodJSON.foodName,
                imageUrl: foodJSON.photo,
                unit: foodJSON.unit,
                quantity: qty,
                nutrition: {
                    calories: foodJSON.calories,
                    cholesterol: foodJSON.cholesterol,
                    dietary_fiber: foodJSON.dietary_fiber,
                    potassium: foodJSON.potassium,
                    total_fat: foodJSON.total_fat,
                    protein: foodJSON.protein,
                    total_carbohydrate: foodJSON.total_carbohydrate,
                    sugars: foodJSON.sugars,
                    sodium: foodJSON.sodium,
                    saturated_fat: foodJSON.saturated_fat
                }
            }
            return food;
        } catch (e) {
            return null
        }
    },
    ConvertDBFormatToSimpleFoodJSON: (simpleDBFood) => {
        try {
            let food = {
                _id: simpleDBFood._id ? simpleDBFood._id : null,
                foodName: simpleDBFood.name,
                photo: simpleDBFood.imageUrl,
                unit: simpleDBFood.unit,
                qty: simpleDBFood.quantity,
                calories: simpleDBFood.nutrition.calories,
                cholesterol: simpleDBFood.nutrition.cholesterol,
                dietary_fiber: simpleDBFood.nutrition.dietary_fiber,
                potassium: simpleDBFood.nutrition.potassium,
                total_fat: simpleDBFood.nutrition.total_fat,
                protein: simpleDBFood.nutrition.protein,
                total_carbohydrate: simpleDBFood.nutrition.total_carbohydrate,
                sugars: simpleDBFood.nutrition.sugars,
                sodium: simpleDBFood.nutrition.sodium,
                saturated_fat: simpleDBFood.nutrition.saturated_fat,
            }
            if (simpleDBFood.image) {
                food.image = simpleDBFood.image
            }
            return food
        } catch (e) {
            return null
        }
    },
}

export default FoodHelper