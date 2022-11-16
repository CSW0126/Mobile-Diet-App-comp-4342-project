
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
import { COLORS,GlobalVariables, ImgJson } from '../../constants/Index';


export default function GetHeight({ navigation }) {
    const [height, setHeight] = React.useState({
        height: 0,
        isValidNumber: true,
        msg: ''
    })

    const handleTextChange = (val) => {
        const numericRegex = /\d+\.?\d*/
        if (numericRegex.test(val)) {
            if (val < 50 || val > 299) {
                setHeight({
                    ...height,
                    isValidNumber: false,
                    msg: "Should be in range 50 - 299 cm",
                    height: val
                })
            } else {
                setHeight({
                    ...height,
                    isValidNumber: true,
                    height: val
                })
            }
        } else {
            setHeight({
                ...height,
                isValidNumber: false,
                msg: "Please input a number",
                height: val
            })
        }
    }

    const handleNext = () => {
        if (height.isValidNumber && height.height >= 50 && height.height <= 299) {
            GlobalVariables.loginUser.height = height.height;
            console.log("height input : " + GlobalVariables.loginUser.height)
            // console.log(height.height)
            navigation.navigate("GetAge")
        } else {
            setHeight({
                ...height,
                isValidNumber: false,
                msg: "Please fill in the height!"
            })
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
                    <LottieView source={ImgJson.people2} autoPlay loop />
                </Animatable.View>
                <Animatable.View
                    animation="fadeInRightBig"
                    style={styles.footer}>
                    <Text style={styles.text_header}>Step 3/5</Text>
                    <Text style={styles.text_2}>What is your Height?</Text>


                    <View>
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={styles.txInput}
                            placeholder="in cm"
                            autoCapitalize='none'
                            keyboardType={'numeric'}
                            onChangeText={(val) => handleTextChange(val)}

                        />
                    </View>
                    {height.isValidNumber ? null
                        :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg2}>{height.msg}</Text>
                        </Animatable.View>
                    }
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.btnNext}
                            onPress={handleNext}
                        >
                            <LinearGradient
                                colors={[COLORS.tertuary2, COLORS.tertiary]}
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
