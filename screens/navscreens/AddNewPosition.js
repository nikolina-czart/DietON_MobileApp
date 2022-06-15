
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
import { auth, db, createUserWithEmailAndPassword, setDoc, doc, addDoc } from '../../configs/firebase'
import { collection, query, where, getDocs } from "firebase/firestore";

const AddNewPosition = ({ route }) => {
    const navigation = useNavigation()

    const [search, setSearch] = useState("")
    const [isSearch, setIsSearch] = useState(false)
    const [ingredients, setIngredients] = useState([]);
    const [ingredientSelected, setIngredientSelected] = useState([])
    const [ingredientCalories, setIngredientCalories] = useState(0)
    const [ingredientSize, setIngredientSize] = useState(0)
    const [selectedData, setSelectedData] = useState(route.params.mealsData)

    const [selected, setSelected] = useState(false);


    const handleSearch = async () => {
        setIsSearch(true)

        setIngredientCalories(0)
        setIngredientSize(0)
        if (search) {
            setSelected(false)

            try {
                const first = query(collection(db, "ingredients"), where('name', '>=', search.toLowerCase()), where('name', '<=', search.toLowerCase() + '\uf8ff'));
                const documentSnapshots = await getDocs(first);

                let ingredients = [];

                documentSnapshots.forEach((doc) => {
                    ingredients.push({
                        id: doc.id,
                        calories: doc.data().calories,
                        carbohydrate: doc.data().carbohydrate,
                        fat: doc.data().fat,
                        fiber: doc.data().fiber,
                        name: doc.data().name,
                        protein: doc.data().protein,
                        size: doc.data().size,
                        sugars: doc.data().sugars
                    });
                });


                setIngredients(ingredients)
                return { ingredients: ingredients };
            } catch (e) {
                console.log(e);
                showToast("error", "top", "Error!", "We do not have such a ingredient " + search + " in the base :(")
            }
        } else {
            setIsSearch(false)
        }
    }

    const handleSelectedIngredient = (e, ingredient) => {
        setSelected(true)
        setIngredientSelected(ingredient)
    }

    const setSizeSelectedIngredient = (size) => {
        setIngredientSize(size)
        setIngredientCalories(size * ingredientSelected.calories / ingredientSelected.size)
    }

    const handleSave = () => {
        const selectObject = {
            ingredient: ingredientSelected,
            size: ingredientSize,
            calories: ingredientCalories
        }
        const temp = []
        temp.push(...selectedData, selectObject);
        setSelectedData(temp)

        navigation.replace("AddMeal", { meals: temp })
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.containerBox}>
                <View style={styles.box}>
                    <Text style={styles.textTitle}>Add New Position</Text>
                    <Text style={styles.text}>Search for ingredient</Text>
                    <TextInput
                        placeholder="Search"
                        style={styles.input}
                        keyboardType="text"
                        onChangeText={text => setSearch(text)}
                    />
                    <View style={styles.searchBox}>
                        <TouchableOpacity
                            style={styles.buttonSearch}
                            onPress={(e) => handleSearch(e)}
                        >
                            <Text style={styles.buttonSearchText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                    {isSearch &&
                        (<Text style={styles.text}>Search for ingredient</Text>)
                    }
                    {ingredients && ingredients.map((ingredient) => (
                        <TouchableOpacity
                            style={styles.elementBox}
                            onPress={(e) => handleSelectedIngredient(e, ingredient)}>
                            <View style={styles.elementNameBox}>
                                <Text style={styles.elementText}>{ingredient.name}</Text>
                            </View>
                            <View style={styles.sizeCaloriesBox}>
                                <View style={styles.elementPortionBox}>
                                    <Text style={styles.elementPortionText}>{ingredient.size} g</Text>
                                </View>
                                <View style={styles.elementCaloriesBox}>
                                    <Text style={styles.elementCaloriesText}>{ingredient.calories} kcal</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {selected &&
                <View style={styles.containerBox}>
                    <View style={styles.box}>
                        <Text style={styles.textTitle}>Selected ingredient</Text>
                        <View style={styles.elementBox}>
                            <View style={styles.elementNameBox}>
                                <Text style={styles.elementText}>{ingredientSelected.name}</Text>
                            </View>
                            <View style={styles.sizeCaloriesBox}>
                                <View style={styles.elementPortionBox}>
                                    <Text style={styles.elementPortionText}>{ingredientSelected.size} g</Text>
                                </View>
                                <View style={styles.elementCaloriesBox}>
                                    <Text style={styles.elementCaloriesText}>{ingredientSelected.calories} kcal</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.text}>Quantity of ingredient {ingredientSelected.name} [g]</Text>
                        <TextInput
                            placeholder="Size"
                            style={styles.input}
                            keyboardType="numeric"
                            onChangeText={text => setSizeSelectedIngredient(text)}
                        />
                        <Text style={styles.text}>Calories per serving {ingredientSelected.name} [kcal]</Text>
                        <Text style={styles.input}>{ingredientCalories}</Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={(e) => handleSave(e)}
                        >
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </ScrollView>
    )
}

export default AddNewPosition;

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
        marginTop: 5,
        marginBottom: 5
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

});