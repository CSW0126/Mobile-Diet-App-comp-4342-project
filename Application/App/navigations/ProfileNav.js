import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Profile from '../screens/ProfileScreens/Profile'
import { COLORS } from '../constants/Index'

const StackNav = createStackNavigator()

export default function ProfileNavigator({ navigation }) {
    return (
        <StackNav.Navigator screenOptions={{headerShown:false}}>
            <StackNav.Screen name="Profile" component={Profile} />

        </StackNav.Navigator>
    )
}

const styles = StyleSheet.create({
    back: {
        backgroundColor: COLORS.black,
        tintColor: COLORS.black
    }
})