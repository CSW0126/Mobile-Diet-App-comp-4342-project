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

export default function GetAge({ navigation }) {
    const [age, setAge] = React.useState({
        age : 0,
        isValidNumber: true,
        msg: ''
    })

    const handleTextChange = (val) => {
        const numericRegex = /\d+\.?\d*/
        if (numericRegex.test(val)) {
            if (val < 1 || val > 150) {
                setAge({
                    ...age,
                    isValidNumber: false,
                    msg: "Should be in range 1 - 150",
                    age: val
                })
            } else {
                setAge({
                    ...age,
                    isValidNumber: true,
                    age: val
                })
            }
        } else {
            setAge({
                ...age,
                isValidNumber: false,
                msg: "Please input a number",
                age: val
            })
        }
    }

    const handleNext = () => {
        console.log(age.isValidNumber)
        if (age.isValidNumber && age.age >0 && age.age <= 150){
            GlobalVariables.loginUser.age = age.age
            console.log("Age: " + GlobalVariables.loginUser.age)
            navigation.navigate("GetPurpose");
        }else{
            setAge({
                ...age,
                isValidNumber: false,
                msg: "Please fill in the age (1-150)"
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
                    <LottieView source={ImgJson.birthday} autoPlay loop />
                </Animatable.View>
                <Animatable.View
                    animation="fadeInRightBig"
                    style={styles.footer}>
                    <Text style={styles.text_header}>Step 4/5</Text>
                    <Text style={styles.text_2}>What is your age?</Text>



                    <View>
                            <TextInput
                                underlineColorAndroid='transparent'
                                style={styles.txInput}
                                placeholder="1-150"
                                autoCapitalize='none'
                                keyboardType={'numeric'}
                                onChangeText={(val) => handleTextChange(val)}

                            />
                        </View>
                        {age.isValidNumber ? null
                            :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg2}>{age.msg}</Text>
                            </Animatable.View>
                        }

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.btnNext}
                            onPress={handleNext}
                        >
                            <LinearGradient
                                colors={[COLORS.primary2, COLORS.primary]}
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
    datepickView: {
        marginHorizontal: 20,
        marginTop: 20
    },
    datePick_text: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        textAlign: 'center'
    },
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
