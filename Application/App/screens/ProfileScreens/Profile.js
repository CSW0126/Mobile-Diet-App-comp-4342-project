
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { View, SafeAreaView, StyleSheet, BackHandler, Platform, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SimpleLineIcons, Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons, AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
} from 'react-native-paper';

import * as Animatable from 'react-native-animatable';
import { COLORS, GlobalVariables, Images, FONTS, SIZES } from '../../constants/Index';
import UserHelper from '../../helper/UserHelper';
import { AuthContext } from '../../components/AuthContext';
import Modal, {
    ModalContent,
    SlideAnimation,
} from 'react-native-modals';

export default function Profile({ navigation }) {

    const [loginUser, setLoginUser] = useState(GlobalVariables.loginUser)
    const [data, setData] = useState({
        username: loginUser.username,
        purpose: loginUser.purpose,
        dietType: UserHelper.getTypeString(),
        weight: loginUser.weight,
        height: loginUser.height,
        bmr: UserHelper.CalBmr(),
        bmi: UserHelper.getBMI(),
        age: loginUser.age,
        gender: loginUser.gender,
    })

    const { signOut } = React.useContext(AuthContext)
    const [showModal, setShowModal] = useState(false)

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

    //reload when navigation change
    useEffect(() => {
        const reload = navigation.addListener('focus', () => {
            setData({
                ...data,
                username: loginUser.username,
                purpose: loginUser.purpose,
                dietType: UserHelper.getTypeString(),
                weight: loginUser.weight,
                height: loginUser.height,
                bmr: UserHelper.CalBmr(),
                bmi: UserHelper.getBMI(),
                age: loginUser.age,
                gender: loginUser.gender
            })
        })
        return reload
    }, [navigation])

    const handleSignOut = () => {
        setShowModal(false)
        signOut()
    }

    return (
        <ScrollView style={styles.container}>

            <Animatable.View
                // animation={isReload ? undefined : "fadeInDown"}
                animation="fadeInDown"
                style={styles.header}>
                <View style={styles.userInfoSection}>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Avatar.Image
                            style={{ backgroundColor: COLORS.white }}
                            source={data.iconExists ? { uri: 'data:image/jpeg;base64,' + GlobalVariables.iconBin } : Images.logo}
                            size={80}
                        />
                        <View style={{ marginLeft: 70 }}>
                            <Title style={[styles.title, {
                                marginTop: 30,
                                marginBottom: 5,
                            }]}>{data.username}</Title>
                        </View>
                    </View>
                </View>
                <View style={styles.userInfoSection}>
                    <View style={styles.row}>
                        <SimpleLineIcons name="target" size={20} color="#777777" />
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 0.5 }}>Purpose</Text>
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 1 }}>: {data.purpose}</Text>
                    </View>
                    {loginUser.purpose == 'Keep' ? null :
                        <View style={styles.row}>
                            <Feather name="type" size={20} color="#777777" />
                            <Text style={{ color: "#777777", marginLeft: 20, flex: 0.5 }}>Diet Type</Text>
                            <Text style={{ color: "#777777", marginLeft: 20, flex: 1 }}>: {data.dietType}</Text>
                        </View>
                    }

                    <View style={styles.row}>
                        <MaterialIcons name="admin-panel-settings" size={20} color="#777777" />
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 0.5 }}>Role</Text>
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 1 }}>: Normal User</Text>
                    </View>

                    {/* <View style={styles.row}>
                        <Icon name="email" color="#777777" size={20} />
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 0.5 }}>Email</Text>
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 1 }}>: {data.email}</Text>
                    </View> */}

                    <View style={styles.row}>
                        <FontAwesome5 name="weight" size={20} color="#777777" />
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 0.5 }}>Weight</Text>
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 1 }}>: {data.weight} kg</Text>
                    </View>

                    <View style={styles.row}>
                        <MaterialCommunityIcons name="human-male-height-variant" size={20} color="#777777" />
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 0.5 }}>Height</Text>
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 1 }}>: {data.height} cm</Text>
                    </View>

                    <View style={styles.row}>
                        <AntDesign name="calendar" size={20} color="#777777" />
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 0.5 }}>Age</Text>
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 1 }}>: {data.age}</Text>
                    </View>
                    <View style={styles.row}>
                        <FontAwesome name="transgender" size={20} color="#777777" />
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 0.5 }}>Gender</Text>
                        <Text style={{ color: "#777777", marginLeft: 20, flex: 1 }}>: {data.gender}</Text>
                    </View>
                </View>
            </Animatable.View>


            <Animatable.View
                // animation={isReload ? undefined : "fadeInUp"}
                animation="fadeInUp"
                style={styles.footer}>
                <View style={styles.infoBoxWrapper}>
                    <View style={[styles.infoBox, {
                        borderRightColor: '#dddddd',
                        borderRightWidth: 1
                    }]}>
                        <Title>{data.bmr} Kcal</Title>
                        <Caption>Calories Budget</Caption>
                    </View>
                    <View style={styles.infoBox}>
                        <Title>{data.bmi}</Title>
                        <Caption>BMI</Caption>
                    </View>
                </View>
                <View style={styles.menuWrapper}>
                    <TouchableRipple onPress={() => { navigation.navigate("EditProfile") }}>
                        <View style={styles.menuItem}>
                            <AntDesign name="edit" size={25} color={COLORS.darkgray} />
                            <Text style={styles.menuItemText}>Edit Profile</Text>
                        </View>
                    </TouchableRipple>

                    <TouchableRipple onPress={() => { navigation.navigate("Report") }}>
                        <View style={styles.menuItem}>
                            <AntDesign name="barschart" size={25} color={COLORS.darkgray} />
                            <Text style={[styles.menuItemText, { paddingTop: 2 }]}>Diet Report</Text>
                        </View>
                    </TouchableRipple>


                    <TouchableRipple onPress={() => setShowModal(true)}>
                        <View style={styles.menuItem}>
                            <SimpleLineIcons name="logout" size={25} color={COLORS.darkgray} />
                            <Text style={[styles.menuItemText, { paddingTop: 2 }]}>Logout</Text>
                        </View>
                    </TouchableRipple>
                </View>

                <Modal
                    visible={showModal}
                    onTouchOutside={() => {
                        setShowModal(false)
                    }}
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                >

                    <ModalContent style={{ height: 200, width: 300 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[{ ...FONTS.h3, flex: 1 }]}>Are You Sure to Logout?</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: "#EC3C3D" }]}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={styles.btnText}>No</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: COLORS.lightGreen }]}
                                onPress={handleSignOut}
                            >
                                <Text style={styles.btnText}>Yes</Text>
                            </TouchableOpacity>
                        </View>

                    </ModalContent>

                </Modal>

            </Animatable.View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    btnText: {
        ...FONTS.body3,
        fontWeight: 'bold',
        color: COLORS.white
    },
    btn: {
        height: 50,
        width: SIZES.width * 0.3,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 80 : 0
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoBoxWrapper: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 100,
    },
    infoBox: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuWrapper: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    menuItemText: {
        color: '#777777',
        marginLeft: 20,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 26,
    },
})
