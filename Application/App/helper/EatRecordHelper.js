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
        console.log("TODO: EatRecordHelper > getMealSlotCal")
        return 0
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
}

export default EatRecordHelper