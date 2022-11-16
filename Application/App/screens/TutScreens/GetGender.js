import React from 'react'
import {
    View,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
    Text,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { COLORS, GlobalVariables, ImgJson } from '../../constants/Index';



export default function GetGender({ navigation }) {
    //disable back press
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
    const handleMalePress = () => {
        GlobalVariables.loginUser.gender = "Male"
        // console.log(JSON.stringify(global.loginUser))
        console.log("gender input : " + GlobalVariables.loginUser.gender)
        // console.log("Male")
        navigation.navigate("GetWeight")
    }

    const handleFemalePress = () => {
        GlobalVariables.loginUser.gender = "Female"
        // console.log(JSON.stringify(global.loginUser))
        console.log("gender input : " + GlobalVariables.loginUser.gender)
        // console.log("Female")
        navigation.navigate("GetWeight")
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.tertiary} barStyle="light-content" />
            <Animatable.View
                animation="fadeInLeftBig"
                style={styles.header}
            >
                <LottieView source={ImgJson.people} autoPlay loop />
            </Animatable.View>
            <Animatable.View
                animation="fadeInRightBig"
                style={styles.footer}>
                <Text style={styles.text_header}>Step 1/5</Text>
                <Text style={styles.text_2}>What is your Gender?</Text>


                <View style={styles.button}>
                    <TouchableOpacity
                        onPress={handleMalePress}
                        style={styles.btnOption}
                    >
                        <LinearGradient
                            colors={[COLORS.primary2, COLORS.primary]}
                            style={styles.btnOption}
                        >
                            <FontAwesome
                                name="male"
                                color={COLORS.black}
                                size={20}
                            />
                            <Text style={[styles.btnText]}>    Male</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleFemalePress}
                        style={styles.btnOption}
                    >
                        <LinearGradient
                            colors={[COLORS.tertuary2, COLORS.tertiary]}
                            style={styles.btnOption}
                        >
                            <FontAwesome
                                name="female"
                                color={COLORS.black}
                                size={20}
                            />
                            <Text style={[styles.btnText]}>    Female</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        fontSize: 30
    },
    text_2: {
        color: "#000",
        fontSize: 18,
        marginTop: Platform.OS === 'ios' ? 10 : 0,
    },
    header: {
        flex: 3,
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        marginTop: Platform.OS === 'ios' ? 50 : 0,
        width: 200,
        height: 200,
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
        flexDirection: "row",
        marginTop: Platform.OS === 'ios' ? 50 : 50,
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
        color: COLORS.black,
        fontWeight: "bold"

    }

})
