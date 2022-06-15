
import React, { useEffect, useState, Component } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from 'react-native'
// import { auth, signInWithEmailAndPassword } from '../configs/firebase'
import { useNavigation } from '@react-navigation/core'
// import Toast, { ErrorToast } from 'react-native-toast-message'
// import { getErrorMessage } from "../utils/ErrorUtils";
// import { isEmpty, validateEmail, matchPassword, showToast } from "../utils/ValidateUtils";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import ActionButton from 'react-native-action-button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { isEmpty, showToast } from "../../utils/ValidateUtils";
import { auth, db, createUserWithEmailAndPassword, setDoc, doc, addDoc, getDoc } from '../../configs/firebase'
import { collection, query, where, getDocs } from "firebase/firestore";
import { async } from '@firebase/util';

const PlanMeal = ({ route }) => {
    const navigation = useNavigation()
    const userID = auth.currentUser.uid

    const [elements, setElements] = useState([]);

    useEffect(() => {
        setElements(route.params.meals)
    }, [])

    const handleRmoveElement = (e, element) => {
        setElements(elements.filter(item => item.element.name !== element.name));
    }

    const handleSave = async () => {
        const day = route.params.date
        const typeMeal = route.params.typeMeal

        const listOfMeals = []
        const listOfIngredients = []

        elements.map(({ element, size, calories, typeElement }) => {
            if (typeElement == "meal") {
                const temp = {
                    name: element.name,
                    calories: calories,
                    carbohydrate: element.carbohydrate,
                    fat: element.fat,
                    fiber: element.fiber,
                    protein: element.protein,
                    size: "1 portion",
                    sugars: element.sugars,
                    element: element
                }
                listOfMeals.push(...listOfMeals, temp)
            } else {
                const temp = {
                    name: element.name,
                    calories: calories,
                    carbohydrate: element.carbohydrate * size / element.size,
                    fat: element.fat * size / element.size,
                    fiber: element.fiber * size / element.size,
                    protein: element.protein * size / element.size,
                    size: size,
                    sugars: element.sugars * size / element.size,
                    element: element
                }
                listOfIngredients.push(...listOfIngredients, temp)
            }
        })
        const listOfElements = listOfMeals.concat(listOfIngredients)

        const informationAboutMeal = {
            ingredients: listOfElements,
            calories: Math.round((elements.reduce((a, v) => a = a + v.calories, 0)) * 100) / 100,
            carbohydrate: Math.round((elements.reduce((a, v) => a = a + v.element.carbohydrate, 0)) * 100) / 100,
            fat: Math.round((elements.reduce((a, v) => a = a + v.element.fat, 0)) * 100) / 100,
            protein: Math.round((elements.reduce((a, v) => a = a + v.element.protein, 0)) * 100) / 100,
            sugars: Math.round((elements.reduce((a, v) => a = a + v.element.sugars, 0)) * 100) / 100,
            fiber: Math.round((elements.reduce((a, v) => a = a + v.element.fiber, 0)) * 100) / 100,
        }

        if (elements.length > 0) {
            try {
                const calendarRef = doc(db, "users", userID, "calendar", day);
                switch (typeMeal) {
                    case "Breakfast":
                        setDoc(calendarRef, {
                            "Breakfast": informationAboutMeal
                        }, { merge: true })
                        break;
                    case "Lunch":
                        setDoc(calendarRef, {
                            "Lunch": informationAboutMeal
                        }, { merge: true })
                        break;
                    case "Dinner":
                        setDoc(calendarRef, {
                            "Breakfast": informationAboutMeal
                        }, { merge: true })
                        break;
                    case "Supper":
                        setDoc(calendarRef, {
                            "Breakfast": informationAboutMeal
                        }, { merge: true })
                        break;
                    case "Snacks":
                        setDoc(calendarRef, {
                            "Breakfast": informationAboutMeal
                        }, { merge: true })
                        break;
                    default:
                    // code block
                }


                showToast("success", "top", "Success!", "Super! " + typeMeal + " added correctly! :)")
                navigation.replace("Home")
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error ocured: ", errorCode, errorMessage);
                // showToast("error", "top", "Error!", "We have a problem with adding " + name + " :(")
            }
        } else {
            showToast("error", "top", "Error!", "Enter the elements for the meal")

        }

    }

    const handleAddNewPosition = () => {
        navigation.navigate("Add element", {
            elementsData: elements, typeMeal: route.params.typeMeal, date: route.params.date
        })
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.containerBox}>
                <View style={styles.box}>
                    <Text style={styles.textTitle}>Plan {route.params.typeMeal}</Text>
                    <Text style={styles.textTitle}>{route.params.date}</Text>
                    {elements.length > 0 &&
                        <Text style={styles.text}>List of ingredients</Text>
                    }
                    {elements.length > 0 && elements.map(({ element, size, calories, typeElement }) => (
                        <View style={styles.elementBox}>
                            <View style={styles.elementNameBox}>
                                <View width="90%" alignItems="center">
                                    <Text style={styles.elementText}>{element.name}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.buttonRemoveElement}
                                    onPress={(e) => handleRmoveElement(e, element)}
                                >
                                    <Text style={styles.buttonRemoveText}>x</Text>
                                </TouchableOpacity>

                            </View>
                            {typeElement == "meal" ?
                                <View style={styles.sizeCaloriesBox}>
                                    <View style={styles.elementPortionBox}>
                                        <Text style={styles.elementPortionText}>1 portion</Text>
                                    </View>
                                    <View style={styles.elementCaloriesBox}>
                                        <Text style={styles.elementCaloriesText}>{calories} kcal</Text>
                                    </View>
                                </View>
                                :
                                <View style={styles.sizeCaloriesBox}>
                                    <View style={styles.elementPortionBox}>
                                        <Text style={styles.elementPortionText}>{size} g</Text>
                                    </View>
                                    <View style={styles.elementCaloriesBox}>
                                        <Text style={styles.elementCaloriesText}>{calories} kcal</Text>
                                    </View>
                                </View>
                            }

                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.buttonAddIngredient}
                        onPress={(e) => handleAddNewPosition(e)}
                    >
                        <Text style={styles.buttonAddIngredientText}>Add New Position</Text>
                    </TouchableOpacity>

                    <Text style={styles.text}>Nutritional values</Text>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Total calories</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{elements.length > 0 ? Math.round((elements.reduce((a, v) => a = a + v.calories, 0)) * 100) / 100 : 0} kcal</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Carbohydrate</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{elements.length > 0 ? Math.round((elements.reduce((a, v) => a = a + v.element.carbohydrate, 0)) * 100) / 100 : 0} g</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Fat</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{elements.length > 0 ? Math.round((elements.reduce((a, v) => a = a + v.element.fat, 0)) * 100) / 100 : 0}  g</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Protein</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{elements.length > 0 ? Math.round((elements.reduce((a, v) => a = a + v.element.protein, 0)) * 100) / 100 : 0}  g</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Sugars</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{elements.length > 0 ? Math.round((elements.reduce((a, v) => a = a + v.element.sugars, 0)) * 100) / 100 : 0}  g</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Fiber</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{elements.length > 0 ? Math.round((elements.reduce((a, v) => a = a + v.element.fiber, 0)) * 100) / 100 : 0}  g</Text>
                        </View>
                    </View>


                    {elements.length > 0 &&
                        <TouchableOpacity
                            style={styles.button}
                            onPress={(e) => handleSave(e)}
                        >
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                    }

                </View>

            </View>

        </ScrollView>
    )
}

