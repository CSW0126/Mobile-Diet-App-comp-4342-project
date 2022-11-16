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
    }
}

export default FoodHelper