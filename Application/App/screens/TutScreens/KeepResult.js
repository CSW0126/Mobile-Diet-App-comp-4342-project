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
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { AuthContext } from '../../components/AuthContext';
import { COLORS, GlobalVariables, ImgJson } from '../../constants/Index';
import UserHelper from '../../helper/UserHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function KeepResult({ navigation }) {
    const { TUT } = React.useContext(AuthContext)
    const [bmr, setBmr] = React.useState(UserHelper.CalBmr())
    const [isButtonDisable, setIsButtonDisable] = React.useState(false);

    const onFinishPress = async () => {
        console.log("finish press")
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

    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1
            }}>
        
            <View style={styles.container}>
                <StatusBar backgroundColor={COLORS.tertiary} barStyle="light-content" />
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
                    <Text style={styles.text_2}>In order to Keep weight, You should absorb</Text>
                    <AnimatedCircularProgress
                        style={styles.progess}
                        size={Platform.OS === 'ios' ? 200 : 150}
                        width={15}
                        fill={100}
                        tintColor={COLORS.quaternary}
                        duration={2000}
                        onAnimationComplete={() => console.log('')}
                        backgroundColor={COLORS.darkgray}
                        arcSweepAngle={240}
                        rotation={240}
                        lineCap="round"
                    >
                        {
                            (fill) => (
                                <Text style={styles.text_3}>
                                    {(fill / 100 * bmr).toFixed(2)} Kcal/Day
                                </Text>
                            )
                        }

                    </AnimatedCircularProgress>

                    <View style={styles.button}>
                        <TouchableOpacity
                            disabled={isButtonDisable}
                            style={styles.btnNext}
                            onPress={onFinishPress}
                        >
                            <LinearGradient
                                colors={[COLORS.tertuary2, COLORS.tertiary]}
                                style={styles.btnNext}
                            >
                                <Text style={[styles.btnText]}>Finish</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    progess: {
        alignSelf: 'center',
        marginTop: Platform.OS === 'ios' ? 25 : 20,
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
        backgroundColor: COLORS.tertiary,
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
        marginTop: Platform.OS === 'ios' ? 30 : 20,
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
