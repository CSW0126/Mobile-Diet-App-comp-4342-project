import React, { useState, useEffect, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, BackHandler, StatusBar, TouchableOpacity, Button, RefreshControl, Animated } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import moment from 'moment'
import { COLORS, GlobalVariables, Images, ImgJson } from '../../constants/Index';
import UserHelper from '../../helper/UserHelper';
import EatRecordHelper from '../../helper/EatRecordHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

LocaleConfig.locales['en'] = {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb.', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep.', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'],
    today: 'Today'
};
LocaleConfig.defaultLocale = 'en'

export default function Home({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDay, setSelectedDay] = useState(moment().format("YYYY-MM-DD"))
    const [show, setShow] = useState(false)
    const [bmr, setBmr] = useState({
        isOverBudget: false,
        totalbmr: 0,
        //eaten
        breakfastEaten: 0,
        lunchEaten: 0,
        dinnerEaten: 0,
        otherEaten: 0,
        totalEaten: 0,
        //remain 
        remain: 0,
        //fill
        leftFill: 0,
        totalFill: 100,
        eatenFill: 0,
    })

    const BudgetRef = useRef();
    const EatenRef = useRef();
    const LeftRef = useRef();
    const calHeightShowValue = new Animated.Value(0)
    const calHeightCloseVlaue = new Animated.Value(300)
    const HEADER_MAX_HEIGHT = 300;
    const HEADER_MIN_HEIGHT = 0;
    const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    useEffect(() => {
        Animated.timing(calHeightCloseVlaue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false
        }).start();

        //handleGlobalPlan()

        // console.log("BMR: " + UserHelper.CalBmr())
        // console.log("Bf: " + UserHelper.getBreakfastRecomCal())
        // console.log("LUN: " + UserHelper.getLunchRecomCal())
        // console.log("DIN: " + UserHelper.getDinnerRecomCal())
        // console.log("OTH: " + UserHelper.getOtherRecomCal())
        // console.log("AGE: " + UserHelper.getAge())
        // console.log("SELDAY: " + selectedDay)
    }, [])

    useEffect(() => {
        // console.log(" change", show)
        if (show) {
            Animated.timing(calHeightShowValue, {
                toValue: 300,
                duration: 300,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(calHeightCloseVlaue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
        }

    }, [show])

    useEffect(() => {
        console.log("-----------HOME----------")
        console.log("SELECT DATE: ", selectedDay)
        renderBMR();
    }, [selectedDay])

    useEffect(() => {
        LeftRef.current.reAnimate(0, bmr.leftFill, bmr.duration);
        BudgetRef.current.reAnimate(0, bmr.totalFill, bmr.duration)
        EatenRef.current.reAnimate(0, bmr.eatenFill, bmr.duration)
    }, [bmr])



    //---------------refresh ONLY IOS
    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        let resp = await UserHelper.AsyncUserToken(GlobalVariables.loginUser._id);
        if (resp.status == 'success') {
            GlobalVariables.loginUser = resp.user
            console.log("refresh user success")
            //refresh global plan
            //handleGlobalPlan();
            //refresh bmr
            renderBMR()

        } else {
            console.log(resp)
        }
        wait(500).then(() => {
            setRefreshing(false)
        });
    }, []);
    //---------------end refresh

    useEffect(() => {
        const reload = navigation.addListener('focus', () => {
            renderBMR()
        })
        return reload
    }, [navigation])


    //---------------process or update bmr value
    const renderBMR = () => {
        try {
            let dayMeal = EatRecordHelper.getEatRecordByDay(selectedDay)
            if (dayMeal != null) {
                let breakfast = EatRecordHelper.getRecordByDaySlot(selectedDay, 'breakfast')
                let lunch = EatRecordHelper.getRecordByDaySlot(selectedDay, 'lunch')
                let dinner = EatRecordHelper.getRecordByDaySlot(selectedDay, 'dinner')
                let other = EatRecordHelper.getRecordByDaySlot(selectedDay, 'other')

                let bfCal = EatRecordHelper.getMealSlotCal(breakfast)
                let luCal = EatRecordHelper.getMealSlotCal(lunch)
                let diCal = EatRecordHelper.getMealSlotCal(dinner)
                let otCal = EatRecordHelper.getMealSlotCal(other);

                // let bfCal = 0;
                // let luCal = 0;
                // let diCal = 0;
                // let otCal = 0
                console.log("----------HOME----------")
                console.log("Breakfast, lunch, dinner, other")
                console.log(bfCal, "   ", luCal, "   ", diCal, "      ", otCal)


                let isOver = false;
                let bmrValue = UserHelper.CalBmr()
                let totalEaten = bfCal + luCal + diCal + otCal
                //console.log(totalEaten)
                let remainCal = (bmrValue - totalEaten)
                if (remainCal < 0) {
                    isOver = true
                    remainCal = Math.abs(remainCal)
                }

                let ef = (bmrValue - remainCal) / bmrValue * 100  //eaten fill
                //console.log(ef)
                let lf = (remainCal / bmrValue) * 100             //left fill

                if (ef < 0 || ef > 100) {
                    ef = 100
                }

                if (lf < 0 || lf > 100) {
                    lf = 100
                }

                if (isOver) {
                    ef = 100;
                    lf = 100;
                }

                setBmr({
                    ...bmr,
                    isOverBudget: isOver,
                    totalbmr: bmrValue,
                    //eaten
                    breakfastEaten: bfCal,
                    lunchEaten: luCal,
                    dinnerEaten: diCal,
                    otherEaten: otCal,
                    totalEaten: totalEaten,
                    //remain 
                    remain: remainCal,
                    //fill
                    leftFill: lf,
                    eatenFill: ef,
                })

            } else {
                let bmrValue = UserHelper.CalBmr()
                let eaten = 0;
                let remain = bmrValue - eaten
                setBmr({
                    ...bmr,
                    isOverBudget: false,
                    totalbmr: bmrValue,

                    breakfastEaten: 0,
                    lunchEaten: 0,
                    dinnerEaten: 0,
                    otherEaten: 0,
                    totalEaten: eaten,

                    remain: remain,


                    leftFill: 100,
                    eatenFill: 0
                })
            }
        } catch (e) {
            console.log(e)
        }
    }
    //---------------end process bmr value

    //---------------day press
    // < press
    const handlePrevDayPress = () => {
        let prevDay = moment(selectedDay).subtract(1, 'day').format("YYYY-MM-DD")
        setSelectedDay(prevDay);
    }

    //Today button
    const calButtonPress = () => {
        setShow(!show)
    }

    // > press
    const handleNextDayPress = () => {
        let nextDay = moment(selectedDay).add(1, 'day').format("YYYY-MM-DD")
        setSelectedDay(nextDay)

    }

    //day in calerdar press
    const handleDayPress = (day) => {
        let selDay = moment(day.dateString).format("YYYY-MM-DD")
        setSelectedDay(selDay)
        //setShow(false);

        //setShow(false)

    }
    //---------------end day press

    //---------------card button press
    const onCamPress = async (slot) => {
        //console.log(GlobalVariables.loginUser)
        console.log(slot + " onCamPress")
        let pass = await setMeal(slot)

        if (pass) {
        //     // GlobalVariables.mealObject.name = slot
        //     // console.log(GlobalVariables.loginUser.personal.eatRecord)
            GlobalVariables.selectedSlot = slot
            GlobalVariables.selectedDate = selectedDay
            navigation.navigate("CameraScreen", { useGImgBase64: true })
        }

    }

    const onListPress = async (slot) => {
        console.log(slot +" onListPress")
        // GlobalVariables.selectedSlot = slot
        // GlobalVariables.mealListCase = "Home"
        // GlobalVariables.selectedDate = selectedDay
        // let pass = await setMeal(slot)

        // if (pass) {
        //     navigation.navigate("MealListScreen")
        // }

    }

    const setMeal = async (slot) => {
        let pass = false;

        let eatRecord = EatRecordHelper.getRecordByDaySlot(selectedDay, slot)
        console.log("eatRecord")
        console.log(eatRecord)
        //if found, store to global
        if (eatRecord) {
            GlobalVariables.TargetEatRecord = eatRecord
            pass = true
        } else {
            //create new record_obj
            console.log("------------Dashboard-----------------")
            console.log("No record_obj found in " + selectedDay)
            let record_obj = EatRecordHelper.createEatRecordByDateSlot(selectedDay, slot)
            try {
                console.log("before update")
                console.log(GlobalVariables.loginUser)
                let resp = await UserHelper.AsyncEditUser(await AsyncStorage.getItem("userToken"), GlobalVariables.loginUser)
                if (resp.status == 'success') {
                    GlobalVariables.loginUser = resp.user
                    record_obj = EatRecordHelper.getRecordByDaySlot(selectedDay, slot)
                    if (record_obj){
                        GlobalVariables.TargetEatRecord = record_obj
                        console.log("after")
                        console.log(GlobalVariables.loginUser )
                    }else{
                        console.log("record_obj update error !")
                    }
                    //if exists
                    if (GlobalVariables.TargetEatRecord) {
                        pass = true
                    }
                } else {
                    throw resp.message
                }
            } catch (e) {
                console.log(e)
            }
        }

        return pass;
    }
    //---------------end card button press

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <Animated.View
                style={show ? [styles.cal, { height: calHeightShowValue }] : [styles.cal, { height: calHeightCloseVlaue }]}>
                <Calendar
                    onDayPress={(day) => handleDayPress(day)}
                />
            </Animated.View>
            <ScrollView
                style={{ backgroundColor: COLORS.white }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {/* {show ?
                    <Animatable.View
                        animation='fadeInDown'
                        style={styles.cal}>
                        <Calendar
                            onDayPress={(day) => handleDayPress(day)}
                        />
                    </Animatable.View>
                    : null} */}

                <View style={styles.buttonTop}>

                    <TouchableOpacity
                        style={[styles.dayRow, { flex: 1 }]}
                        onPress={handlePrevDayPress}
                    >
                        <LinearGradient
                            colors={[COLORS.Home, COLORS.Home]}
                            style={styles.dayRow}
                        >
                            <Text style={[styles.btnTopText]}>{"<"}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dayRow, { flex: 2 }]}
                        onPress={calButtonPress}
                    >
                        <LinearGradient
                            colors={[COLORS.Home, COLORS.Home]}
                            style={styles.dayRow}
                        >
                            <Text style={[styles.btnTopText]}>{moment().format("YYYY-MM-DD") == selectedDay ? "Today" : selectedDay}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.dayRow, { flex: 1 }]}
                        onPress={handleNextDayPress}
                    >
                        <LinearGradient
                            colors={[COLORS.Home, COLORS.Home]}
                            style={styles.dayRow}
                        >
                            <Text style={[styles.btnTopText]}>{">"}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>


                <View
                    style={styles.headerBox}>
                    {/* <View style={styles.headerboxText}>

                        <Animatable.Image
                            animation="bounceIn"
                            duraton="1500"
                            source={Images.logo}
                            style={styles.logo}
                            resizeMode="stretch"
                        />
                        <Animatable.Text
                            animation="bounceIn"
                            duraton="1500"
                            resizeMode="stretch"
                            style={styles.textTitle}
                        >C<Animatable.Text
                            animation="bounceIn"
                            duraton="1500"
                            resizeMode="stretch"
                            style={styles.textTitle2}
                        >alorist</Animatable.Text></Animatable.Text>
                    </View> */}
                    <View style={styles.cardBoxChart}>

                        <View style={styles.midCol}>
                            <AnimatedCircularProgress
                                ref={LeftRef}
                                style={styles.graph}
                                size={200}
                                width={15}
                                // duraton={bmr.duration}
                                duration={bmr.duration}
                                backgroundWidth={20}
                                // fill={bmr.leftFill}
                                fill={bmr.leftFill}
                                // tintColor="#31C8D6"
                                tintColor={bmr.isOverBudget ? "#B91D47" : "#31C8D6"}
                                backgroundColor="#F6F8F9"
                                arcSweepAngle={240}
                                rotation={240}
                                lineCap="round"
                            >
                                {
                                    (fill) => (
                                        <Text style={styles.text_3}>
                                            {/* {(fill / 100 * personalData.bmr).toFixed(2)} cals/Day */}
                                            {bmr.isOverBudget ?
                                                (fill / 100 * Math.abs(bmr.totalbmr - bmr.totalEaten)).toFixed(2) + "\n cals Over"
                                                :
                                                (fill / 100 * bmr.totalbmr).toFixed(2) + "\n cals Left"}
                                        </Text>

                                    )
                                }
                            </AnimatedCircularProgress>
                        </View>
                        <View style={styles.firstCol}>

                            <AnimatedCircularProgress
                                ref={BudgetRef}
                                style={styles.graph}
                                size={100}
                                width={5}
                                // duraton={bmr.duration}
                                duration={bmr.duration}
                                backgroundWidth={5}
                                // fill={bmr.totalFill}
                                fill={bmr.totalFill}
                                tintColor={COLORS.Recipe2}
                                backgroundColor="#F6F8F9"
                                arcSweepAngle={240}
                                rotation={240}
                                lineCap="round"
                            >
                                {
                                    (fill) => (
                                        <Text style={styles.text_5}>
                                            {/* {(fill / 100 * personalData.bmr).toFixed(2)} cals/Day */}
                                            Total Budget{"\n"}{(fill / 100 * bmr.totalbmr).toFixed(2)}
                                        </Text>

                                    )
                                }
                            </AnimatedCircularProgress>
                            <AnimatedCircularProgress
                                ref={EatenRef}
                                style={styles.graph}
                                size={100}
                                width={5}
                                duration={bmr.duration}
                                backgroundWidth={5}
                                // fill={bmr.eatenFill}
                                fill={bmr.eatenFill}
                                tintColor={COLORS.Social2}
                                backgroundColor="#F6F8F9"
                                arcSweepAngle={240}
                                rotation={240}
                                lineCap="round"
                            >
                                {
                                    (fill) => (
                                        <Text style={styles.text_5}>
                                            {/* {(fill / 100 * personalData.bmr).toFixed(2)} cals/Day */}
                                            Eaten {"\n"}
                                            {bmr.isOverBudget ?
                                                (fill / 100 * bmr.totalEaten).toFixed(2)
                                                :
                                                (fill / 100 * bmr.totalbmr).toFixed(2)}
                                        </Text>

                                    )
                                }
                            </AnimatedCircularProgress>
                            {/* <Text style={styles.text_2}><Text style={styles.text_1}>Total</Text> <Text style={styles.text_4}>{"\n"}{1234}cals</Text></Text>
                        <Text style={styles.text_2}><Text style={styles.text_1}>Eaten</Text> <Text style={styles.text_4}>{"\n"}{1234}cals</Text></Text> */}
                        </View>
                    </View>
                </View>
                <View
                    style={styles.footer}>

                    <View style={styles.cardBox}>
                        <View style={styles.item1}>
                            <LottieView
                                autoPlay loop
                                source={ImgJson.cake}
                            // style={styles.item}
                            />
                        </View>

                        <View style={styles.item2}>
                            <Text style={styles.text_1}>Breakfast</Text>
                            <Text style={styles.text_2}>Recommend{" "}
                                {/* {bmr.breakfastEaten.toFixed(0)} / {(UserHelper.getBreakfastRecomCal()).toFixed(0)} */}
                                {bmr.breakfastEaten.toFixed(0)} / {(UserHelper.getBreakfastRecomCal()).toFixed(0)}
                                {" "}cals</Text>
                        </View>
                        <View style={styles.item3}>
                            <TouchableOpacity
                                onPress={() => onCamPress('breakfast')}>
                                <MaterialCommunityIcons name="magnify-scan" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onListPress('breakfast')}
                            >
                                <Feather name="list" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.cardBox}>
                        <View style={styles.item1}>
                            <LottieView
                                autoPlay loop
                                source={ImgJson.pizza}
                            // style={styles.item}
                            />
                        </View>

                        <View style={styles.item2}>
                            <Text style={styles.text_1}>Lunch</Text>
                            <Text style={styles.text_2}>Recommend{" "}
                                {bmr.lunchEaten.toFixed(0)} / {(UserHelper.getLunchRecomCal()).toFixed(0)}
                                {" "}cals</Text>
                        </View>
                        <View style={styles.item3}>
                            <TouchableOpacity
                                onPress={() => onCamPress('lunch')}
                            >
                                <MaterialCommunityIcons name="magnify-scan" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onListPress('lunch')}
                            >
                                <Feather name="list" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.cardBox}>
                        <View style={styles.item1}>
                            <LottieView
                                autoPlay loop
                                source={ImgJson.dinner}
                            // style={styles.item}
                            />
                        </View>

                        <View style={styles.item2}>
                            <Text style={styles.text_1}>Dinner</Text>
                            <Text style={styles.text_2}>Recommend{" "}
                                {bmr.dinnerEaten.toFixed(0)} / {(UserHelper.getDinnerRecomCal()).toFixed(0)}
                                {" "}cals</Text>
                        </View>
                        <View style={styles.item3}>
                            <TouchableOpacity
                                onPress={() => onCamPress('dinner')}
                            >
                                <MaterialCommunityIcons name="magnify-scan" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onListPress('dinner')}
                            >
                                <Feather name="list" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.cardBox}>
                        <View style={styles.item1}>
                            <LottieView
                                autoPlay loop
                                source={ImgJson.dessert}
                            // style={styles.item}
                            />
                        </View>

                        <View style={styles.item2}>
                            <Text style={styles.text_1}>Other</Text>
                            <Text style={styles.text_2}>Recommend{" "}
                                {bmr.otherEaten.toFixed(0)} / {(UserHelper.getOtherRecomCal()).toFixed(0)}
                                {" "}cals</Text>
                        </View>
                        <View style={styles.item3}>
                            <TouchableOpacity
                                onPress={() => onCamPress('other')}
                            >
                                <MaterialCommunityIcons name="magnify-scan" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onListPress('other')}
                            >
                                <Feather name="list" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 50,
        height: 50,
    },
    camera: {
        flex: 1,
    },
    headerBox: {
        flex: 2,
        flexDirection: 'column',
        marginTop: Platform.OS === "ios" ? 10 : 5,
        backgroundColor: COLORS.white,
        borderRadius: 50,
        marginBottom: Platform.OS === "ios" ? 10 : 5,
        // padding: 20,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    textTitle: {
        color: COLORS.primary,
        fontSize: 30,
        fontWeight: 'bold'
    },
    textTitle2: {
        color: COLORS.darkgray,
        marginTop: 30,
        fontSize: 30,
    },
    itemImg: {
        flex: 1,
        alignSelf: 'center'
    },
    item1: {
        flex: 1.2,

    },
    item2: {
        flex: 3,
        justifyContent: 'center',
    },
    item3: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    cardBox: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: COLORS.white,
        height: 90,
        elevation: 1,
        width: '95%',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    firstCol: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    text_1: {
        textAlign: 'left',
        fontSize: 18,
        fontWeight: 'bold'
    },
    text_2: {
        textAlignVertical: 'center',
        textAlign: 'left',
    },
    text_5: {
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    text_4: {
        paddingTop: 20
    },
    midCol: {
        marginTop: 5,
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    buttonTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 20 : 20,
    },
    graph: {
        // marginTop: Platform.OS === "ios" ? 30 : 0,
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 5
    },
    btnTopText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.Home2
    },
    cal: {
        marginTop: Platform.OS === "ios" ? 40 : 0,
    },
    dayRow: {
        width: '100%',
        marginHorizontal: 5,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        // paddingTop: Platform.OS === "ios" ? 20 : 0,
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        // marginTop: Platform.OS === "ios" ? 30 : 0,
        backgroundColor: COLORS.white,
        borderRadius: 50,
        // marginBottom: 20,
        // padding: 20,
        // marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    cardBoxChart: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        // flex: Platform.OS === 'ios' ? 3 : 4,
        flex: 3,
        backgroundColor: COLORS.Home,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_3: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    headerboxText: {
        marginTop: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'


    }
})