export default PlanMeal;

const styles = StyleSheet.create({
    scrollView: {
        display: 'flex',
        alignItems: 'center',
        padding: 5,
    },
    containerBox: {
        width: '90%',
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        paddingBottom: 30,
        paddingTop: 30,
        marginTop: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    box: {
        width: '90%',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        backgroundColor: '#2B255A1A',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 2,
        marginBottom: 15,
        color: '#2B255A',
    },
    textTitle: {
        fontWeight: '700',
        fontSize: 18,
        color: '#2B255A',
        marginBottom: 5,
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
    button: {
        marginTop: 30,
        backgroundColor: '#2B255A',
        width: '70%',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonSearch: {
        backgroundColor: "#2B255A80",
        width: '50%',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonSearchText: {
        color: '#2B255A',
        fontWeight: '700',
        fontSize: 16,
    },
    searchBox: {
        width: "80%",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginBottom: 10
    },
    elementBox: {
        flexDirection: "row",
        width: '80%',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 10,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 10,
        flexDirection: "column"
    },
    elementNameBox: {
        width: "100%",
        justifyContent: "space-between",
        marginTop: 5,
        marginBottom: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    sizeCaloriesBox: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#2B255A80",
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        alignItems: "center"
    },
    elementPortionBox: {
        width: '50%',
        backgroundColor: '#2B255A',
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        paddingVertical: 10,
        alignItems: "center"
    },
    elementCaloriesBox: {
        width: '50%',
        alignItems: "center",
        justifyContent: "center"
    },
    elementText: {
        fontWeight: '300',
        fontSize: 14,
        color: '#2B255A',
        textAlign: 'justify',
    },
    elementPortionText: {
        fontWeight: '700',
        fontSize: 14,
        color: 'white',
        textAlign: 'justify',
    },
    elementCaloriesText: {
        fontWeight: '700',
        fontSize: 14,
        color: '#2B255A',
        textAlign: 'justify',
    },
    buttonAddIngredient: {
        width: "80%",
        backgroundColor: "white",
        padding: 10,
        marginTop: 15,
        marginBottom: 20,
        borderColor: '#2B255A',
        borderWidth: 3,
        borderStyle: "dashed",
        borderRadius: 20,
        alignItems: "center"
    },
    buttonAddIngredientText: {
        fontWeight: '700',
        fontSize: 14,
        color: '#2B255A',
        textAlign: 'justify'
    },
    buttonRemoveElement: {
        width: "10%",
        alignContent: "flex-end",
    },
    buttonRemoveText: {
        fontWeight: '700',
        fontSize: 18,
        color: '#2B255A',
        textAlign: 'justify',
    },
    nutritionalBox: {
        flexDirection: "row",
        width: '80%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 10
    },
    nutritionalTitleBox: {
        marginLeft: 10
    },
    nutritionalTitleText: {
        fontWeight: '300',
        fontSize: 14,
        color: '#2B255A',
        textAlign: 'justify',
        marginStart: 10
    },
    nutritionalValueBox: {
        width: '40%',
        backgroundColor: '#2B255A',
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        paddingVertical: 10,
        alignItems: "center"
    },
    nutritionalValueText: {
        fontWeight: '700',
        fontSize: 14,
        color: 'white',
        textAlign: 'justify',
    },

});