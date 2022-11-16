import React from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { COLORS } from '../constants/Index'
import Tab from './Tab'
const { width } = Dimensions.get('screen')

export default function TabBar({ state, navigation }) {
    const [selected, setSelected] = React.useState('Home')
    const { routes } = state;
    const renderColor = (currentTab) => (currentTab === selected ? COLORS.quaternary : COLORS.black)

    const handlePress = (activeTab, index) => {
        setSelected(activeTab);
        if (state.index !== index) {
            navigation.navigate(activeTab)
        }
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                {
                    routes.map((route, index) => <Tab
                        tab={route}
                        icon={route.params.icon}
                        onPress={() => handlePress(route.name, index)}
                        color={renderColor(route.name)}
                        key={route.key} />)
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        width,
        height: 50,
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flexDirection: 'row',
        width,
        backgroundColor: COLORS.white,
        justifyContent: "space-between",
        elevation: 2,
    }
})
