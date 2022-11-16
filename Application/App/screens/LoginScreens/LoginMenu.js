import React from 'react'
import {
    StatusBar,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    Text,
    View
} from 'react-native'

import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { SIZES, COLORS } from '../../constants/Index';
import { Images } from '../../constants/Index';

export default function LoginMenu({ navigation }) {

    // disable back press
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, [])
    )


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.tertiary} barStyle="light-content" />
            <View style={styles.header}>
                <Animatable.Image
                    animation="bounceIn"
                    duraton="1500"
                    source={Images.logo}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Animatable.Text
                    animation="bounceIn"
                    duraton="1500"
                    resizeMode="stretch"
                    style={styles.text}
                >C<Animatable.Text
                    animation="bounceIn"
                    duraton="1500"
                    resizeMode="stretch"
                    style={styles.text2}
                >OMP4342-GroupProject</Animatable.Text></Animatable.Text>

            </View>
            <Animatable.View
                style={[styles.footer, {
                }]}
                animation="fadeInUpBig"
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                >
                    <LinearGradient
                        colors={['#F3B057', COLORS.primary]}
                        style={styles.signIn}
                    >
                        <Text style={[styles.iAmNew]}>I am New</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signIn}
                    //style={{ marginTop: 35 }}
                    onPress={() => navigation.navigate("SignIn")}
                >
                    <LinearGradient
                        colors={['#35cfe0', "#00BBF2"]}
                        style={styles.signIn}
                    >
                        <Text style={[styles.havaAc]}>I have an account already</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.tertiary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginTop:35
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white

    },
    footer: {
        flex: .8,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: SIZES.height * 0.28,
        height: SIZES.height * 0.28
    },
    text: {
        color: COLORS.primary,
        marginTop: 30,
        fontSize: 30,
        fontWeight: 'bold'
    },
    text2: {
        color: COLORS.darkgray,
        marginTop: 30,
        fontSize: 30,
    },
    iAmNew: {

        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',
        color: COLORS.white,
        fontWeight: "bold"
    },
    havaAc: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',

    }
})
