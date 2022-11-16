import React from 'react'
import {StyleSheet} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from '../screens/HomeScreens/Dashboard'
import CameraScreen from '../screens/HomeScreens/CameraScreens'
import PredictScreen from '../screens/HomeScreens/PredictScreen'
import { COLORS } from '../constants/Index'

const StackNav = createStackNavigator()

export default function HomeNavigator({ navigation }) {
    return (
        <StackNav.Navigator screenOptions={{headerShown:false}}>
            <StackNav.Screen name="Dashboard" component={Dashboard} />
            <StackNav.Screen name="CameraScreen" component={CameraScreen} />
            <StackNav.Screen name="PredictScreen" component={PredictScreen} />
        </StackNav.Navigator>
    )
}

const styles = StyleSheet.create({
    back: {
        backgroundColor: COLORS.black,
        tintColor: COLORS.black
    }
})