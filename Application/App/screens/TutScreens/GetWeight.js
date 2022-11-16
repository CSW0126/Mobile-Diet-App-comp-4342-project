import React from 'react'
import {
    View,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput,
    Platform,
    ScrollView
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { COLORS, GlobalVariables, ImgJson } from '../../constants/Index';


export default function GetWeight({ navigation }) {

    const [weight, setWeight] = React.useState({
        weight: 0,
        isValidNumber: true,
        msg: ''
    })

    const handleTextChange = (val) => {
        const numericRegex = /\d+\.?\d*/
        if (numericRegex.test(val)) {
            if (val < 10 || val > 700) {
                setWeight({
                    ...weight,
                    isValidNumber: false,
                    msg: "Should be in range 10 - 700 kg",
                    weight: val
                })
            } else {
                setWeight({
                    ...weight,
                    isValidNumber: true,
                    weight: val
                })
            }
        } else {
            setWeight({
                ...weight,
                isValidNumber: false,
                msg: "Please input a number",
                weight: val
            })
        }
    }

    const handleNext = () => {
        if (weight.isValidNumber && weight.weight >= 10 && weight.weight <= 700) {
            GlobalVariables.loginUser.weight = weight.weight;
            console.log("weight input : " + GlobalVariables.loginUser.weight)
            // console.log(weight.weight)
            navigation.navigate("GetHeight")
        } else {
            setWeight({
                ...weight,
                isValidNumber: false,
                msg: "Please fill in the Weight!"
            })
        }
    }


    return (
        <ScrollView keyboardDismissMode='interactive'   contentContainerStyle={{
            flex: 1
         }}>
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.quaternary} barStyle="light-content" />
            <Animatable.View
                animation="fadeInLeftBig"
                style={styles.header}
            >
                <LottieView source={ImgJson.people3} autoPlay loop />
            </Animatable.View>
            <Animatable.View
                animation="fadeInRightBig"
                style={styles.footer}>
                <Text style={styles.text_header}>Step 2/5</Text>
                <Text style={styles.text_2}>What is your Weight?</Text>


                <View>
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.txInput}
                        placeholder="in kg"
                        autoCapitalize='none'
                        keyboardType={'numeric'}
                        onChangeText={(val) => handleTextChange(val)}

                    />
                </View>
                {weight.isValidNumber ? null
                    :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg2}>{weight.msg}</Text>
                    </Animatable.View>
                }
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.btnNext}
                        onPress={handleNext}
                    >
                        <LinearGradient
                            colors={['#F3B057', COLORS.primary]}
                            style={styles.btnNext}
                        >
                            <Text style={[styles.btnText]}>Next</Text>
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
        backgroundColor: COLORS.quaternary,
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
        flex: 3,
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

    },
    btnNext: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },


})
