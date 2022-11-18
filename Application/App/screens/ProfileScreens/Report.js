import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { COLORS, FONTS, GlobalVariables, ImgJson, SIZES } from '../../constants/Index';
import React, { useState ,useEffect} from 'react'
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLine, VictoryLabel  } from "victory-native";
import UserHelper from '../../helper/UserHelper';

export default function Report({navigation}) {
    const [target, setTarget] = useState(UserHelper.CalBmr())
    const [domain, setDomain] = useState(3000)
    const [data, setData] = useState([])

    useEffect(() => {
        const reload = navigation.addListener('focus', () => {
            let lastSevenDayData = UserHelper.GetLastSevenDaysData()
            setData(lastSevenDayData)
        })
        return reload
    }, [navigation])

  return (
    <ScrollView            
            contentContainerStyle={{
            flex: 1
            }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.h}>Diet Record</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <View>
                        <Text style={{...FONTS.body2}}>Calories absorb in last week:</Text>
                    </View>
                    <View style={{marginLeft:"5%"}}>
                        <VictoryChart
                            responsive={false}
                            animate={{
                                duration: 500,
                                onLoad: { duration: 200 }
                                }}
                            domainPadding={{ x: Dimensions.get("window").width *0.07 }}
                            theme={VictoryTheme.material}
                        >
                            {/* <VictoryAxis /> */}
                            <VictoryBar
                            barRatio={1}
                            cornerRadius={0} // Having this be a non-zero number looks good when it isn't transitioning, but looks like garbage when it is....
                            style={{ data: { fill: COLORS.Social } }}
                            alignment="middle"
                            // labels={d => d.y}
                            data={data}
                            />
                            <VictoryLine 
                                    domain={{y: [0,(domain)]}}
                                    style={
                                        {data : {
                                            stroke:COLORS.akabeni
                                        }}
                                    }
                                    y={() => target }
                                    labels={[`${target} cal`]}
                                    labelComponent={<VictoryLabel 
                                        
                                        dx={Dimensions.get("window").width *0.3} 
                                        dy={-20}
                                        style={[
                                            { fill: COLORS.akabeni }
                                        ]}
                                        
                                        />}
                            />
                        </VictoryChart>
                    </View>

                </View>
            </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray,
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    header:{
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        marginTop: Platform.OS === "ios" ? 30 : 0
    },
    body:{
        flex: 3,
        alignItems:'center',
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    h:{
        ...FONTS.h1,
        marginTop:"10%",
        marginLeft:"5%"
    }
})