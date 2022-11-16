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
    }
}

export default FoodHelper