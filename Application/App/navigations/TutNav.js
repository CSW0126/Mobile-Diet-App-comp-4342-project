import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import GetGender from '../screens/TutScreens/GetGender';
import GetWeight from '../screens/TutScreens/GetWeight';
import GetHeight from '../screens/TutScreens/GetHeight';
import GetAge from '../screens/TutScreens/GetAge';
import GetPurpose from '../screens/TutScreens/GetPurpose';
import IncLoseResult from '../screens/TutScreens/IncLoseResult';
import KeepResult from '../screens/TutScreens/KeepResult';
const TutStack = createStackNavigator();

export default function TutStackNav() {
    return (
        <TutStack.Navigator screenOptions={{headerShown:false}}>
            <TutStack.Screen name="GetGender" component={GetGender} />
            <TutStack.Screen name="GetWeight" component={GetWeight} />
            <TutStack.Screen name="GetHeight" component={GetHeight} />
            <TutStack.Screen name="GetAge" component={GetAge} />
            <TutStack.Screen name="GetPurpose" component={GetPurpose} />
            <TutStack.Screen name="IncLoseResult" component={IncLoseResult} />
            <TutStack.Screen name="KeepResult" component={KeepResult} />
        </TutStack.Navigator>
    )
}