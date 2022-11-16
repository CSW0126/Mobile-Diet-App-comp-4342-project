import React from 'react'
import {
    View,
    Text,
    BackHandler,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    ScrollView
} from 'react-native'
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
// import { SocialIcon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, Url } from '../../constants/Theme';
import { GlobalVariables } from '../../constants/Index';
import { AuthContext } from '../../components/AuthContext';
import UserHelper from '../../helper/UserHelper';

export default function SignUp({navigation}) {
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
    

    const { signUp } = React.useContext(AuthContext)
    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirmPassword: '',
        check_textInputChange: false,
        secureTextEntry: true,
        checkPassIcon: false,
        isValidUsername: true,
        isValidPassword: true,
        isSignUpError: false,
    })
    const [isSignUpSucces, setIsSignUpSuccess] = React.useState(true)
    const [isDisableButton, setIsDisableButton] = React.useState(false)

    //username handler (on change)
    const textInputChange = (val) => {
        setIsSignUpSuccess(true)
        if (val.length != 0 && val.length >=4) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUsername: true
            })
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUsername: false
            })
        }
    }

    //password handler
    const handlePasswordChange = (val) => {

        if (val.trim().length >= 4 && val == data.confirmPassword) {
            setData({
                ...data,
                password: val,
                checkPassIcon: true,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                checkPassIcon: false
            });
        }
    }

    //confirm password
    const handleConfirmPasswordChange = (val) => {
        if (val.trim().length >= 3 && val == data.password) {
            setData({
                ...data,
                confirmPassword: val,
                checkPassIcon: true,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                confirmPassword: val,
                checkPassIcon: false
            });
        }

    }

    //eye icon click
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        })
    }

    //signUp click
    const signUpHandle = async () => {
        console.log("SignUp click")
        setIsDisableButton(true)
        if (data.checkPassIcon && data.isValidUsername) {
            setData({
                ...data,
                isValidPassword: true,
                isValidUsername: true
            })
            let userData = {
                username: data.username,
                password: data.password
            }
            let resp = await UserHelper.AsyncCreateUser(userData)
            if (resp.status == 'success') {
                console.log(resp.user)
                console.log("Token:"+resp.token)
                let loginUser = resp.user;
                let userToken = resp.token;
                await AsyncStorage.setItem('userToken', userToken);
                GlobalVariables.loginUser = loginUser
                setIsSignUpSuccess(true)
                signUp(userToken, loginUser);
            } else {
                //if fail
                setIsSignUpSuccess(false)
                setIsDisableButton(false)
                console.log(resp)
            }
        } else {
            setIsDisableButton(false)
            setData({
                ...data,
                isValidPassword: false,
                isValidUsername: false
            })
        }

    }

    return (
        <ScrollView keyboardDismissMode='interactive'   contentContainerStyle={{
            flex: 1
         }}>
            <View style={styles.container} >
                <StatusBar backgroundColor={COLORS.quaternary} barStyle="light-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>Welcome to Sign Up</Text>
                </View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={styles.footer}

                >

                    <Text style={styles.text_footer}>Username</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color={COLORS.black}
                            size={20}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Min length: 4 "
                            autoCapitalize='none'
                            onChangeText={(val) => textInputChange(val)}
                        />
                        {data.check_textInputChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                    </View>
                    {data.isValidUsername ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}> Not a valid Username (Min length:4)</Text>
                        </Animatable.View>
                    }
                    {isSignUpSucces ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}> The Username has already exists</Text>
                        </Animatable.View>}
                    <Text style={[styles.text_footer, { marginTop: Platform.OS === 'ios' ? 35 : 25 }]}>Password</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="lock"
                            color={COLORS.black}
                            size={25}
                        />
                        <TextInput
                            style={styles.textInput}
                            secureTextEntry={data.secureTextEntry ? true : false}
                            placeholder="Your Password"
                            autoCapitalize='none'
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateSecureTextEntry}>
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color={COLORS.darkgray}
                                    size={20}
                                /> :
                                <Feather
                                    name="eye"
                                    color={COLORS.darkgray}
                                    size={20}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.text_footer, { marginTop: Platform.OS === 'ios' ? 35 : 25, }]}>Confirm Password</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="lock"
                            color={COLORS.black}
                            size={25}
                        />
                        <TextInput
                            style={styles.textInput}
                            secureTextEntry={data.secureTextEntry ? true : false}
                            placeholder="Confirm Your Password"
                            autoCapitalize='none'
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                        />
                        {data.checkPassIcon ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}

                    </View>
                    {data.isValidPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Should more than 3 characters and same with password!</Text>
                        </Animatable.View>
                    }

                    <View style={styles.button}>
                        <TouchableOpacity
                            disabled={isDisableButton}
                            style={styles.signIn}
                            onPress={() => { signUpHandle() }}
                        >
                            <LinearGradient
                                colors={['#F3B057', COLORS.quaternary]}
                                style={styles.signIn}

                            >
                                <Text style={[styles.textSign]}>Sign Up</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.text}
                        onPress={()=>navigation.navigate("SignIn")}
                    >
                        <Text style={styles.textOR}>Or Sign In</Text>
                    </TouchableOpacity>
                    <View style={styles.googleAndFbButtonView}>
                        {/* <TouchableOpacity
                            disabled={isDisableButton}>
                            <SocialIcon
                                raised={true}
                                type='facebook'
                                style={styles.btnFacebook}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={isDisableButton}>
                            <SocialIcon
                                raised={true}
                                type='google'
                                style={styles.btnGoogle}
                            />
                        </TouchableOpacity> */}
                    </View>
                </Animatable.View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    googleAndFbButtonView: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 50 : 10,
    },
    btnFacebook: {

    },
    btnGoogle: {

    },
    text: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 50 : 20,
    },
    textOR: {
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.quaternary
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 4,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 50 : 20,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white

    }
})
