import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";

import { Popover, Button, Box, Center, NativeBaseProvider } from "native-base";
import PopoverElement from '../PopoverElement';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { auth, db, createUserWithEmailAndPassword, setDoc, doc, addDoc, getDoc } from '../../configs/firebase'
import { collection, query, where, getDocs } from "firebase/firestore";
import NutririonalRow from '../component/NutritionalRow';

const Tabs = AnimatedTabBarNavigator();

const CalendarScreen = ({ route }) => {
    const navigation = useNavigation()

    const maxCalories = 2000
    const maxCarbohydrate = 288
    const maxFat = 55
    const maxFiber = 25
    const maxProtein = 82
    const maxSugars = 40

    const [nutrititionalValue, setNutrititionalValue] = useState({
        calories: 0,
        carbohydrate: 0,
        fat: 0,
        fiber: 0,
        protein: 0,
        sugars: 0
    })

    const dayDate = new Date()
    const [dayViewMonth, setDayViewMonth] = useState(dayDate.getMonth());
    const [dayViewYear, setDayViewYear] = useState(dayDate.getFullYear());
    const [dayViewDay, setDayViewDay] = useState(dayDate.getDate());
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const currentDay = dayViewDay + " " + months[dayViewMonth] + " " + dayViewYear

    async function getCalendarData(date) {
        const temp = []

        const calendarRef = doc(db, "users", userID, "calendar", date);
        const docSnapCalendar = await getDoc(calendarRef);

        if (docSnapCalendar.exists()) {
            setBreakfast(docSnapCalendar.data().Breakfast)
            setLunch(docSnapCalendar.data().Lunch)
            setDinner(docSnapCalendar.data().Dinner)
            setSupper(docSnapCalendar.data().Supper)
            setSnacks(docSnapCalendar.data().Snacks)
            if (docSnapCalendar.data().Breakfast) {
                temp.push(docSnapCalendar.data().Breakfast)
            }
            if (docSnapCalendar.data().Lunch) {
                temp.push(docSnapCalendar.data().Lunch)
            }
            if (docSnapCalendar.data().Dinner) {
                temp.push(docSnapCalendar.data().Dinner)
            }
            if (docSnapCalendar.data().Supper) {
                temp.push(docSnapCalendar.data().Supper)
            }
            if (docSnapCalendar.data().Snacks) {
                temp.push(docSnapCalendar.data().Snacks)
            }
            getNutritionalValue(temp)
        } else {
            setBreakfast(undefined)
            setLunch(undefined)
            setDinner(undefined)
            setSupper(undefined)
            setSnacks(undefined)
            setNutrititionalValue({
                calories: 0,
                carbohydrate: 0,
                fat: 0,
                fiber: 0,
                protein: 0,
                sugars: 0
            })
        }
        console.log(temp)
    }

    const getNutritionalValue = (meals) => {
        const temp = {
            calories: Math.round((meals.reduce((a, v) => a = a + v.calories, 0)) * 100) / 100,
            carbohydrate: Math.round((meals.reduce((a, v) => a = a + v.carbohydrate, 0)) * 100) / 100,
            fat: Math.round((meals.reduce((a, v) => a = a + v.fat, 0)) * 100) / 100,
            protein: Math.round((meals.reduce((a, v) => a = a + v.protein, 0)) * 100) / 100,
            sugars: Math.round((meals.reduce((a, v) => a = a + v.sugars, 0)) * 100) / 100,
            fiber: Math.round((meals.reduce((a, v) => a = a + v.fiber, 0)) * 100) / 100,
        }

        setNutrititionalValue(temp)
    }


    const previousDay = (e) => {
        e.preventDefault()
        var date = new Date(dayViewYear, dayViewMonth, dayViewDay);
        date.setDate(date.getDate() - 1);
        const day = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
        setDayViewYear(date.getFullYear())
        setDayViewMonth(date.getMonth())
        setDayViewDay(date.getDate())

        getCalendarData(day)
    };

    const nextDay = (e) => {
        e.preventDefault()
        var date = new Date(dayViewYear, dayViewMonth, dayViewDay);
        date.setDate(date.getDate() + 1);
        const day = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
        setDayViewYear(date.getFullYear())
        setDayViewMonth(date.getMonth())
        setDayViewDay(date.getDate())
        getCalendarData(day)
    };

    function getProgressBarColor() {
        if (nutrititionalValue.calories >= maxCalories - 100 && nutrititionalValue.calories <= maxCalories + 100) {
            return "#9FD276"
        } else if (nutrititionalValue.calories > maxCalories + 100) {
            return "#E76057"
        }

        return "#2B255A"
    }

    const userID = auth.currentUser.uid
    const [breakfast, setBreakfast] = useState({
        calories: 0,
        carbohydrate: 0,
        fat: 0,
        fiber: 0,
        protein: 0,
        sugars: 0,
        ingredients: []
    });
    const [lunch, setLunch] = useState({
        calories: 0,
        carbohydrate: 0,
        fat: 0,
        fiber: 0,
        protein: 0,
        sugars: 0,
        ingredients: []
    });
    const [dinner, setDinner] = useState({
        calories: 0,
        carbohydrate: 0,
        fat: 0,
        fiber: 0,
        protein: 0,
        sugars: 0,
        ingredients: []
    });
    const [supper, setSupper] = useState({
        calories: 0,
        carbohydrate: 0,
        fat: 0,
        fiber: 0,
        protein: 0,
        sugars: 0,
        ingredients: []
    });
    const [snacks, setSnacks] = useState({
        calories: 0,
        carbohydrate: 0,
        fat: 0,
        fiber: 0,
        protein: 0,
        sugars: 0,
        ingredients: []
    });

    useEffect(() => {
        getCalendarData(currentDay)

    }, []);


    const handlePlanMeal = (typeMeal) => {
        navigation.navigate("Plan meal", { date: date, typeMeal: typeMeal, meals: [] })
    }


    return (
        <NativeBaseProvider>
            <View style={styles.topbar}>
                <Button style={styles.smallbutton} onPress={previousDay}>
                    <MaterialCommunityIcons name="chevron-left" color={"#2B255A"} size={24} />
                </Button>
                <Button style={styles.bigbutton}>
                    {currentDay}

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
                        fill={(nutrititionalValue.calories / maxCalories) * 100}
                        tintColor={getProgressBarColor()}
                        backgroundColor="#C4C4C44D"
                        lineCap='round'>
                        {
                            (fill) => (
                                <Text style={styles.textCalories}>
                                    {nutrititionalValue.calories + " / " + maxCalories}
                                </Text>
                            )
                        }
                    </AnimatedCircularProgress>
                    <View marginTop={10}>
                        <NutririonalRow title={"carbohydrate"} value={nutrititionalValue.carbohydrate} maxValue={maxCarbohydrate} />
                        <NutririonalRow title={"fat"} value={nutrititionalValue.fat} maxValue={maxFat} />
                        <NutririonalRow title={"fiber"} value={nutrititionalValue.fiber} maxValue={maxFiber} />
                        <NutririonalRow title={"protein"} value={nutrititionalValue.protein} maxValue={maxProtein} />
                        <NutririonalRow title={"sugars"} value={nutrititionalValue.sugars} maxValue={maxSugars} />
                    </View>
                </View>
                <View style={styles.containerPlan}>
                    <Text style={styles.textTitle}>Plan of the day</Text>

                    {/* Breakfast */}
                    <View style={styles.daybox}>
                        <View style={styles.mealtimesBox}>
                            <View style={styles.mealTimeBox}>
                                <Text style={styles.mealTimeText}>8:00</Text>
                            </View>
                            <View style={styles.mealTypeBox}>
                                <Text style={styles.mealTypeText}>Breakfast</Text>
                            </View>
                        </View>
                        {breakfast ?
                            breakfast.ingredients.map(({ name }) => (
                                <View style={styles.mealsNameBox}>
                                    <Text style={styles.mealNameText}>{name}</Text>
                                </View>
                            ))
                            :
                            <View style={styles.mealsNameBox}>
                                <Text style={styles.mealNameText}>No meal planned</Text>
                            </View>
                        }
                        <View style={styles.caloriesBox}>
                            <View style={styles.mealsCaloriesBox}>
                                <Text style={styles.mealCaloriesText}>{breakfast ? breakfast.calories + "kcal" : "0 kcal"}  </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.buttonPlan}
                                onPress={(e) => handlePlanMeal("Breakfast")}
                            >
                                <Text style={styles.buttonPlanText}>Plan your breakfast</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Lunch */}
                    <View style={styles.daybox}>
                        <View style={styles.mealtimesBox}>
                            <View style={styles.mealTimeBox}>
                                <Text style={styles.mealTimeText}>12:00</Text>
                            </View>
                            <View style={styles.mealTypeBox}>
                                <Text style={styles.mealTypeText}>Lunch</Text>
                            </View>
                        </View>
                        {lunch ?
                            lunch.ingredients.map(({ name }) => (
                                <View style={styles.mealsNameBox}>
                                    <Text style={styles.mealNameText}>{name}</Text>
                                </View>
                            ))
                            :
                            <View style={styles.mealsNameBox}>
                                <Text style={styles.mealNameText}>No meal planned</Text>
                            </View>
                        }
                        <View style={styles.caloriesBox}>
                            <View style={styles.mealsCaloriesBox}>
                                <Text style={styles.mealCaloriesText}>{lunch ? lunch.calories + "kcal" : "0 kcal"}  </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.buttonPlan}
                                onPress={(e) => handlePlanMeal("Lunch")}
                            >
                                <Text style={styles.buttonPlanText}>Plan your lunch</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Dinner */}
                    <View style={styles.daybox}>
                        <View style={styles.mealtimesBox}>
                            <View style={styles.mealTimeBox}>
                                <Text style={styles.mealTimeText}>16:00</Text>
                            </View>
                            <View style={styles.mealTypeBox}>
                                <Text style={styles.mealTypeText}>Dinner</Text>
                            </View>
                        </View>
                        {dinner ?
                            dinner.ingredients.map(({ name }) => (
                                <View style={styles.mealsNameBox}>
                                    <Text style={styles.mealNameText}>{name}</Text>
                                </View>
                            ))
                            :
                            <View style={styles.mealsNameBox}>
                                <Text style={styles.mealNameText}>No meal planned</Text>
                            </View>
                        }
                        <View style={styles.caloriesBox}>
                            <View style={styles.mealsCaloriesBox}>
                                <Text style={styles.mealCaloriesText}>{dinner ? dinner.calories + "kcal" : "0 kcal"}  </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.buttonPlan}
                                onPress={(e) => handlePlanMeal("Dinner")}
                            >
                                <Text style={styles.buttonPlanText}>Plan your dinner</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Supper */}
                    <View style={styles.daybox}>
                        <View style={styles.mealtimesBox}>
                            <View style={styles.mealTimeBox}>
                                <Text style={styles.mealTimeText}>20:00</Text>
                            </View>
                            <View style={styles.mealTypeBox}>
                                <Text style={styles.mealTypeText}>Supper</Text>
                            </View>
                        </View>
                        {supper ?
                            supper.ingredients.map(({ name }) => (
                                <View style={styles.mealsNameBox}>
                                    <Text style={styles.mealNameText}>{name}</Text>
                                </View>
                            ))
                            :
                            <View style={styles.mealsNameBox}>
                                <Text style={styles.mealNameText}>No meal planned</Text>
                            </View>
                        }
                        <View style={styles.caloriesBox}>
                            <View style={styles.mealsCaloriesBox}>
                                <Text style={styles.mealCaloriesText}>{supper ? supper.calories + "kcal" : "0 kcal"}  </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.buttonPlan}
                                onPress={(e) => handlePlanMeal("Supper")}
                            >
                                <Text style={styles.buttonPlanText}>Plan your supper</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Snacks */}
                    <View style={styles.daybox}>
                        <View style={styles.mealtimesBox}>
                            <View style={styles.mealTimeBox}>
                                <Text style={styles.mealTimeText}> </Text>
                            </View>
                            <View style={styles.mealTypeBox}>
                                <Text style={styles.mealTypeText}>Snacks</Text>
                            </View>
                        </View>
                        {snacks ?
                            snacks.ingredients.map(({ name }) => (
                                <View style={styles.mealsNameBox}>
                                    <Text style={styles.mealNameText}>{name}</Text>
                                </View>
                            ))
                            :
                            <View style={styles.mealsNameBox}>
                                <Text style={styles.mealNameText}>No meal planned</Text>
                            </View>
                        }
                        <View style={styles.caloriesBox}>
                            <View style={styles.mealsCaloriesBox}>
                                <Text style={styles.mealCaloriesText}>{snacks ? snacks.calories + "kcal" : "0 kcal"}  </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.buttonPlan}
                                onPress={(e) => handlePlanMeal("Snacks")}
                            >
                                <Text style={styles.buttonPlanText}>Plan your snacks</Text>
                            </TouchableOpacity>
                        </View>
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
        fontWeight: '700',
        fontSize: 18,
        color: '#2B255A',
        marginBottom: 5,
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
    containerPlan: {
        width: '90%',
        alignItems: 'center',
        marginTop: 30,
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
    mealTimeBox: {
        marginLeft: 20
    },
    mealTimeText: {
        fontWeight: '300',
        fontSize: 14,
        color: '#2B255A',
        textAlign: 'justify',
    },
    mealTypeBox: {
        marginRight: 20,
        marginBottom: 5
    },
    mealTypeText: {
        fontWeight: '700',
        fontSize: 16,
        color: '#2B255A',
        textAlign: 'justify',
    },
    mealsNameBox: {
        marginBottom: 5
    },
    mealNameText: {
        fontWeight: '400',
        fontSize: 16,
        color: '#2B255A',
        textAlign: 'justify',
    },
    caloriesBox: {
        width: "100%",
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#2B255A26',
    },
    mealsCaloriesBox: {
        width: "40%",
        backgroundColor: '#2B255A',
        alignItems: "center",
        padding: 5,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    mealCaloriesText: {
        fontWeight: '400',
        fontSize: 16,
        color: 'white',
        textAlign: 'justify',
    },
    buttonPlan: {
        width: "60%",
        alignItems: "center",
    },
    buttonPlanText: {
        fontWeight: '500',
        fontSize: 16,
        color: '#2B255A',
        textAlign: 'justify',
    },
    mealtimesBox: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    daybox: {
        width: '90%',
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        paddingTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        marginTop: 10
    },
})