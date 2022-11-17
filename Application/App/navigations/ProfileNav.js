import React from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Profile from '../screens/ProfileScreens/Profile'
import EditProfile from '../screens/ProfileScreens/EditProfile'
import { COLORS } from '../constants/Index'
import Report from '../screens/ProfileScreens/Report'

const StackNav = createStackNavigator()

export default function ProfileNavigator({ navigation }) {
    return (
        <StackNav.Navigator screenOptions={{headerShown:false}}>
            <StackNav.Screen name="Profile" component={Profile} />
            <StackNav.Screen name="EditProfile" component={EditProfile} />
            <StackNav.Screen name="Report" component={Report} />
        </StackNav.Navigator>
    )
}

const styles = StyleSheet.create({
    back: {
        backgroundColor: COLORS.black,
        tintColor: COLORS.black
    }
})