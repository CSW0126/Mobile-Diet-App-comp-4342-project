import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import FoodInfo from '../../components/FoodInfo'
import { Platform } from 'react-native'
import { COLORS } from '../../constants/Theme'
import FoodHelper from '../../helper/FoodHelper'
import UserHelper from '../../helper/UserHelper'
import { GlobalVariables } from '../../constants/Index'

export default function FoodInfoScreen({ route, navigation }) {

    const [foodItem, setFoodItem] = useState(route.params.item)
    const [btnType, setBtnType] = useState(route.params.btnType)

    useEffect(() => {
        //console.log(route)
    }, [])

    const handleSave = async (foodObject, quantity) => {
        // console.log(foodObject),
        //console.log(quantity)
        // console.log(foodObject)
        //add to meal list

        if (btnType == 'Add') {
            addSimpleFood(foodObject, quantity, true)
        }


    }

    const updateUser = async () => {
        console.log("foodinfo 59")
        // try {
        //     let resp = await UserHelper.AsyncEditUser(GlobalVariables.loginUser._id, GlobalVariables.loginUser)
        //     if (resp.status == 'success') {
        //         UserHelper.UpdateReference(resp.user)
        //     } else {
        //         throw resp.message
        //     }
        // } catch (e) {
        //     console.log(e)
        // }
    }

    const addSimpleFood = async (foodObject, quantity, enableGoBack) => {
        let mealObject = GlobalVariables.mealObject
        //convert format
        let food = FoodHelper.ConvertSimpleFoodJSONToDBFormat(foodObject, quantity)
        //console.log("-----")
        //console.log(food)
        //if success
        if (food) {
            let found = false;
            //search for same food in meal list

            for (let i = 0; i < mealObject.food.length; i++) {
                //if found
                if (mealObject.food[i]._id) {
                    if (mealObject.food[i]._id == food._id) {
                        //console.log("id")
                        let q = mealObject.food[i].quantity + food.quantity
                        //max 100 
                        if (q > 100) {
                            q = 100
                        }
                        mealObject.food[i].quantity = q
                        found = true;
                        break
                    }


                } else if (mealObject.food[i].name == food.name) {
                    //edit quantity
                    //console.log("name")
                    let q = mealObject.food[i].quantity + food.quantity
                    //max 100 
                    if (q > 100) {
                        q = 100
                    }
                    mealObject.food[i].quantity = q
                    found = true;
                    break
                }
            }



            //if not found, push
            if (!found) {
                mealObject.food.push(food)
            }

            //update 
            try {
                let resp = await UserHelper.AsyncEditUser(GlobalVariables.loginUser._id, GlobalVariables.loginUser)
                if (resp.status == 'success') {
                    console.log('User edited')
                    //GlobalVariables.mealListCase = "FoodInfo"
                    GlobalVariables.loginUser = resp.user
                    let daymeal = EatRecordHelper.getDayMealByDay(GlobalVariables.selectedDate)
                    GlobalVariables.mealObject = EatRecordHelper.getMealBySlot(daymeal, GlobalVariables.selectedSlot)
                    //navigation.navigate("MealListScreen")
                    if (enableGoBack) {
                        navigation.goBack()
                    }

                } else {
                    throw resp.message
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    const editSimpleFood = async (foodObject, quantity) => {
        try {
            let mealObject = GlobalVariables.mealObject
            for (let i = 0; i < mealObject.food.length; i++) {
                //console.log(mealObject.food[i].name + " " + foodObject.foodName)
                if (mealObject.food[i].name == foodObject.foodName) {
                    mealObject.food[i].quantity = quantity
                    break;
                }
            }
            let resp = await UserHelper.AsyncEditUser(GlobalVariables.loginUser._id, GlobalVariables.loginUser)
            if (resp.status == 'success') {
                console.log("User Updated")
                navigation.goBack()
            } else {
                throw resp.message
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >

                <FoodInfo
                    foodItem={foodItem}
                    navigation={navigation}
                    btnText={btnType}
                    saveClick={(foodObject, quantity) => handleSave(foodObject, quantity)}
                    showDelete={false}
                />
                
            </KeyboardAvoidingView>

        </SafeAreaView >


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
})
