import React from 'react'
import {StyleSheet} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from '../screens/HomeScreens/Dashboard'
import CameraScreen from '../screens/HomeScreens/CameraScreens'
import PredictScreen from '../screens/HomeScreens/PredictScreen'
import FoodInfoScreen from '../screens/HomeScreens/FoodInfoScreen'
import { COLORS } from '../constants/Index'
import MealListScreen from '../screens/HomeScreens/MealListScreen'

const StackNav = createStackNavigator()

export default function HomeNavigator({ navigation }) {
    return (
        <StackNav.Navigator screenOptions={{headerShown:false}}>
            <StackNav.Screen name="Dashboard" component={Dashboard} />
            <StackNav.Screen name="CameraScreen" component={CameraScreen} />
            <StackNav.Screen name="PredictScreen" component={PredictScreen} />
            <StackNav.Screen name="FoodInfoScreen" component={FoodInfoScreen} />
            <StackNav.Screen name="MealListScreen" component={MealListScreen} />
        </StackNav.Navigator>
    )
}

const styles = StyleSheet.create({
    back: {
        backgroundColor: COLORS.black,
        tintColor: COLORS.black
    }
})