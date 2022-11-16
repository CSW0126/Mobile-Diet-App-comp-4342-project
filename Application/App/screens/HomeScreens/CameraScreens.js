import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import CusCamera from '../../components/Camera'
import { GlobalVariables } from '../../constants/Index'


export default function CameraScreen({ route, navigation }) {

    const { useGImgBase64 } = route.params

    const handleGetImageUrl = (url) => {
        console.log("handleGetImageUrl")
        console.log(url)
        let passObject = {
            // selectedDay: route.params.selectedDay,
            // timeSlot: route.params.timeSlot,
            url: url
        }

        //console.log(GlobalVariables.selectedSlot)
        //console.log(GlobalVariables.mealObject)

        navigation.navigate('PredictScreen', passObject);
        

    }


    return (
        <CusCamera
            getImageUrl={(value) => handleGetImageUrl(value)}
            navigation={navigation}
            useGImgBase64={useGImgBase64}
        />

    )
}

const styles = StyleSheet.create({})