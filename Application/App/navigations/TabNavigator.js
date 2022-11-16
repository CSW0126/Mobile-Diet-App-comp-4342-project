import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TabComp from '../components/Tab'
import HomeNavigator from './HomeNav';
import ProfileNavigator from './ProfileNav';

const Tab = createBottomTabNavigator()
const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{headerShown:false}}>
            <Tab.Screen
                name='HomeTab'
                component={HomeNavigator}
                options={{
                    tabBarButton: (props) => <TabComp label="Home" {...props} />
                }}
            />

            <Tab.Screen
                name='ProfileTab'
                component={ProfileNavigator}
                options={{
                    tabBarButton: (props) => <TabComp label="Profile" {...props} />
                }}
            />

            {/* <Tab.Screen
                name='SettingTab'
                component={SettingNavigator}
                options={{
                    tabBarButton: (props) => <TabComp label="Setting" {...props} />
                }}
            /> */}


        </Tab.Navigator>
    )

}

export default TabNavigator;