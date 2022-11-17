import {GlobalVariables } from "../constants/Index"
import moment from 'moment'


export const EatRecordHelper = {
    getEatRecordByDay:(selectedDay) =>{
        try {
            let eatRecord = GlobalVariables.loginUser.dietRecord
            if (eatRecord.length != 0) {
                let record = eatRecord.find(object => moment(object.date).format("YYYY-MM-DD") == moment(selectedDay).format("YYYY-MM-DD"))
                if (record != undefined) {
                    return record
                } else {
                    return null
                }
            } else {
                return null
            }

        } catch (e) {
            console.log(e)
            return null
        }
    },
    getRecordByDaySlot: (selectedDay, slot) => {
        try {
            let eatRecord = GlobalVariables.loginUser.dietRecord
            if (eatRecord.length != 0) {
                let record = eatRecord.find(object => moment(object.date).format("YYYY-MM-DD") == moment(selectedDay).format("YYYY-MM-DD")
                                                        && object.type == slot)
                if (record != undefined) {
                    return record
                } else {
                    return null
                }
            } else {
                return null
            }

        } catch (e) {
            console.log(e)
            return null
        }
    },
    getMealSlotCal: (slotMeal) => {
        try {
            let cal = 0

            if (!slotMeal){
                return 0
            }

            if (slotMeal.food.length == 0) {
                return 0
            }
            //get cal from simple food list
            for (let i = 0; i < slotMeal.food.length; i++) {
                cal += slotMeal.food[i].nutrition['calories'] * slotMeal.food[i].quantity
            }

            console.log(cal)

            return cal
        } catch (e) {
            return 0
        }
    },
    createEatRecordByDateSlot: (date, slot) => {
        try {
            //found meal by date
            let found = EatRecordHelper.getRecordByDaySlot(date, slot)
            //if found
            if (found) {
                console.log("Already have a meal on " + date)
                return null;
            } else {
                //not found
                //create daymeal record
                let record = {
                    date: date,
                    type: slot,
                    food: [] 
                }

                GlobalVariables.loginUser.dietRecord.push(record)
                //console.log("------EatRecordHelper(New day meal)--------")
                //console.log(daymeal)
                return record
            }
        } catch (e) {
            return null
        }
    },
    getMealCal: () => {
        try {
            let cal = 0
            let foodList = GlobalVariables.TargetEatRecord.food;
            // console.log(foodList)
            if (foodList.length == 0) {
                return 0
            }

            //get cal from simple food list
            for (let i = 0; i < foodList.length; i++) {
                cal += foodList[i].nutrition['calories'] * foodList[i].quantity
            }

            //console.log("--------------------EatRecordHelper(getMealCal)----------------")
            //console.log('Simple food list count ' + simpleFoodList.length)
            //console.log("Complex Food list count " + complexFoodList.length)
            //console.log(cal)
            return cal
        } catch (e) {
            console.log(e)
            return 0
        }
    },
}

export default EatRecordHelper