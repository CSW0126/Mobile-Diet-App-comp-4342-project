import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, Image,  TouchableOpacity, Alert } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { COLORS, FONTS, GlobalVariables, ImgJson, SIZES } from '../constants/Index'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { VictoryPie } from "victory-native";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';


const defaultGraphicData = [{ y: 0 }, { y: 0 }, { y: 100 }];
const graphicColor = ['#3075C1', '#FDA521', '#FE3E3D'];

const FoodInfo = (props) => {
    const { foodItem, navigation } = props
    const [quantity, setQuantity] = useState(foodItem.qty)
    // const [displayQty, setDisplayQty] = useState(quantity)
    const [calPieData, setCalPieData] = useState(defaultGraphicData)
    const [inputError, setInputError] = useState(false)
    const [btnText, setBtnText] = useState(props.btnText)
    const [btnDisable, setBtnDisable] = useState(false)
    const [showDelete, setShowDelete] = useState(props.showDelete)

    useEffect(() => {
        //console.log(foodItem)
        // setDisplayQty(quantity)
        renderCalChart()
    }, [quantity])

    useEffect(() => {
        //console.log(showDelete)
        const reload = navigation.addListener('focus', () => {
            setBtnDisable(false)
        })
        return reload
    }, [navigation])

    const renderCalChart = () => {
        let wantedGraphicData = []
        let carb = foodItem.total_carbohydrate * quantity
        let fat = foodItem.total_fat * quantity
        let protein = foodItem.protein * quantity
        wantedGraphicData.push({ y: carb })
        wantedGraphicData.push({ y: fat })
        wantedGraphicData.push({ y: protein })
        setCalPieData(wantedGraphicData)
    }

    const handleAdd = () => {
        if (quantity + 1 > 100) {
            setInputError(true)
        } else {
            setInputError(false)
            setQuantity(quantity + 1)
        }
    }

    const handleSubtract = () => {
        if (quantity - 1 < 0) {
            setQuantity(0)
            setInputError(true)
        } else {
            setInputError(false)
            setQuantity(quantity - 1)
        }
    }
    const handleAmountChange = (val) => {
        if (val.charAt(val.length - 1) == ".") {
            let count = 0;
            for (let i = 0; i < val.length; i++) {
                if (val[i] == '.') {
                    count++
                }
            }
            if (count > 1) {
                return
            }
        }


        try {
            const numericRegex = /^\d*\.?\d*$/
            if (numericRegex.test(val)) {
                if (val > 100) {
                    setQuantity(100)
                    setInputError(true)
                } else if (val <= 0) {
                    setInputError(true)
                    setQuantity(0)
                } else {
                    setInputError(false)
                    setQuantity(val)
                }
            } else {
                setQuantity(0)
                setInputError(true)
            }
        } catch (e) {
            setInputError(true)
        }
    }

    const handleSave = () => {

        if (quantity <= 0 || quantity > 100) {
            console.log("Error")
            setInputError(true)
        } else {
            //console.log(quantity)
            setBtnDisable(true)
            console.log(foodItem)
            console.log(quantity)
            props.saveClick(foodItem, quantity)
        }


    }

    const renderHeader = () => {
        return (
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
                    <View
                        style={{
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: SIZES.padding * 3,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.white
                        }}
                    >

                        <Text style={{ ...FONTS.h3 }}>{(foodItem.foodName).charAt(0).toUpperCase() + (foodItem.foodName).slice(1)}</Text>

                    </View>

                </View>

                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingRight: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    {/* maybe a add button */}
                </TouchableOpacity>
            </View>
        )
    }

    const handleDelete = () => {
        props.onItemDelete(foodItem)
    }

    const renderDeleteBtn = () => {
        return (
            <View style={{ backgroundColor: COLORS.lightGray2, width: SIZES.width, justifyContent: 'center', alignItems: 'center', paddingBottom: 20, flex: 1, left: 20 }}>
                {/* save button */}
                <TouchableOpacity
                    disabled={btnDisable}
                    style={{ flex: 1, width: '90%', marginTop: 20 }}
                    onPress={handleDelete}
                >
                    <LinearGradient
                        colors={["#EC3C3D", "#EC3C3D"]}
                        style={styles.btn}
                    >
                        <Text style={{ color: COLORS.white, textTransform: 'uppercase', ...FONTS.body3 }}>DELETE</Text>
                    </LinearGradient>
                </TouchableOpacity>


            </View>
        )
    }

    const renderFoodInfo = () => {
        console.log(foodItem.photo)
        return (

            <View style={{ alignItems: 'center' }}>
                {/* image */}
                <View style={{ height: SIZES.height * 0.25 }}>
                    <Image
                        source={{ uri: foodItem.photo }}
                        style={{
                            width: 150,
                            height: 150
                        }}
                    />
                </View>

                {/* quantity input  */}

                <View style={{
                    // flexDirection: 'c',
                    backgroundColor: COLORS.lightGray2,
                    width: '100%',
                    borderTopRightRadius: 25,
                    borderTopLeftRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {/* <Text style={{
                        ...FONTS.h3,
                        flex: 1,
                        textAlign: 'center',
                        marginTop: 20,
                        marginRight: 20,

                    }}>Amount</Text> */}
                    <View style={{
                        flexDirection: 'row',
                        flex: 1,
                        marginHorizontal: 50
                    }}>
                        {/* add */}
                        <TouchableOpacity
                            onPress={handleAdd}
                            style={{
                                marginTop: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                                // backgroundColor: '#DDDEE2',
                                backgroundColor: COLORS.white,
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5,
                                borderLeftWidth: 1,
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderColor: "#999999",
                                paddingHorizontal: 10
                            }}
                        >
                            <Ionicons name="add" size={24} color="black" />
                        </TouchableOpacity>
                        <TextInput
                            maxLength={6}
                            placeholder={foodItem.unit}
                            textAlign='center'
                            keyboardType='numeric'
                            onChangeText={(text) => handleAmountChange(text)}
                            value={quantity ? quantity.toString() : null}
                            style={{
                                flex: 1,
                                fontSize: 18,
                                marginTop: 20,
                                padding: 10,
                                backgroundColor: COLORS.white,
                                // backgroundColor: '#DDDEE2',
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderColor: "#999999",
                            }} />
                        {/* subtract */}
                        <TouchableOpacity
                            onPress={handleSubtract}
                            style={{
                                marginTop: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                                backgroundColor: COLORS.white,
                                //backgroundColor: '#DDDEE2',
                                borderTopRightRadius: 5,
                                borderBottomRightRadius: 5,
                                borderRightWidth: 1,
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderColor: "#999999",
                                paddingHorizontal: 10
                            }}
                        >
                            <AntDesign name="minus" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    {inputError ?
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg2}>Please input a number from 0.1 to 100</Text>
                        </Animatable.View>
                        : null}



                </View>
                

                {/* nut table */}
                <View style={styles.nutTable}>
                    {/* left */}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ ...FONTS.body1, fontWeight: 'bold' }}>{(foodItem.calories * quantity).toFixed(2)}</Text>
                        <Text style={{ ...FONTS.body4, color: COLORS.darkgray }}>Calories</Text>
                        <VictoryPie
                            animate={{ easing: 'exp' }}
                            data={calPieData}
                            width={150}
                            height={150}
                            colorScale={graphicColor}
                            innerRadius={50}
                            labels={() => null}
                        />
                    </View>

                    {/* middle */}
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ borderBottomWidth: 2 }}>
                            <Text style={{ width: '100%', textAlign: 'left', paddingVertical: 10 }}>Nutrition  Facts</Text>
                        </View>
                        <View style={{ borderBottomWidth: 2, marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.circle, { backgroundColor: '#FDA521' }]}></View>
                                <Text style={[styles.text, { paddingTop: 10 }]}>Total Fat </Text>
                            </View>

                            <Text style={styles.textSec} >Saturated_Fat</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.circle, { backgroundColor: '#3075C1', marginBottom: 10 }]}></View>
                                <Text style={styles.text}>Total Carbohydrates</Text>
                            </View>

                            <Text style={styles.textSec} >Fibre</Text>
                            <Text style={styles.textSec} >Sugar</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.circle, { backgroundColor: '#FE3E3D', marginBottom: 10 }]}></View>
                                <Text style={styles.text}>Protein</Text>
                            </View>
                        </View>
                        <Text style={styles.text}>Cholesterol</Text>
                        <Text style={styles.text}>Sodium</Text>
                        <Text style={styles.text}>Potassium </Text>

                    </View>

                    {/* right */}
                    <View style={{ flex: 1, justifyContent: 'center', paddingRight: 10 }}>
                        <View style={{ borderBottomWidth: 2 }}>
                            <Text style={{ width: '100%', textAlign: 'right', paddingVertical: 10, paddingRight: 10 }}>Amount</Text>
                        </View>
                        <View style={{ borderBottomWidth: 2, marginBottom: 10 }}>
                            <Text style={[styles.textNum, { paddingTop: 10 }]}>{(quantity * foodItem.total_fat).toFixed(2)} g</Text>
                            <Text style={styles.textNumSec}>{(quantity * foodItem.saturated_fat).toFixed(2)} g</Text>
                            <Text style={styles.textNum}>{(quantity * foodItem.total_carbohydrate).toFixed(2)} g</Text>
                            <Text style={styles.textNumSec}>{(quantity * foodItem.dietary_fiber).toFixed(2)} g</Text>
                            <Text style={styles.textNumSec}>{(quantity * foodItem.sugars).toFixed(2)} g</Text>
                            <Text style={styles.textNum}>{(quantity * foodItem.protein).toFixed(2)} g</Text>
                        </View>
                        <Text style={styles.textNum}>{(quantity * foodItem.cholesterol).toFixed(2)} mg</Text>
                        <Text style={styles.textNum}>{(quantity * foodItem.sodium).toFixed(2)} mg</Text>
                        <Text style={styles.textNum}>{(quantity * foodItem.potassium).toFixed(2)} mg</Text>


                    </View>
                </View>
                <View style={{ backgroundColor: COLORS.lightGray2, justifyContent: 'center', alignItems: 'center', flex: 1, paddingHorizontal: 40 }}>
                    {/* save button */}
                    <TouchableOpacity
                        disabled={btnDisable}
                        style={{ flex: 0.4, width: '90%', marginTop: 20 }}
                        onPress={handleSave}
                    >
                        <LinearGradient
                            colors={[COLORS.lightGreen, COLORS.lightGreen]}
                            style={styles.btn}
                        >
                            <Text style={{ color: COLORS.white, textTransform: 'uppercase', ...FONTS.body3 }}>{btnText}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {/* {btnText == 'Edit' ?
                    renderDeleteBtn()
                    : renderFlex()} */}

            </View>

        )
    }

    const renderFlex = () => {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.lightGray2, width: SIZES.width, paddingBottom: 20, paddingTop: Platform.OS == 'ios' ? 50 : 10 }}>

            </View>
        )
    }

    return (

        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {renderHeader()}
            {renderFoodInfo()}
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    errorMsg2: {
        paddingTop: 5,
        color: COLORS.red
    },
    btn: {
        width: SIZES.width * 0.8,
        height: Platform.OS == 'ios' ? 50 : 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Platform.OS == 'ios' ? 20 : 30,
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        alignSelf: 'center',
        marginRight: 10,
    },
    text: {
        paddingBottom: 10,
        textAlign: 'left'
    },
    textSec: {
        paddingBottom: 10,
        textAlign: 'left',
        color: COLORS.darkgray,
        paddingLeft: 40
    },
    textNum: {
        paddingBottom: 10,
        textAlign: 'right',
        paddingRight: 10
    },
    textNumSec: {
        paddingBottom: 10,
        textAlign: 'right',
        paddingRight: 10,
        color: COLORS.darkgray
    },
    nutTable: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: COLORS.lightGray2,
        // borderTopRightRadius: 25,
        // borderTopLeftRadius: 25,
        paddingVertical: 10
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    checkBoxContainer: {
        backgroundColor: 'transparent',
        marginBottom: 0
    },
    buttonText: {
        alignSelf: 'center',
        textAlign: 'center',
        ...FONTS.h3,
        color: COLORS.white,


    },
    button: {
        height: 50,
        width: SIZES.width * 0.7,
        marginVertical: 10,
        borderRadius: 25,
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
})


export default FoodInfo;