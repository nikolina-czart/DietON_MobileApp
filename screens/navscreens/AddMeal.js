
import React, { useEffect, useState, Component } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView, Button } from 'react-native'
// import { auth, signInWithEmailAndPassword } from '../configs/firebase'
import { useNavigation } from '@react-navigation/core'
// import Toast, { ErrorToast } from 'react-native-toast-message'
// import { getErrorMessage } from "../utils/ErrorUtils";
// import { isEmpty, validateEmail, matchPassword, showToast } from "../utils/ValidateUtils";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import ActionButton from 'react-native-action-button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { isEmpty, showToast } from '../../utils/ValidateUtils';
import { auth, db, createUserWithEmailAndPassword, setDoc, doc, addDoc, collection } from '../../configs/firebase'


const Tabs = AnimatedTabBarNavigator();

const AddMeal = ({ route }) => {
    const navigation = useNavigation()

    const [name, setName] = useState("");
    const [preparationTime, setPreparationTime] = useState(0)
    const [recipe, setRecipe] = useState("")
    const [meals, setMeals] = useState([])


    useEffect(() => {
        setMeals(route.params.meals)
    }, [])

    const handleRmoveElement = (e, ingredient) => {
        setMeals(meals.filter(item => item.ingredient.name !== ingredient.name));
    }


    const handleSave = () => {
        const listOfIngredientsMeal = []

        meals.map(({ ingredient, size, calories }) => {
            const temp = {
                name: ingredient.name,
                calories: calories,
                carbohydrate: ingredient.carbohydrate * size / ingredient.size,
                fat: ingredient.fat * size / ingredient.size,
                fiber: ingredient.fiber * size / ingredient.size,
                protein: ingredient.protein * size / ingredient.size,
                size: size,
                sugars: ingredient.sugars * size / ingredient.size,
            }

            listOfIngredientsMeal.push(...listOfIngredientsMeal, temp)
        })

        if (
            !isEmpty(name, "Please enter the name of the meal") &&
            !isEmpty(preparationTime, "Please enter the preparation time of the meal") &&
            !isEmpty(recipe, "Please enter the recipe of the meal")
        ) {
            if (meals.length > 0) {
                try {
                    const docRef = addDoc(collection(db, "meals"), {
                        name: name,
                        time: preparationTime,
                        recipe: recipe,
                        ingredients: listOfIngredientsMeal,
                        calories: Math.round((meals.reduce((a, v) => a = a + v.calories, 0)) * 100) / 100,
                        carbohydrate: Math.round((meals.reduce((a, v) => a = a + v.ingredient.carbohydrate, 0)) * 100) / 100,
                        fat: Math.round((meals.reduce((a, v) => a = a + v.ingredient.fat, 0)) * 100) / 100,
                        protein: Math.round((meals.reduce((a, v) => a = a + v.ingredient.protein, 0)) * 100) / 100,
                        sugars: Math.round((meals.reduce((a, v) => a = a + v.ingredient.sugars, 0)) * 100) / 100,
                        fiber: Math.round((meals.reduce((a, v) => a = a + v.ingredient.fiber, 0)) * 100) / 100,

                    });
                    showToast("success", "top", "Success!", "Super! " + name + " added correctly! :)")
                    navigation.replace("Home")
                } catch (error) {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("Error ocured: ", errorCode, errorMessage);
                    showToast("error", "top", "Error!", "We have a problem with adding " + name + " :(")
                }
            } else {
                showToast("error", "top", "Error!", "Enter the ingredients for the meal")
            }
        }
    }

    const handleAddNewPosition = () => {
        navigation.replace("Add New Position", { mealsData: meals })
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.containerBox}>
                <View style={styles.box}>
                    <Text style={styles.textTitle}>Add New Meal</Text>
                    <Text style={styles.text}>Meal name</Text>
                    <TextInput
                        placeholder="Meal name"
                        style={styles.input}
                        keyboardType="text"
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                    <Text style={styles.text}>Preparation time [min]</Text>
                    <TextInput
                        placeholder="Preparation time"
                        style={styles.input}
                        keyboardType="numeric"
                        value={preparationTime}
                        onChangeText={text => setPreparationTime(text)}
                    />
                    <Text style={styles.text}>List of ingredients</Text>
                    {meals.length > 0 && meals.map(({ ingredient, size, calories }) => (
                        <View style={styles.elementBox}>
                            <View style={styles.elementNameBox}>
                                <View width="90%" alignItems="center">
                                    <Text style={styles.elementText}>{ingredient.name}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.buttonRemoveElement}
                                    onPress={(e) => handleRmoveElement(e, ingredient)}
                                >
                                    <Text style={styles.buttonRemoveText}>x</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={styles.sizeCaloriesBox}>
                                <View style={styles.elementPortionBox}>
                                    <Text style={styles.elementPortionText}>{size} g</Text>
                                </View>
                                <View style={styles.elementCaloriesBox}>
                                    <Text style={styles.elementCaloriesText}>{calories} kcal</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.buttonAddIngredient}
                        onPress={(e) => handleAddNewPosition(e)}
                    >
                        <Text style={styles.buttonAddIngredientText}>Add New Position</Text>
                    </TouchableOpacity>


                    <Text style={styles.text}>Enter recipe</Text>
                    <TextInput
                        placeholder="Recipe"
                        style={styles.input}
                        keyboardType="text"
                        multiline={true}
                        numberOfLines={4}
                        value={recipe}
                        onChangeText={text => setRecipe(text)}
                    />

                    <Text style={styles.text}>Nutritional values</Text>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Total calories</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{meals.length > 0 ? Math.round((meals.reduce((a, v) => a = a + v.calories, 0)) * 100) / 100 : 0} kcal</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Carbohydrate</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{meals.length > 0 ? Math.round((meals.reduce((a, v) => a = a + v.ingredient.carbohydrate, 0)) * 100) / 100 : 0} g</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Fat</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{meals.length > 0 ? Math.round((meals.reduce((a, v) => a = a + v.ingredient.fat, 0)) * 100) / 100 : 0}  g</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Protein</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{meals.length > 0 ? Math.round((meals.reduce((a, v) => a = a + v.ingredient.protein, 0)) * 100) / 100 : 0}  g</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Sugars</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{meals.length > 0 ? Math.round((meals.reduce((a, v) => a = a + v.ingredient.sugars, 0)) * 100) / 100 : 0}  g</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionalBox}>
                        <View style={styles.nutritionalTitleBox}>
                            <Text style={styles.nutritionalTitleText}>Fiber</Text>
                        </View>
                        <View style={styles.nutritionalValueBox}>
                            <Text style={styles.nutritionalValueText}>{meals.length > 0 ? Math.round((meals.reduce((a, v) => a = a + v.ingredient.fiber, 0)) * 100) / 100 : 0}  g</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={(e) => handleSave(e)}
                    >
                        <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default AddMeal;

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
    textForm: {
        fontWeight: '300',
        fontSize: 14,
        color: '#2B255A',
        textAlign: 'left',
    },
    textResult: {
        fontWeight: '700',
        fontSize: 18,
        color: '#2B255A',
        textAlignVertical: "center",
        textAlign: "center",
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
    resultBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        backgroundColor: '#2B255A26',
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        alignItems: 'center',
        justifyContent: "center",
        padding: 5,
        marginBottom: 10,
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
        marginTop: 10,
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
    }


});