import { auth } from '../../configs/firebase'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from 'react-native'
// import { auth, onAuthStateChanged } from '../configs/firebase'
import { useNavigation } from '@react-navigation/core'
// import Toast, { ErrorToast } from 'react-native-toast-message'
// import { getErrorMessage } from "../utils/ErrorUtils";
// import { isEmpty, validateEmail, matchPassword, showToast } from "../utils/ValidateUtils";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";

import { Popover, Button, Box, Center, NativeBaseProvider } from "native-base";
import PopoverElement from '../PopoverElement';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import NutririonalRow from '../component/NutritionalRow';

const Tabs = AnimatedTabBarNavigator();

const CalendarScreen = () => {
    const navigation = useNavigation()

    const calories = 1500
    const maxCalories = 2000
    const carbohydrate = 150
    const maxCarbohydrate = 288
    const fat = 10
    const maxFat = 55
    const fiber = 24
    const maxFiber = 25
    const protein = 40
    const maxProtein = 82
    const sugars = 50
    const maxSugars = 40

    const dayDate = new Date()
    const [dayViewMonth, setDayViewMonth] = useState(dayDate.getMonth());
    const [dayViewYear, setDayViewYear] = useState(dayDate.getFullYear());
    const [dayViewDay, setDayViewDay] = useState(dayDate.getDate());
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const previousDay = () => {
        var date = new Date(dayViewYear, dayViewMonth, dayViewDay);
        date.setDate(date.getDate() - 1);
        setDayViewYear(date.getFullYear())
        setDayViewMonth(date.getMonth())
        setDayViewDay(date.getDate())
    };

    const nextDay = () => {
        var date = new Date(dayViewYear, dayViewMonth, dayViewDay);
        date.setDate(date.getDate() + 1);
        setDayViewYear(date.getFullYear())
        setDayViewMonth(date.getMonth())
        setDayViewDay(date.getDate())
    };

    function getProgressBarColor() {
        if (calories >= maxCalories - 100 && calories <= maxCalories + 100) {
            return "#9FD276"
        } else if (calories > maxCalories + 100) {
            return "#E76057"
        }

        return "#2B255A"
    }


    return (
        <NativeBaseProvider>
            <View style={styles.topbar}>
                <Button style={styles.smallbutton} onPress={previousDay}>
                    <MaterialCommunityIcons name="chevron-left" color={"#2B255A"} size={24} />
                </Button>
                <Button style={styles.bigbutton}>
                    {dayViewDay + " " + months[dayViewMonth] + " " + dayViewYear}

                </Button>
                <Button style={styles.smallbutton} onPress={nextDay}>
                    <MaterialCommunityIcons name="chevron-right" color={"#2B255A"} size={24} />
                </Button>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.textStart}>Nutrirional values</Text>
                    <Text style={styles.text}>Calories today: </Text>
                    <AnimatedCircularProgress
                        size={180}
                        width={15}
                        fill={(calories / maxCalories) * 100}
                        tintColor={getProgressBarColor()}
                        backgroundColor="#C4C4C44D"
                        lineCap='round'>
                        {
                            (fill) => (
                                <Text style={styles.textCalories}>
                                    {calories + " / " + maxCalories}
                                </Text>
                            )
                        }
                    </AnimatedCircularProgress>
                    <View marginTop={10}>
                        <NutririonalRow title={"carbohydrate"} value={calories} maxValue={maxCarbohydrate} />
                        <NutririonalRow title={"fat"} value={fat} maxValue={maxFat} />
                        <NutririonalRow title={"fiber"} value={fiber} maxValue={maxFiber} />
                        <NutririonalRow title={"protein"} value={protein} maxValue={maxProtein} />
                        <NutririonalRow title={"sugars"} value={sugars} maxValue={maxSugars} />
                    </View>


                </View>
            </ScrollView>

        </NativeBaseProvider>
    )
}

export default CalendarScreen

const styles = StyleSheet.create({
    topbar: {
        width: "100%",
        height: 50,
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        marginBottom: 10
    },
    textTitle: {
        color: '#2B255A'
    },
    textStart: {
        fontWeight: '700',
        fontSize: 18,
        color: '#2B255A',
        marginBottom: 15,
    },
    textCalories: {
        fontWeight: '700',
        fontSize: 24,
        color: '#2B255A'
    },
    text: {
        fontWeight: '300',
        fontSize: 14,
        color: '#2B255A',
        textAlign: 'justify',
        marginTop: 5,
        marginBottom: 15,
        paddingLeft: 5,
        paddingRight: 5
    },
    smallbutton: {
        width: "15%",
        borderRadius: 15,
        backgroundColor: "white",
        color: "black",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    bigbutton: {
        width: "60%",
        color: '#2B255A',
        borderRadius: 15,
        backgroundColor: '#2B255A',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },

    scrollView: {
        display: 'flex',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 30
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

})