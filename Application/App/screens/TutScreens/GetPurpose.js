import React from 'react'
import {
    View,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
    ScrollView
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { COLORS, GlobalVariables, ImgJson } from '../../constants/Index';

export default function GetPurpose({ navigation }) {
    const handlePress = (val) => {
        GlobalVariables.loginUser.purpose = val
        console.log("purpose : " + GlobalVariables.loginUser.purpose);
        if (val == 'Keep') {
            navigation.navigate("KeepResult")
        } else {
            navigation.navigate("IncLoseResult")
        }
    }

    return (
        <ScrollView keyboardDismissMode='interactive'   contentContainerStyle={{
            flex: 1
         }}>
            <View style={styles.container}>
                <StatusBar backgroundColor={COLORS.tertiary} barStyle="light-content" />
                <Animatable.View
                    animation="fadeInLeftBig"
                    style={styles.header}
                >
                    <LottieView source={ImgJson.earth} autoPlay loop />
                </Animatable.View>
                <Animatable.View
                    animation="fadeInRightBig"
                    style={styles.footer}>
                    <Text style={styles.text_header}>Step 5/5</Text>
                    <Text style={styles.text_2}>What is your Purpose?</Text>

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => handlePress("Keep")}
                        >
                            <LinearGradient
                                colors={[COLORS.tertuary2, COLORS.tertiary]}
                                style={styles.btn}
                            >
                                <Text style={[styles.btnText]}>Keep Weight</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => handlePress("Increase")}
                        >
                            <LinearGradient
                                colors={[COLORS.primary2, COLORS.primary]}
                                style={styles.btn}
                            >
                                <Text style={[styles.btnText]}>Increase Weight</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => handlePress("Lose")}
                        >
                            <LinearGradient
                                colors={[COLORS.secondary, COLORS.blue]}
                                style={styles.btn}
                            >
                                <Text style={[styles.btnText]}>Lose Weight</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    txInput: {
        borderColor: COLORS.black,
        borderWidth: 1,
        borderRadius: 20,
        height: 40,
        marginTop: 20,
        textAlign: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.tertiary,
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    text_header: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 30,
    },
    text_2: {
        color: "#000",
        fontSize: 18,
        marginTop: Platform.OS === 'ios' ? 10 : 0,
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === "ios" ? 30 : 0
    },
    img: {
        marginTop: Platform.OS === 'ios' ? 50 : 0,
        width: 200,
        height: 200,
    },
    errorMsg2: {
        color: '#FF0000',
        fontSize: 14,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20
    },
    footer: {
        flex: 3,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    button: {
        flexDirection: 'column',
        marginTop: Platform.OS === 'ios' ? 50 : 30,
        justifyContent: 'space-evenly'
    },
    btnLin: {
        flexDirection: 'row'
    },
    btnOption: {
        flexDirection: 'row',
        width: '60%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    btnText: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',
        fontWeight: "bold"

    },
    btn: {
        width: '90%',
        marginTop: 20,
        height: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
})
