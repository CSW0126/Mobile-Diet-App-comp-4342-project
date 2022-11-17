import React, { useEffect, useState, useRef } from 'react'
import { LogBox, StyleSheet, Text, View, Image, Animated, StatusBar } from 'react-native'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import { COLORS, FONTS, GlobalVariables, SIZES } from '../constants/Index';
import { Feather, Ionicons, Fontisto, AntDesign } from '@expo/vector-icons';
import FoodHelper from '../helper/FoodHelper';
import UserHelper from '../helper/UserHelper';
import EatRecordHelper from '../helper/EatRecordHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SwipeFoodList = (props) => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    const { navigation } = props
    const [listData, setListData] = useState({})
    const [btnRemove, setBtnRemove] = useState(false)
    const [index, setIndex] = useState(-1)
    const rowRef = useRef([])
    useEffect(() => {
        //console.log(foodItem)
        makeListData()
    }, [])

    useEffect(() => {
        const reload = navigation.addListener('focus', () => {
            makeListData()
        })
        return reload
    }, [navigation])

    const makeListData = () => {
        try {
            let foodItem = GlobalVariables.TargetEatRecord.food
            let tempList = []
            for (let i = 0; i < foodItem.length; i++) {
                if (foodItem[i]) {
                    let temp = {
                        key: i.toString(),
                        item: foodItem[i]
                    }

                    tempList.push(temp)
                    // console.log(temp)
                }

            }
            setListData(tempList)
        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {
        // console.log(listData)
    }, [listData])

    const handleItemClick = (val) => {
        //console.log(item)
        // if (val.food?.length == 0) {
        //     let item = FoodHelper.ConvertDBFormatToSimpleFoodJSON(val)
        //     if (item) {
        //         //console.log(GlobalVariables.mealListCase)
        //         //console.log(item)
        //         //navigation.navigate("FoodInfoScreen", { item, btnType: 'Edit' })
        //         if (GlobalVariables.mealListCase == "FoodInfo") {
        //             rowRef.current.closeAllOpenRows()
        //             navigation.push("FoodInfoScreen", { item, btnType: 'Edit' })
        //         } else {
        //             rowRef.current.closeAllOpenRows()
        //             navigation.navigate("FoodInfoScreen", { item, btnType: 'Edit' })
        //         }
        //     }
        // } else {
        //     rowRef.current.closeAllOpenRows()
        //     //console.log(val)
        //     let item = FoodHelper.ConvertMealListComplexFoodObjectToFoodInfoFormat(val)
        //     if (item) {
        //         let pass = {
        //             item,
        //             btnType: 'Edit',
        //             complexFoodID: item._id
        //         }
        //         //console.log(item)
        //         navigation.navigate("FoodInfoScreen", pass)
        //     }

        // }
    }

    const VisibleItem = (props) => {
        const {
            data,
            rowHeightAnimatedValue,
            removeRow,
            leftActionState,
            rightActionState,

        } = props;

        console.log(data)

        if (data.index == index && btnRemove) {
            rowRef.current.closeAllOpenRows()
            Animated.timing(rowHeightAnimatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            }).start(() => {
                removeRow();
            });
        }
        if (rightActionState) {
            // Animated.timing(rowHeightAnimatedValue, {
            //     toValue: 0,
            //     duration: 200,
            //     useNativeDriver: false
            // }).start(() => {
            //     removeRow();
            // });
        }

        //console.log(data.item.key)
        return (
            <Animated.View style={[styles.rowFront, {
                height: rowHeightAnimatedValue
            }]}>
                <TouchableHighlight
                    underlayColor="white"
                    onLongPress={() => handleItemClick(data.item.item)}
                    //onPress={() => handleItemClick(data.item.item)}
                    style={styles.rowFront}
                >
                    {/* <View
                style={styles.rowFront}
            > */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: SIZES.base
                    }}>
                        {/* image */}
                        <Image
                            source={{ uri: data.item.item.imageUrl }}
                            style={{
                                width: 50,
                                height: 50,
                            }}
                        />

                        {/* middle */}
                        <View style={{ flex: 1, marginLeft: SIZES.radius }}>
                            <Text style={{ ...FONTS.h3 }}>{(data.item.item.name).charAt(0).toUpperCase() + (data.item.item.name).slice(1)}</Text>
                            <Text style={{ color: "#999999", ...FONTS.body4 }}>Cals : {
                                data.item.item.length > 0 ?
                                    (data.item.item.nutrition.calories).toFixed(2) :
                                    (data.item.item.nutrition.calories * data.item.item.quantity).toFixed(2)
                            }</Text>
                            <Text style={{ color: "#999999", ...FONTS.body4 }}>Carbs : {
                                data.item.item.length > 0 ?
                                    (data.item.item.nutrition.total_carbohydrate).toFixed(2) :
                                    (data.item.item.nutrition.total_carbohydrate * data.item.item.quantity).toFixed(2)
                            } g
                            </Text>
                        </View>
                        {/* right */}
                        <View style={{ flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                            <Text style={{ color: COLORS.darkgray, ...FONTS.body4, fontWeight: 'bold' }}>{data.item.item.quantity} {" "}</Text>
                            <Text style={{ color: "#999999", ...FONTS.body4 }}>{(data.item.item.unit).charAt(0).toUpperCase() + (data.item.item.unit).slice(1)}</Text>
                            <Fontisto name="angle-right" size={18} color={COLORS.darkgray} style={{ paddingLeft: 10 }} />
                        </View>
                    </View>
                    {/* </View> */}


                </TouchableHighlight>
            </Animated.View>

        )
    }

    const renderItem = (data, rowMap) => {
        const rowHeightAnimatedValue = new Animated.Value(80)
        return (
            <VisibleItem
                data={data}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                removeRow={() => deleteRow(rowMap, data.item.key, data)}
            />
        )

    }

    const deleteRow = async (rowMap, rowKey, data) => {
        // console.log(rowMap)
        //console.log(data)
        //if (rowMap[rowKey]) {
        // console.log("CLOSE")
        // console.log(rowMap[rowKey])
        //}
        setBtnRemove(false)
        setIndex(-1)

        for (let i = 0; i < GlobalVariables.TargetEatRecord.food.length; i++) {
            if (GlobalVariables.TargetEatRecord.food[i].name == data.item.item.name) {
                GlobalVariables.TargetEatRecord.food.splice(i, 1);
                break
            }
        }

        makeListData()

        //console.log(GlobalVariables.mealObject)

        try {
            let resp = await UserHelper.AsyncEditUser(await AsyncStorage.getItem("userToken"), GlobalVariables.loginUser)
            if (resp.status == 'success') {
                console.log("success")
                //clear the undefined
                GlobalVariables.loginUser = resp.user
                GlobalVariables.TargetEatRecord = EatRecordHelper.getRecordByDaySlot(GlobalVariables.selectedDate, GlobalVariables.selectedSlot)

                //makeListData()
            }
        } catch (e) {
            console.log(e)
        }


        // const newData = [...listData];
        // // console.log(rowKey)
        // //  console.log(listData[0])
        // const prevIndex = listData.findIndex(item => item.key == rowKey);
        // // // console.log("prev+ " + prevIndex)
        // newData.splice(prevIndex, 1);
        // setListData(newData)
        props.onItemRemove()

    }

    const HiddenItemAction = (props) => {
        const {
            swipeAnimatedValue,
            leftActionActivated,
            rightActionActivated,
            rowActionAnimatedValue,
            rowHeightAnimatedValue,
            data,
            onDelete
        } = props


        // if (rightActionActivated) {
        //     Animated.spring(rowActionAnimatedValue, {
        //         toValue: SIZES.width,
        //         useNativeDriver: false
        //     }).start();
        // } else {
        //     Animated.spring(rowActionAnimatedValue, {
        //         toValue: 75,
        //         useNativeDriver: false
        //     }).start();
        // }

        return (
            <Animated.View style={[styles.rowBack, { height: rowHeightAnimatedValue }]}>
                {!leftActionActivated && (
                    <TouchableHighlight
                        underlayColor="white"
                        style={{
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 75,
                            backgroundColor: "#64e764",

                        }}
                        onPress={() => handleItemClick(data.item.item)}
                    >

                        <Animated.View
                            style={{
                                transform: [
                                    {
                                        scale: swipeAnimatedValue.interpolate({
                                            inputRange: [-135, -90],
                                            outputRange: [1, 0],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                ],
                            }}
                        >
                            <AntDesign name="edit" size={30} color="black" />
                        </Animated.View>

                    </TouchableHighlight>

                )}
                {!leftActionActivated && (
                    // <Animated.View
                    //     style={{
                    //         borderTopRightRadius: 10,
                    //         borderBottomRightRadius: 10,
                    //         height: '100%',
                    //         justifyContent: 'center',
                    //         alignItems: 'center',
                    //         width: 75,
                    //         backgroundColor: '#FE6C6B',
                    //         width: rowActionAnimatedValue
                    //     }}

                    // >
                    <TouchableHighlight
                        underlayColor="white"
                        style={{
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 75,
                            backgroundColor: '#FE6C6B',

                        }}
                        //onPress={onDelete}
                        onPress={() => deleteAnimation(data.index)}
                    >
                        <Animated.View
                            style={{
                                transform: [
                                    {
                                        scale: swipeAnimatedValue.interpolate({
                                            inputRange: [-90, -45],
                                            outputRange: [1, 0],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                ],
                            }}

                        >
                            <Feather name="trash-2" size={30} color="#541414" />
                        </Animated.View>

                    </TouchableHighlight>

                    // </Animated.View>
                )}
            </Animated.View >
        )
    }
    const deleteAnimation = (index) => {
        setBtnRemove(true)
        setIndex(index)
    }

    const onRowDidOpen = rowKey => {
        //console.log('This row opened', rowKey);
        //console.log(rowRef.current.closeAllOpenRows())

    };

    const onLeftActionStatusChange = rowKey => {
        //console.log('onLeftActionStatusChange', rowKey);
    };

    const onRightActionStatusChange = rowKey => {
        //console.log('onRightActionStatusChange', rowKey);
    };

    const onRightAction = rowKey => {
        //console.log('onRightAction', rowKey);
    };

    const onLeftAction = rowKey => {
        //console.log('onLeftAction', rowKey);
    };

    const onRowClose = rowKey => {
        // console.log('onrowclose', rowKey)
    }

    const renderHiddenItem = (data, rowMap) => {
        const rowActionAnimatedValue = new Animated.Value(75)
        const rowHeightAnimatedValue = new Animated.Value(60)
        return (
            <HiddenItemAction
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onDelete={() => deleteRow(rowMap, data.item.key, data)}

            />
        )

    }

    return (
        <View style={styles.container}>
            <View 
                style={{alignItems:'center', marginBottom:20}}
                >
                <Text
                    style={{}}
                >*Swipe Left to Delete</Text>
            </View>
            <SwipeListView
                ref={rowRef}
                data={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={0}
                rightOpenValue={-150}
                disableRightSwipe
                onRowDidOpen={onRowDidOpen}
                leftActivationValue={100}
                rightActivationValue={-500}
                leftActionValue={0}
                rightActionValue={-500}
                onLeftAction={onLeftAction}
                onRightAction={onRightAction}
                onLeftActionStatusChange={onLeftActionStatusChange}
                onRightActionStatusChange={onRightActionStatusChange}
                onRowClose={onRowClose}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1,
        paddingTop: 40,
        borderRadius: 25
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: COLORS.white,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 15,
        margin: 5,
        marginBottom: 15,
        borderRadius: 5,
    },
    rowFront: {
        backgroundColor: 'white',
        paddingHorizontal: 10
        //flexDirection: 'row',
        //alignItems: 'center',
        //paddingVertical: SIZES.base
        // borderRadius: 5,
        // margin: 5,
        // marginBottom: 15,
        // shadowColor: '#999',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 5,
    },
})

export default SwipeFoodList;
