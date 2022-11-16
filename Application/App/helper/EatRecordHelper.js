import {GlobalVariables } from "../constants/Index"
import moment from 'moment'


export const EatRecordHelper = {
    getDayMealByDay: (selectedDay) => {
        // try {
        //     let eatRecord = GlobalVariables.loginUser.personal.eatRecord
        //     if (eatRecord.length != 0) {
        //         let dayMeal = eatRecord.find(object => moment(object.date).format("YYYY-MM-DD") == moment(selectedDay).format("YYYY-MM-DD"))
        //         if (dayMeal != undefined) {
        //             return dayMeal
        //         } else {
        //             return null
        //         }
        //     } else {
        //         return null
        //     }

        // } catch (e) {
        //     console.log(e)
        //     return null
        // }
    },
    getMealBySlot: (dayMeal, slot) => {
        try {
            // let meals;
            // switch (slot) {
            //     case 'breakfast':
            //         meals = dayMeal.breakfast
            //         break;
            //     case 'lunch':
            //         meals = dayMeal.lunch
            //         break;
            //     case 'dinner':
            //         meals = dayMeal.dinner;
            //         break;
            //     case 'other':
            //         meals = dayMeal.other;
            //         break;
            // }

            // return meals
            console.log("TODO: EatRecordHelper > getMealBySlot")
            console.log(dayMeal, slot)
            return 0
        } catch (e) {
            console.log(e)
            return null
        }
    },
    getMealSlotCal: (slotMeal) => {
        console.log("TODO: EatRecordHelper > getMealSlotCal")
        return 0
    },
}

export default EatRecordHelper