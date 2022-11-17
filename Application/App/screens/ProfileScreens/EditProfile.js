import React, { useState, useEffect, useRef, forwardRef, createRef } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    StyleSheet,
    Platform,
    KeyboardAvoidingView
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS, GlobalVariables, Images } from '../../constants/Index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons, MaterialCommunityIcons, AntDesign, FontAwesome, FontAwesome5, Entypo } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import Modal, {
    ModalTitle,
    ModalContent,
    ModalFooter,
    ModalButton,
    SlideAnimation,
    ScaleAnimation,
    BottomModal,
    ModalPortal,
} from 'react-native-modals';
import { LinearGradient } from 'expo-linear-gradient';
import UserHelper from '../../helper/UserHelper';
import moment from 'moment'
import { Buffer } from 'buffer'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function EditProfile({ navigation }) {
    const [loginUser, setLoginUser] = useState(GlobalVariables.loginUser)
    const [modalState, setModalState] = useState({
        genderState: false,
        purposeState: false,
        dietTypeState: false,
        weightState: false,
        weightError: false,
        heightState: false,
        heightError: false,
        ageState: false
    })


    const [typeStr, setTypeStr] = useState(UserHelper.getTypeString())

    const [showType, setShowType] = useState(loginUser.purpose == 'Keep' ? false : true)

    const [tempData, setTempData] = useState({
        height: loginUser.height,
        weight: loginUser.weight

    })

    //gender handler
    const handleGenderChange = async (val) => {
        loginUser.gender = val
        try {
            let resp = await UserHelper.AsyncEditUser(await AsyncStorage.getItem("userToken"), loginUser)
            if (resp.status == 'success') {
                console.log("gender change to " + resp.user.gender)
                UserHelper.UpdateReference(resp.user)
            }
        } catch (e) {
            console.log(e)
        }

        setModalState({
            ...modalState,
            genderState: false,
        })
    }
    //end gender handler

    //height handler
    const handleHeightInput = (val) => {
        const numericRegex = /\d+\.?\d*/
        if (numericRegex.test(val)) {
            if (val < 50 || val > 299) {
                setModalState({
                    ...modalState,
                    heightError: true
                })
                setTempData({
                    ...tempData,
                    height: loginUser.height
                })
            } else {
                setModalState({
                    ...modalState,
                    heightError: false,
                })
                setTempData({
                    ...tempData,
                    height: val
                })
            }
        } else {
            setModalState({
                ...modalState,
                heightError: true
            })
            setTempData({
                ...tempData,
                height: loginUser.height
            })
        }
    }

    const handleHeightSave = async () => {
        if (!modalState.heightError && tempData.height >= 50 && tempData.height <= 299) {
            loginUser.height = tempData.height
            try {
                let resp = await UserHelper.AsyncEditUser(await AsyncStorage.getItem("userToken"), loginUser)
                if (resp.status == 'success') {
                    console.log("height change to  " + resp.user.height)
                    UserHelper.UpdateReference(resp.user)
                }
            } catch (e) {
                console.log(e)
            }
            setModalState({
                ...modalState,
                heightState: false
            })
        } else {
            setModalState({
                ...modalState,
                heightError: true,
            })
            setTempData({
                ...tempData,
                height: loginUser.height
            })
        }
    }
    //end height handler

    //Weight handler
    const handleWeightChange = (val) => {
        const numericRegex = /\d+\.?\d*/
        if (numericRegex.test(val)) {
            if (val < 10 || val > 700) {
                setModalState({
                    ...modalState,
                    weightError: true
                })
                setTempData({
                    ...tempData,
                    weight: loginUser.weight
                })
            } else {
                setModalState({
                    ...modalState,
                    weightError: false,
                })
                setTempData({
                    ...tempData,
                    weight: val
                })
            }
        } else {
            setModalState({
                ...modalState,
                weightError: true
            })
            setTempData({
                ...tempData,
                weight: loginUser.weight
            })
        }
    }

    const handleWeightSave = async () => {
        if (!modalState.weightError && tempData.weight >= 10 && tempData.weight <= 700) {
            loginUser.weight = tempData.weight
            try {
                let resp = await UserHelper.AsyncEditUser(await AsyncStorage.getItem("userToken"), loginUser)
                if (resp.status == 'success') {
                    console.log("weight change to  " + resp.user.weight)
                    UserHelper.UpdateReference(resp.user)
                }
            } catch (e) {
                console.log(e)
            }
            setModalState({
                ...modalState,
                weightState: false
            })
        } else {
            setModalState({
                ...modalState,
                weightError: true,
            })
            setTempData({
                ...tempData,
                weight: loginUser.weight
            })
        }
    }
    //end height handler

    //purpose handler
    const handlePurposeChange = async (val) => {
        let passChecking = false;

        switch (val) {
            case 'Keep':
                passChecking = true;
                loginUser.purpose = val
                setShowType(false)
                break;
            case 'Increase':
                passChecking = true;
                loginUser.purpose = val
                loginUser.plan = "1"
                setTypeStr(UserHelper.getTypeString())
                setShowType(true)
                break;
            case 'Lose':
                passChecking = true;
                loginUser.purpose = val
                loginUser.plan = "1"
                setTypeStr(UserHelper.getTypeString())
                setShowType(true)
                break;
        }

        if (passChecking) {
            try {
                let resp = await UserHelper.AsyncEditUser(await AsyncStorage.getItem("userToken"), loginUser)
                if (resp.status == 'success') {
                    console.log("purpose change to " + resp.user.purpose)
                    console.log("diet type change to " + resp.user.plan)
                    UserHelper.UpdateReference(resp.user)
                }
            } catch (e) {
                console.log(e)
            }
        }

        setModalState({
            ...modalState,
            purposeState: false
        })
    }
    //end purpose handler

    //handle type change
    const handleTypeChange = async (val) => {
        if (val == "1" || val == "2" || val == "3") {
            loginUser.targetRateType = val
            setTypeStr(UserHelper.getTypeString())
            try {
                let resp = await UserHelper.AsyncEditUser(await AsyncStorage.getItem("userToken"), loginUser)
                if (resp.status == 'success') {
                    console.log("diet type change to " + resp.user.plan)
                    UserHelper.UpdateReference(resp.user)
                }
            } catch (e) {
                console.log(e)
            }
        }

        setModalState({
            ...modalState,
            dietTypeState: false
        })
    }
    //end handle type change


    return (
        <ScrollView style={styles.container}>
            <View style={{ margin: 20 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>

                {/* gender */}
                <TouchableOpacity style={styles.action}
                    onPress={() => {
                        setModalState({
                            ...modalState,
                            genderState: true
                        })
                    }}
                >
                    <FontAwesome name="transgender" size={24} color="black" style={{ flex: 0.2 }} />
                    <Text style={{ fontSize: 18, flex: 1 }}>Gender</Text>
                    <Text style={{ fontSize: 18, flex: 1, textAlign: 'right', color: COLORS.darkgray }}>{loginUser.gender}</Text>
                </TouchableOpacity>

                <Modal
                    visible={modalState.genderState}
                    onTouchOutside={() => {
                        setModalState({
                            ...modalState,
                            genderState: false
                        });
                    }}
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                >
                    <ModalContent style={{ height: 250, width: 300 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[FONTS.h3, { flex: 1 }]}>Gender</Text>
                            <TouchableOpacity
                                style={{ flex: 1, width: '90%', marginTop: 20 }}
                                onPress={() => handleGenderChange("Male")}
                            >
                                <LinearGradient
                                    colors={[COLORS.primary2, COLORS.primary]}
                                    style={[styles.btn, { flexDirection: 'row' }]}
                                >
                                    <FontAwesome
                                        name="male"
                                        color={COLORS.black}
                                        size={18}
                                    />
                                    <Text>  Male</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, width: '90%', marginTop: 20 }}
                                onPress={() => handleGenderChange("Female")}
                            >
                                <LinearGradient
                                    colors={[COLORS.tertuary2, COLORS.tertiary]}
                                    style={[styles.btn, { flexDirection: 'row' }]}
                                >
                                    <FontAwesome
                                        name="female"
                                        color={COLORS.black}
                                        size={18}
                                    />
                                    <Text>  Female</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ModalContent>
                </Modal>
                {/* height */}
                <TouchableOpacity style={styles.action}
                    onPress={() => {
                        setModalState({
                            ...modalState,
                            heightState: true
                        })
                    }}
                >
                    <MaterialCommunityIcons name="human-male-height-variant" size={24} color="black" style={{ flex: 0.2 }} />

                    <Text style={{ fontSize: 18, flex: 1 }}>Height</Text>
                    <Text style={{ fontSize: 18, flex: 1, textAlign: 'right', color: COLORS.darkgray }}>{loginUser.height} cm</Text>
                </TouchableOpacity>
                <Modal
                    visible={modalState.heightState}
                    onTouchOutside={() => {
                        setModalState({
                            ...modalState,
                            heightState: false
                        });
                    }}
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                >

                    <ModalContent style={{ height: 200, width: 300 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[FONTS.h3, { flex: 1 }]}>Height</Text>
                            <TextInput
                                placeholder="Height (in cm)"
                                placeholderTextColor="#666666"
                                autoCorrect={false}
                                autoCapitalize='none'
                                onChangeText={(val) => handleHeightInput(val)}
                                keyboardType={'numeric'}
                                style={[
                                    styles.textInput,
                                    {
                                        color: COLORS.black,
                                        width: '100%',
                                        borderBottomColor: COLORS.darkgray,
                                        borderBottomWidth: 1
                                    },
                                ]}
                            />
                            {modalState.heightError ?
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={{ color: COLORS.red, fontSize: 10, marginTop: 10 }}>Should be in range 50 - 299 cm</Text>
                                </Animatable.View>
                                : null}

                            <TouchableOpacity
                                style={{ flex: 1, width: '90%', marginTop: 20 }}
                                onPress={handleHeightSave}
                            >
                                <LinearGradient
                                    colors={['#35cfe0', "#00BBF2"]}
                                    style={styles.btn}
                                >
                                    <Text>Save</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ModalContent>

                </Modal>
                {/* weight */}
                <TouchableOpacity style={styles.action}
                    onPress={() => {
                        setModalState({
                            ...modalState,
                            weightState: true
                        })
                    }}
                >

                    <FontAwesome5 name="weight" size={24} color="black" style={{ flex: 0.2 }} />
                    <Text style={{ fontSize: 18, flex: 1 }}>Weight</Text>
                    <Text style={{ fontSize: 18, flex: 1, textAlign: 'right', color: COLORS.darkgray }}>{loginUser.weight} kg</Text>
                </TouchableOpacity>
                <Modal
                    visible={modalState.weightState}
                    onTouchOutside={() => {
                        setModalState({
                            ...modalState,
                            weightState: false
                        });
                    }}
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                >

                    <ModalContent style={{ height: 200, width: 300 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[FONTS.h3, { flex: 1 }]}>Weight</Text>
                            <TextInput
                                placeholder="Weight (in kg)"
                                placeholderTextColor="#666666"
                                autoCorrect={false}
                                autoCapitalize='none'
                                onChangeText={(val) => handleWeightChange(val)}
                                keyboardType={'numeric'}
                                style={[
                                    styles.textInput,
                                    {
                                        color: COLORS.black,
                                        width: '100%',
                                        borderBottomColor: COLORS.darkgray,
                                        borderBottomWidth: 1
                                    },
                                ]}
                            />
                            {modalState.weightError ?
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={{ color: COLORS.red, fontSize: 10, marginTop: 10 }}>Should be in range 10 - 700 kg</Text>
                                </Animatable.View>
                                : null}

                            <TouchableOpacity
                                style={{ flex: 1, width: '90%', marginTop: 20 }}
                                onPress={handleWeightSave}
                            >
                                <LinearGradient
                                    colors={['#35cfe0', "#00BBF2"]}
                                    style={styles.btn}
                                >
                                    <Text>Save</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ModalContent>

                </Modal>

                {/* purpose */}
                <TouchableOpacity style={styles.action}
                    onPress={() => {
                        setModalState({
                            ...modalState,
                            purposeState: true
                        })
                    }}
                >
                    <FontAwesome name="transgender" size={24} color="black" style={{ flex: 0.2 }} />
                    <Text style={{ fontSize: 18, flex: 1 }}>Purpose</Text>
                    <Text style={{ fontSize: 18, flex: 1, textAlign: 'right', color: COLORS.darkgray }}>{loginUser.purpose}</Text>
                </TouchableOpacity>

                <Modal
                    visible={modalState.purposeState}
                    onTouchOutside={() => {
                        setModalState({
                            ...modalState,
                            purposeState: false
                        });
                    }}
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                >
                    <ModalContent style={{ height: 350, width: 300 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[FONTS.h3, { flex: 1 }]}>Purpose</Text>
                            <TouchableOpacity
                                style={{ flex: 1, width: '90%', marginTop: 20 }}
                                onPress={() => handlePurposeChange("Increase")}
                            >
                                <LinearGradient
                                    colors={[COLORS.primary2, COLORS.primary]}
                                    style={[styles.btn, { flexDirection: 'row' }]}
                                >
                                    <AntDesign name="arrowup" size={18} color="black" />
                                    <Text>  Increase Weight</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, width: '90%', marginTop: 20 }}
                                onPress={() => handlePurposeChange("Lose")}
                            >
                                <LinearGradient
                                    colors={[COLORS.secondary, COLORS.blue]}
                                    style={[styles.btn, { flexDirection: 'row' }]}
                                >
                                    <AntDesign name="arrowdown" size={18} color="black" />
                                    <Text>  Lose Weight</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, width: '90%', marginTop: 20 }}
                                onPress={() => handlePurposeChange("Keep")}
                            >
                                <LinearGradient
                                    colors={[COLORS.tertuary2, COLORS.tertiary]}
                                    style={[styles.btn, { flexDirection: 'row' }]}
                                >
                                    <Entypo name="line-graph" size={18} color="black" />
                                    <Text>  Keep Weight</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ModalContent>
                </Modal>
                {/* targetType */}
                {showType ?
                    <TouchableOpacity style={styles.action}
                        onPress={() => {
                            setModalState({
                                ...modalState,
                                dietTypeState: true
                            })
                        }}
                    >
                        <FontAwesome name="transgender" size={24} color="black" style={{ flex: 0.2 }} />
                        <Text style={{ fontSize: 18, flex: 0.5 }}>Diet Type</Text>
                        <Text style={{ fontSize: 18, flex: 1.5, textAlign: 'right', color: COLORS.darkgray }}>{typeStr}</Text>
                    </TouchableOpacity>
                    : null}

                <Modal
                    visible={modalState.dietTypeState}
                    onTouchOutside={() => {
                        setModalState({
                            ...modalState,
                            dietTypeState: false
                        });
                    }}
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                >
                    <ModalContent style={{ height: 350, width: 300 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[FONTS.h3, { flex: 1 }]}>Diet Type</Text>
                            <TouchableOpacity
                                style={{ flex: 1, width: '90%', marginTop: 20 }}
                                onPress={() => handleTypeChange("1")}
                            >
                                <LinearGradient
                                    colors={[COLORS.primary2, COLORS.primary]}
                                    style={[styles.btn, { flexDirection: 'row' }]}
                                >
                                    {loginUser.purpose == 'Increase' ? <AntDesign name="arrowup" size={18} color="black" /> : <AntDesign name="arrowdown" size={18} color="black" />}
                                    <Text>  0.25 kg / week</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, width: '90%', marginTop: 20 }}
                                onPress={() => handleTypeChange("2")}
                            >
                                <LinearGradient
                                    colors={[COLORS.secondary, COLORS.blue]}
                                    style={[styles.btn, { flexDirection: 'row' }]}
                                >
                                    {loginUser.purpose == 'Increase' ? <AntDesign name="arrowup" size={18} color="black" /> : <AntDesign name="arrowdown" size={18} color="black" />}
                                    <Text>  0.5 kg / week</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, width: '90%', marginTop: 20 }}
                                onPress={() => handleTypeChange("3")}
                            >
                                <LinearGradient
                                    colors={[COLORS.tertuary2, COLORS.tertiary]}
                                    style={[styles.btn, { flexDirection: 'row' }]}
                                >
                                    {loginUser.purpose == 'Increase' ? <AntDesign name="arrowup" size={18} color="black" /> : <AntDesign name="arrowdown" size={18} color="black" />}
                                    <Text>  1 kg / week</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ModalContent>
                </Modal>
            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    btn: {
        width: '100%',
        height: Platform.OS == 'ios' ? 40 : 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Platform.OS == 'ios' ? 20 : 30,
    },
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 25 : 0
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        //marginTop: Platform.OS === 'ios' ? 0 : -4,
        paddingLeft: 10,
    },
})
