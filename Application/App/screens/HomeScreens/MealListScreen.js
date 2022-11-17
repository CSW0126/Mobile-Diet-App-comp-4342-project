import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, LogBox, Platform, useColorScheme } from 'react-native'
import { COLORS, FONTS, GlobalVariables, ImgJson, SIZES } from '../../constants/Index'
import { Ionicons, Entypo, AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import UserHelper from '../../helper/UserHelper';
import { ScrollView } from 'react-native-gesture-handler';
import EatRecordHelper from '../../helper/EatRecordHelper';
import SwipeFoodList from '../../components/SwipeFoodList'
import Modal, {
    ModalContent,
    SlideAnimation
} from 'react-native-modals';
import Animated from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

export default function MealListScreen({ navigation }) {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    const calChartRef = useRef(null)
    const [calData, setCalData] = useState({
        cal: 0,
        calBudget: 0,
        fill: 0,
        duration: 1000,
        isOver: false

    })
    useEffect(() => {
        renderCalChart();
    }, [])

    useEffect(() => {
        const reload = navigation.addListener('focus', () => {
            renderCalChart();
        })
        return reload
    }, [navigation])

    useEffect(() => {
        calChartRef.current.reAnimate(0, calData.fill, calData.duration)
    }, [calData])

    const renderCalChart = () => {
        let mealObject = GlobalVariables.TargetEatRecord;
        //cal the budget
        let budget = 0;
        switch (GlobalVariables.selectedSlot) {
            case 'breakfast':
                budget = UserHelper.getBreakfastRecomCal()
                break;
            case 'lunch':
                budget = UserHelper.getLunchRecomCal()
                break;
            case 'dinner':
                budget = UserHelper.getDinnerRecomCal()
                break;
            case 'other':
                budget = UserHelper.getOtherRecomCal()
                break;
        }

        if (mealObject.food.length == 0) {
            setCalData({
                ...calData,
                cal: 0,
                calBudget: budget,
                fill: 0,
                isOver: false
            })
        } else {

            //cal total cal eaten
            let cal = EatRecordHelper.getMealCal()
            console.log(cal)
            //--------------TODO
            let isOver = false;

            let fill = ((cal / budget) * 100)

            if (fill > 100) {
                fill = 100
                isOver = true;
            }

            setCalData({
                ...calData,
                cal: cal,
                calBudget: budget,
                fill: fill,
                isOver: isOver
            })
        }
    }

    const addMoreClick = () => {
        console.log(GlobalVariables.mealListCase)
        switch (GlobalVariables.mealListCase) {
            case 'Home':
                foodImageDetection()
                break;
            case 'PredictScreen':
                navigation.goBack()
                break;
            case 'FoodInfo':
                navigation.pop(2)
                break;
        }
    }

    const foodImageDetection = () => {
        navigation.navigate("CameraScreen", { useGImgBase64: true })
    }

    const foodRecord = () => {
        navigation.navigate("AddManually")
    }
    return (
        // <SafeAreaView
        //     style={styles.container}
        // >

        <ScrollView
            style={{ marginTop: Platform.OS == 'ios' ? 50 : 0 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >


            {/* header */}
            <Animated.View style={{ flex: 1 }}>
                {/* header bar */}


                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{
                            width: 50,
                            paddingLeft: SIZES.padding * 2,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="black" style={{ alignSelf: 'center', paddingTop: 10 }} />
                    </TouchableOpacity>

                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                    </View>



                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 50 }}>
                    </View>
                </View>
                {/* cal chart */}
                <View
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    <AnimatedCircularProgress
                        ref={calChartRef}
                        //style={styles.graph}
                        size={200}
                        width={15}
                        rotation={0}
                        // duraton={bmr.duration}
                        duration={calData.duration}
                        backgroundWidth={10}
                        // fill={bmr.totalFill}
                        fill={calData.fill}
                        tintColor={calData.isOver ? '#FE3E3D' : "#ff971d"}
                        backgroundColor="#ffe8d6"
                    >
                        {
                            (fill) => (
                                <View
                                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{
                                        ...FONTS.h2
                                    }}>
                                        {/* {(fill / 100 * personalData.bmr).toFixed(2)} cals/Day */}
                                        {calData.isOver ?
                                            (fill / 100 * calData.cal).toFixed(2)
                                            :
                                            (fill / 100 * calData.calBudget).toFixed(2)
                                        }
                                    </Text>
                                    <Text style={{ ...FONTS.body2 }}>
                                        cals
                                    </Text>
                                    {
                                        calData.isOver ?
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <FontAwesome name="fire" size={24} color="#FE3E3D" />
                                                <Text style={{ ...FONTS.body3, color: "#FE3E3D" }}>
                                                    {" "}Over Budget!
                                            </Text>
                                            </View>

                                            : null
                                    }
                                </View>
                            )
                        }
                    </AnimatedCircularProgress>
                </View>
                {/* slot name ,recomm text */}
                <View style={{}}>
                    <Text
                        style={{ textTransform: 'uppercase', ...FONTS.h2, paddingLeft: 10, color: COLORS.darkgray }}
                    >{GlobalVariables.selectedSlot}</Text>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <Text style={{ textAlign: 'left', paddingLeft: 10, ...FONTS.body3, color: COLORS.darkgray, flex: 1 }}>
                            Recommendation cals :
                            </Text>
                        <Text
                            style={{ textAlign: 'right', paddingRight: 10, ...FONTS.body3, color: COLORS.darkgray, flex: 1 }}
                        >{calData.cal.toFixed(2)} / {calData.calBudget.toFixed(2)} cals</Text>
                    </View>


                </View>
            </Animated.View>
            {/* body */}
            <Animated.View style={{ flex: 2 }}>
                <View>
                    <TouchableOpacity
                        onPress={addMoreClick}
                    >
                        <View style={{ height: 50, marginHorizontal: 30, marginVertical: 30, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.Home }}>
                            <Text style={{ color: COLORS.Home2, ...FONTS.body2 }}>Add more</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                <SwipeFoodList
                    navigation={navigation}
                    onItemRemove={renderCalChart}

                />

            </Animated.View>
        </ScrollView>
        // </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text_modal: {
        textAlign: 'center',
        ...FONTS.body3,
        paddingHorizontal: 10
    },
    modal_btn: {
        // flex: 1,
        height: 50,
        flexDirection: 'row',
        width: '90%',
        marginTop: 20,
        borderRadius: 20,
        backgroundColor: 20,
        //paddingVertical: Platform.OS == 'ios' ? 0 : 10,
        justifyContent: 'center',
        alignItems: 'center'
    }

})
