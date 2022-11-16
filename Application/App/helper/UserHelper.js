import { GlobalVariables, Url } from '../constants/Index'
//recommend rate
const bmrRecomRate = {
    bfRate: 0.2,
    lunRate: 0.35,
    dinRate: 0.40,
    othRate: 0.05,
}
export const UserHelper = {
    CalBmr: () => {
        let bmr = 0;
        try {
            let user = GlobalVariables.loginUser
            let gender = user.gender
            //$numberDecimal when fetch user
            let height = user.height
            let weight = user.weight
            let age = user.age

            console.log(user)

            // let height = user.currentAttribute.height.$numberDecimal == undefined ? user.currentAttribute.height : user.currentAttribute.height.$numberDecimal
            // let weight = user.currentAttribute.weight.$numberDecimal == undefined ? user.currentAttribute.weight : user.currentAttribute.weight.$numberDecimal

            if (gender == 'Male') {
                //male
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
                bmr = processBmrWithRate(bmr)
                //For male, the minimum recommendation of calories a day is 1500
                if (bmr <= 1500) {
                    bmr = 1500;
                }
            } else {
                //female
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
                bmr = processBmrWithRate(bmr)
                console.log(bmr)
                //For female, the minimum recommendation of calories a day is 1200
                if (bmr <= 1200) {
                    bmr = 1200;
                }
            }


        } catch (e) {
            console.log(e)
        }
        return bmr.toFixed(0)
    },
    getTypeString: () => {
        let type = ""
        let str = ""
        try {
            let targetType = GlobalVariables.plan
            let purpose = GlobalVariables.purpose

            if (purpose == 'Keep') {
                return;
            }

            switch (targetType) {
                case "1":
                    str = ' 0.25 Kg / Week'
                    break;
                case "2":
                    str = ' 0.5 Kg / Week'
                    break;
                case "3":
                    str = ' 1 Kg / Week'
                    break;
            }

            if (purpose == 'Increase') {
                type = 'Increase' + str
            } else {
                type = 'Lose' + str
            }
        } catch (e) {
            console.log(e)
        }
        return type
    },
    getBMI: () => {
        let bmi = 0;
        try {
            let user = GlobalVariables.loginUser
            let height = user.height
            let weight = user.weight
            // let height = user.currentAttribute.height.$numberDecimal == undefined ? user.currentAttribute.height : user.currentAttribute.height.$numberDecimal
            // let weight = user.currentAttribute.weight.$numberDecimal == undefined ? user.currentAttribute.weight : user.currentAttribute.weight.$numberDecimal

            bmi = weight / ((height / 100) * (height / 100))
        } catch (e) {
            console.log(e)
            bmi = 0
        }
        return bmi.toFixed(2)
    },
    getBreakfastRecomCal: () => {
        return UserHelper.CalBmr() * bmrRecomRate.bfRate
    },
    getLunchRecomCal: () => {
        return UserHelper.CalBmr() * bmrRecomRate.lunRate
    },
    getDinnerRecomCal: () => {
        return UserHelper.CalBmr() * bmrRecomRate.dinRate
    },
    getOtherRecomCal: () => {
        return UserHelper.CalBmr() * bmrRecomRate.othRate
    },
    AsyncUserToken : async(userToken)=>{
        console.log(userToken)
        try{

            let jsonBody = JSON.stringify({token:userToken})
            let url = Url.apiUrl.UserUrl.verify
            let response = await fetch(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: jsonBody
            })
            let respJson = await response.json();
            return respJson;
        }catch(e){
            console.log(e)
            let msg = {};
            msg.status = 'fail'
            msg.message = 'Network Error'
            return msg;
        }
    },
    AsyncCreateUser: async(userData)=>{
        console.log(userData)
        try{

            let jsonBody = JSON.stringify(userData)
            let url = Url.apiUrl.UserUrl.create
            let response = await fetch(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: jsonBody
            })
            let respJson = await response.json();
            return respJson;
        }catch(e){
            console.log(e)
            let msg = {};
            msg.status = 'fail'
            msg.message = 'Network Error'
            return msg;
        }
    },
    AsyncLogin: async(userData) =>{
        console.log(userData)
        try{
            let jsonBody = JSON.stringify(userData)
            let url = Url.apiUrl.UserUrl.login
            let response = await fetch(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: jsonBody
            })
            let respJson = await response.json();
            return respJson;
        }catch(e){
            console.log(e)
            let msg = {};
            msg.status = 'fail'
            msg.message = 'Network Error'
            return msg;
        }
    },
    AsyncEditUser: async(userToken, userData) =>{
        try{
            let _data = {
                user: userData,
                token : userToken
            }
            let jsonBody = JSON.stringify(_data)
            let url = Url.apiUrl.UserUrl.edit
            let response = await fetch(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: jsonBody
            })
            let respJson = await response.json();
            return respJson;
        }catch(e){
            console.log(e)
            let msg = {};
            msg.status = 'fail'
            msg.message = 'Network Error'
            return msg;
        }
    }
}
const processBmrWithRate = (bmr) => {
    let purpose = GlobalVariables.loginUser.purpose
    let targetRateType = GlobalVariables.loginUser.plan
    try {
        //if increase
        if (purpose == 'Increase') {
            switch (targetRateType) {
                case 1:
                    bmr *= 1.13;
                    break;
                case 2:
                    bmr *= 1.25;
                    break;
                case 3:
                    bmr *= 1.5;
                    break;
            }
            //if lose
        } else if (purpose == 'Lose') {
            switch (targetRateType) {
                case 1:
                    bmr *= 0.87;
                    break;
                case 2:
                    bmr *= 0.75;
                    break;
                case 3:
                    bmr *= 0.5;
                    break;
            }
        }
        //if keep, do nothing

    } catch (e) {
        console.log(e)
    }
    return bmr
}
export default UserHelper