import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator, TouchableOpacity, ScrollView, LogBox } from 'react-native'
import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS, GlobalVariables, SIZES } from '../../constants/Index';
import * as ImagePicker from 'expo-image-picker';
import FoodHelper from '../../helper/FoodHelper';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
// import PredictFoodList from '../../components/PredictFoodList'

export default function PredictScreen({ route, navigation }) {
    const url  = route.params.url
    const [showIndicator, setShowIndicator] = useState(true)
    const [foodList, setFoodList] = useState(null)
    const [complexFoodList, setComplexFoodList] = useState(null)
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    // console.log(GlobalVariables.selectedSlot)
    // console.log(GlobalVariables.selectedDate)
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();

        //for testing 
        //TestGetPredict()

        //real
        getPredict()
    }, [])

    const TestGetPredict = async () => {
        try {
            let resp = await FoodHelper.AsyncFoodRecTest()
            if (resp.status == 'success') {
                //console.log(resp)
                setFoodList(resp.food)
                setComplexFoodList(resp.foodFromCusModel)
                //setComplexFoodList(textComplexFood)
                setShowIndicator(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getPredict = async () => {
        try {
            let resp = await FoodHelper.AsyncFoodRec(url)
            if (resp.status == 'success') {
                //console.log(resp)
                setFoodList(resp.food)
                setComplexFoodList(resp.foodFromCusModel)
                console.log(resp)
                console.log("-------------------------------------------------")
                console.log(resp.foodFromCusModel)
                setShowIndicator(false)
            }
        } catch (e) {
            console.log(e)
        }
    }



    const addManually = () => {
        navigation.navigate('AddManually')
    }

    const showAddedList = () => {
        GlobalVariables.mealListCase = "PredictScreen"
        navigation.push("MealListScreen")
    }

    const renderImg = () => {
        return (
            <Animatable.View
                animation="zoomIn"
            >
                <ImageBackground
                    source={{
                        uri: url,
                    }}
                    style={styles.header}
                    imageStyle={{ borderRadius: 15 }}>

                </ImageBackground>
            </Animatable.View>
        )
    }

    const renderFooter = () => {
        const planToFood = route.params.planToFood
        return (
            <View>
                <View
                    style={{ flexDirection: 'row' }}
                >
                    <TouchableOpacity
                        style={[styles.shadow, { flex: 1, width: '90%', marginTop: 20, marginHorizontal: 10 }]}
                        onPress={() => { navigation.goBack() }}
                    >
                        <LinearGradient
                            colors={[COLORS.white, COLORS.white]}
                            style={[styles.btn, { flexDirection: 'row' }]}
                        >
                            <Text style={FONTS.body5}>Try again</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.shadow, { flex: 1, width: '90%', marginTop: 20 }]}
                        onPress={addManually}
                    >
                        <LinearGradient
                            colors={[COLORS.white, COLORS.white]}
                            style={[styles.btn, { flexDirection: 'row' }]}
                        >
                            <Text style={FONTS.body5}>Add Manually</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.shadow, { flex: 1, width: '90%', marginTop: 20, marginHorizontal: 10 }]}
                        onPress={showAddedList}
                    >
                        <LinearGradient
                            colors={[COLORS.white, COLORS.white]}
                            style={[styles.btn, { flexDirection: 'row' }]}
                        >
                            <Text style={FONTS.body5}>Show Added List</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>



                <PredictFoodList
                    navigation={navigation}
                    foodList={foodList}
                    complexFoodList={complexFoodList}
                    planToFood = {planToFood}
                />
            </View>
        )
    }


    return (
        <ScrollView
            style={{ backgroundColor: "#ededed" }}
            showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, paddingBottom: 10 }}>
                {renderImg()}
                {showIndicator ?
                    <ActivityIndicator size="large" color={COLORS.darkgray} style={styles.indicator} />
                    :
                    renderFooter()
                }
            </View>
        </ScrollView>



        // <View style={styles.container}>
        //     <Animatable.View
        //         style={styles.header}
        //         animation="zoomIn">

        //         <ImageBackground
        //             source={{
        //                 uri: url,
        //             }}
        //             style={styles.header}
        //             imageStyle={{ borderRadius: 15 }}>

        //         </ImageBackground>
        //     </Animatable.View>

        //     <Animatable.View

        //         style={styles.footer}>
        //         {showIndicator ?
        //             <ActivityIndicator size="large" color={COLORS.darkgray} style={styles.indicator} />

        //             : null}

        //     </Animatable.View>
        // </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10,
    },
    btn: {
        width: '100%',
        height: Platform.OS == 'ios' ? 40 : 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Platform.OS == 'ios' ? 20 : 30,
    },
    indicator: {
        marginTop: '5%'
    },
    container: {
        borderWidth: 1,
        flex: 1,
        backgroundColor: COLORS.white
    },
    header: {
        flex: 2.5,
        justifyContent: 'flex-end',
        // paddingHorizontal: 20,
        // paddingBottom: 50,
        height: Platform.OS == 'ios' ? 300 : 200,
        width: SIZES.width
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 4,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginBottom: 20
    },
})
