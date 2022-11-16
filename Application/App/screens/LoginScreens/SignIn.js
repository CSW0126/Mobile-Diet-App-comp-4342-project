import React, { useReducer } from 'react'
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
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, GlobalVariables, Images, FONTS, SIZES } from '../../constants/Index';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../../components/AuthContext';
// import { AuthContext } from '../../components/AuthContext'
import UserHelper from '../../helper/UserHelper'

export default function SignIn({ navigation }) {
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
    
    const { signIn } = React.useContext(AuthContext)

    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirmPassword: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUsername: true,
        isValidPassword: true,
        isSignInError: false,
    })
    const [isDisableButton, setIsDisableButton] = React.useState(false)

    //username handler onchange
    const textInputChange = (val) => {
        if (val.length) {
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

    //on end
    const handleValidUsername = (val) => {
        if (val.length >= 4) {
            setData({
                ...data,
                isValidUsername: true
            })
        } else {
            setData({
                ...data,
                isValidUsername: false
            })
        }
    }

    //password handler
    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val,
            checkPassIcon: data.password >= 6 && data.password == data.confirmPassword ? true : false
        });
    }

    //eye icon click
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        })
    }

    //sign in click
    const loginHandle = async (username, pwd) => {
        console.log("SignIn Click")
        console.log(username)
        console.log(pwd)
        let userToken = null;
        let foundUser = false;
        let loginUser;
        login_data = {
            username: username,
            password: pwd
        }
        setIsDisableButton(true)
        let resp = await UserHelper.AsyncLogin(login_data);
        if (resp.status == 'success') {
            try {
                loginUser = resp.user;
                console.log(resp.user)
                //TODO suspend check
                userToken = resp.token;
                await AsyncStorage.setItem('userToken', userToken);
                GlobalVariables.loginUser = loginUser
                foundUser = true;
            } catch (e) {
                console.log(e);
                userToken = null;
                foundUser = false;
            }
        }
        if (foundUser) {
            setData({
                ...data,
                isSignInError: false
            })
            signIn(userToken, loginUser)
        } else {
            setData({
                ...data,
                isSignInError: true
            })
            setIsDisableButton(false)
        }
    }
    return (
        <ScrollView keyboardDismissMode='interactive'   contentContainerStyle={{
            flex: 1
         }}>
            <View style={styles.container}>
                <StatusBar backgroundColor={COLORS.tertiary} barStyle="light-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>Sign In!</Text>
                </View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={styles.footer}

                >
                    {/* username text */}
                    <Text style={styles.text_footer}>Username</Text>

                    {/* username input */}
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color={COLORS.black}
                            size={20}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="..."
                            autoCapitalize='none'
                            onChangeText={(val) => textInputChange(val)}
                            onEndEditing={(e) => handleValidUsername(e.nativeEvent.text)}
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
                    
                    {/* username validation text */}
                    {/* {data.isValidUsername ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}></Text>
                        </Animatable.View>
                    } */}

                    {/* Password text */}
                    <Text style={[styles.text_footer, { marginTop: Platform.OS === 'ios' ? 35 : 25 }]}>Password</Text>

                    {/* Password input */}
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

                    {/* Sign in button */}
                    <View style={styles.button}>
                        <TouchableOpacity
                            disabled={isDisableButton}
                            style={styles.signIn}
                            onPress={() => { loginHandle(data.username, data.password) }}
                        >
                            <LinearGradient
                                colors={[COLORS.tertuary2, COLORS.tertiary]}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign]}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* User validation text */}
                    {data.isSignInError ?
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg2}>Login fail! Invalid Username or Password!</Text>
                        </Animatable.View>
                        : null
                    }
                    <TouchableOpacity style={styles.text}
                        onPress={()=>navigation.navigate("SignUp")}
                    >
                        <Text style={styles.textOR}>Or sign up</Text>
                    </TouchableOpacity>

                    <View style={styles.googleAndFbButtonView}>

                        {/* Facebook button */}
                        {/* <TouchableOpacity
                            disabled={false}
                            onPress={() => {navigation.push(`Sign in with Facebook`)}}
                            >
                            <SocialIcon
                                raised={true}
                                type='facebook'
                                style={styles.btnFacebook}
                            />
                        </TouchableOpacity> */}

                        {/* Google button */}
                        {/* <TouchableOpacity
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
        backgroundColor: COLORS.tertiary
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
    errorMsg2: {
        color: '#FF0000',
        fontSize: 14,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20
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

    },
    
})
