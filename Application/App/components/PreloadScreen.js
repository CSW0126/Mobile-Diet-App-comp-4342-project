import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Images, COLORS } from '../constants/Index';

const PreLoadScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.logo} style={styles.iconImage} />
            <ActivityIndicator size="large" color={COLORS.white} style={styles.indicator} />
        </SafeAreaView>
    )
}

export default PreLoadScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },

    indicator: {
        marginTop: "5%"
    },

    iconImage: {
        width: 200,
        height: 200,
    }
});