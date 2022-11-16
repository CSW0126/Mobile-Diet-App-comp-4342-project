import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../components/AuthContext';
import { COLORS, GlobalVariables, ImgJson } from '../../constants/Index';
import UserHelper from '../../helper/UserHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IncLoseResult({ navigation }) {
    const { TUT } = React.useContext(AuthContext)
    const chartRef = useRef()
    const [rate, setRate] = useState({
        targetRateType: 1,
        targetRateLabel: '0.25 Kg / Week',
        bmr: UserHelper.CalBmr(),
        isStateChange: false
    })
    const [isButtonDisable, setIsButtonDisable] = useState(false);
    useEffect(() => {
        //default 1
        GlobalVariables.loginUser.plan = 1
    }, [])

    useEffect(() => {
        if (rate.isStateChange) {
            let bmr = UserHelper.CalBmr()
            setRate({
                ...rate,
                bmr: bmr,
                isStateChange: false
            })
            chartRef.current.reAnimate(0, 100, 1000)
        }
    })


    const onFinishPress = async () => {
        console.log("Finish Press")
        GlobalVariables.loginUser.tutPass = 1
        let token_ = await AsyncStorage.getItem("userToken")
        let resp = await UserHelper.AsyncEditUser(token_, GlobalVariables.loginUser);
        if (resp.status == 'success') {
            GlobalVariables.loginUser = resp.user
            TUT(resp.token, resp.user)
        } else {
            console.log(resp)
            setIsButtonDisable(false)
        }
    }
    const handleChange = (itemValue, itemIndex) => {
        let type = itemIndex + 1;
        console.log(type)
        setRate({
            ...rate,
            targetRateType: type,
            targetRateLabel: itemValue,
            isStateChange: true
        })
        GlobalVariables.loginUser.plan = type
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.quaternary} barStyle="light-content" />
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.header}
            >
                <LottieView source={ImgJson.chart2} autoPlay loop />
            </Animatable.View>
            <Animatable.View
                animation="fadeInDownBig"
                style={styles.footer}>
                <Text style={styles.text_header}>Recommendation</Text>
                <Text style={styles.text_2}>Select the target plan</Text>
                <View>
                    <Picker
                        selectedValue={rate.targetRateLabel}
                        style={styles.pickerContainer}
                        onValueChange={(itemValue, itemIndex) => handleChange(itemValue, itemIndex)}>
                        <Picker.Item label="0.25 Kg / Week" value="0.25 Kg / Week" />
                        <Picker.Item label="0.5 Kg / Week" value="0.5 Kg / Week" />
                        <Picker.Item label="1 Kg / Week" value="1 Kg / Week" />
                    </Picker>
                </View>
                <Text style={styles.text_2}>In order to
                    <Text style={{ fontWeight: 'bold' }}> {GlobalVariables.loginUser.purpose} </Text>weight with
                    <Text style={{ fontWeight: 'bold' }}> {rate.targetRateLabel} </Text>, You should absorb
                </Text>

                <View>
                    <AnimatedCircularProgress
                        ref={chartRef}
                        style={styles.progess}
                        size={Platform.OS === 'ios' ? 200 : 150}
                        width={15}
                        fill={100}
                        tintColor={COLORS.quaternary}
                        duration={1500}
                        backgroundColor={COLORS.darkgray}
                        arcSweepAngle={240}
                        rotation={240}
                        lineCap="round"
                    >
                        {
                            (fill) => (
                                <Text style={styles.text_3}>
                                    {(fill / 100 * rate.bmr).toFixed(2)} Kcal/Day
                                </Text>
                            )
                        }

                    </AnimatedCircularProgress>
                </View>


                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.btnNext}
                        onPress={onFinishPress}
                        disabled={isButtonDisable}
                    >
                        <LinearGradient
                            colors={[COLORS.primary2, COLORS.quaternary]}
                            style={styles.btnNext}
                        >
                            <Text style={[styles.btnText]}>Finish</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    pickerContainer: {
        alignSelf: 'center',
        height: Platform.OS === "android" ? 50 : 40,
        width: Platform.OS === "android" ? 300 : 200,
        marginBottom: Platform.OS === "android" ? 0 : 150,
        padding: 0
    },
    progess: {
        alignSelf: 'center',
        marginTop: Platform.OS === 'ios' ? 15 : 20,
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
        fontSize: Platform.OS === 'ios' ? 40 : 30,
        alignSelf: 'center'
    },
    text_2: {
        color: "#000",
        textAlign: 'center',
        fontSize: Platform.OS === 'ios' ? 16 : 12,
        alignSelf: 'center',
        marginTop: Platform.OS === 'ios' ? 20 : 10,
    },
    text_3: {
        color: "#000",
        fontSize: Platform.OS === 'ios' ? 16 : 12,
        alignSelf: 'center',
        marginTop: Platform.OS === 'ios' ? 20 : 10,
    },
    header: {
        flex: 1,
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
        paddingVertical: 30,
        paddingHorizontal: 30
    },
    button: {
        flexDirection: "row",
        marginTop: Platform.OS === 'ios' ? 0 : 20,
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
