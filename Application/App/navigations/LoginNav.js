import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

import LoginMenu from '../screens/LoginScreens/LoginMenu'
import SignUp from '../screens/LoginScreens/SignUp'
import SignIn from '../screens/LoginScreens/SignIn'

const LoginStack = createStackNavigator();

const LoginStackNav = ({ navigation }) => (
    <LoginStack.Navigator screenOptions={{headerShown:false}}>
        <LoginStack.Screen name="LoginMenu" component={LoginMenu} />
        <LoginStack.Screen name="SignUp" component={SignUp} />
        <LoginStack.Screen name="SignIn" component={SignIn} />
    </LoginStack.Navigator>
);

export default LoginStackNav;