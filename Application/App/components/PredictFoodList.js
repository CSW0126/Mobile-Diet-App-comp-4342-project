import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, Image, LogBox } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS, FONTS, Images, SIZES } from '../constants/Index'
import { Ionicons } from '@expo/vector-icons';
import FoodHelper from '../helper/FoodHelper';
const PredictFoodList = (props) => {

    const { navigation, foodList } = props
    const [displayList, setDisplayList] = useState([])
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    useEffect(() => {

        try {
            let i;
            let tempList = []

            //process the food list
            for (i = 0; i < foodList.length; i++) {
                if (foodList[i].calories) {
                    tempList.push(foodList[i])
                }
            }


            setDisplayList(tempList)
            console.log("tempList Count :" + tempList.length)
        } catch (e) {
            console.log(e)
        }

    }, [])

    const handlePress = (item) => {
        //console.log(item)

        navigation.push("FoodInfoScreen", { item, btnType: "Add", planToFood: props.planToFood })

    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: SIZES.base
            }}
            onPress={() => handlePress(item)}
        >
            {/* image */}
            {item.photo ?
                <Image
                    source={{ uri: item.photo }}
                    style={{
                        width: 50,
                        height: 50,
                    }}
                />
                :
                <Image
                    source={Images.logo}
                    style={{
                        width: 50,
                        height: 50,
                    }}
                />
            }

            {/* middle */}
            <View style={{ flex: 1, marginLeft: SIZES.radius }}>
                <Text style={{ ...FONTS.h3 }}>{(item.foodName).charAt(0).toUpperCase() + (item.foodName).slice(1)}</Text>
                <Text style={{ color: "#999999", ...FONTS.body4 }}>Cals : {(item.calories).toFixed(2)}</Text>
                <Text style={{ color: "#999999", ...FONTS.body4 }}>Carbs : {(item.total_carbohydrate).toFixed(2)} g </Text>
            </View>
            {/* right */}
            <View style={{ flexDirection: 'row', height: '100%', flex: 1, alignItems: 'center' }}>
                <Text style={{ color: "#999999", ...FONTS.body4, textAlign: 'right', width: '100%' }}>{(item.unit).charAt(0).toUpperCase() + (item.unit).slice(1)}</Text>
            </View>
            <View>
                <Ionicons name="add-circle" size={24} color="#1BC98E" style={{ paddingLeft: 10 }} />
            </View>
        </TouchableOpacity>
    )

    return (
        <View
            style={{
                marginTop: 30,
                marginHorizontal: SIZES.padding,
                padding: 20,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                //...props.style
            }}

        >
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...FONTS.h4, flex: 1 }}>Results ({displayList.length})</Text>
                <Text style={{ ...FONTS.h5, flex: 1, textAlign: 'right', paddingRight: 30 }}>Serving Size</Text>
            </View>

            <FlatList
                contentContainerStyle={{ marginTop: SIZES.radius }}
                scrollEnabled={false}
                data={displayList}
                keyExtractor={item => `${item.foodName}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                    return (
                        <View style={{ width: "100%", height: 1, backgroundColor: COLORS.lightGray }}></View>
                    )

                }}
            />

        </View>
    )
}
const styles = StyleSheet.create({})


export default PredictFoodList;