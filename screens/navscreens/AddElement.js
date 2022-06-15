
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

const AddElement = ({ route }) => {
    const navigation = useNavigation()

    const [search, setSearch] = useState("")
    const [isSearch, setIsSearch] = useState(false)
    const [elements, setElements] = useState([]);

    const [elementSelected, setElementSelected] = useState([])
    const [ingredientCalories, setIngredientCalories] = useState(0)
    const [ingredientSize, setIngredientSize] = useState(0)
    const [selectedData, setSelectedData] = useState(route.params.elementsData)

    const [selected, setSelected] = useState(false);


    const handleSearch = async () => {
        setIsSearch(true)

        setIngredientCalories(0)
        setIngredientSize(0)
        if (search) {
            setSelected(false)

            try {
                const mealDocs = query(collection(db, "meals"), where('name', '>=', search), where('name', '<=', search + '\uf8ff'));
                const ingredientDocs = query(collection(db, "ingredients"), where('name', '>=', search), where('name', '<=', search + '\uf8ff'));
                const documentSnapshotsMeals = await getDocs(mealDocs);
                const documentSnapshotsIngredients = await getDocs(ingredientDocs);


                let tempMeals = [];
                let tempIngredients = [];

                documentSnapshotsMeals.forEach((doc) => {
                    tempMeals.push({
                        name: doc.data().name,
                        time: doc.data().time,
                        recipe: doc.data().recipe,
                        ingredients: doc.data().ingredients,
                        calories: doc.data().calories,
                        carbohydrate: doc.data().carbohydrate,
                        fat: doc.data().fat,
                        protein: doc.data().protein,
                        sugars: doc.data().sugars,
                        fiber: doc.data().fiber,
                        typeElement: "meal"
                    })
                });

                documentSnapshotsIngredients.forEach((doc) => {
                    tempIngredients.push({
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

                let temp = tempMeals.concat(tempIngredients);

                setElements(temp)
                return { elements: temp };
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
        setElementSelected(ingredient)
    }

    const setSizeSelectedIngredient = (size) => {
        setIngredientSize(size)
        setIngredientCalories(size * elementSelected.calories / elementSelected.size)
    }

    const handleSave = () => {
        const temp = []
        if (elementSelected.typeElement == "meal") {
            const selectObject = {
                element: elementSelected,
                calories: elementSelected.calories,
                size: "1 portion",
                typeElement: elementSelected.typeElement
            }
            temp.push(...selectedData, selectObject);
        } else {
            const selectObject = {
                element: elementSelected,
                calories: ingredientCalories,
                size: ingredientSize,
                typeElement: elementSelected.typeElement
            }
            temp.push(...selectedData, selectObject);
        }

        setSelectedData(temp)

        navigation.replace("Plan meal", {
            meals: temp, date: route.params.date, typeMeal: route.params.typeMeal
        })
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.containerBox}>
                <View style={styles.box}>
                    <Text style={styles.textTitle}>Compose your {route.params.typeMeal}</Text>
                    <Text style={styles.textTitle}>{route.params.date}</Text>
                    <Text style={styles.text}>Search for meal's element</Text>
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
                    {elements && elements.map((element) => (
                        <TouchableOpacity
                            style={styles.elementBox}
                            onPress={(e) => handleSelectedIngredient(e, element)}>
                            {element.typeElement == "meal" ?
                                <>
                                    <View style={styles.elementNameBox}>
                                        <Text style={styles.elementText}>{element.name}</Text>
                                    </View>
                                    <View style={styles.sizeCaloriesBox}>
                                        <View style={styles.elementPortionBox}>
                                            <Text style={styles.elementPortionText}>1 portion</Text>
                                        </View>
                                        <View style={styles.elementCaloriesBox}>
                                            <Text style={styles.elementCaloriesText}>{element.calories} kcal</Text>
                                        </View>
                                    </View>
                                </>
                                :
                                <>
                                    <View style={styles.elementNameBox}>
                                        <Text style={styles.elementText}>{element.name}</Text>
                                    </View>
                                    <View style={styles.sizeCaloriesBox}>
                                        <View style={styles.elementPortionBox}>
                                            <Text style={styles.elementPortionText}>{element.size} g</Text>
                                        </View>
                                        <View style={styles.elementCaloriesBox}>
                                            <Text style={styles.elementCaloriesText}>{element.calories} kcal</Text>
                                        </View>
                                    </View>
                                </>
                            }
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {selected &&
                <View style={styles.containerBox}>
                    <View style={styles.box}>
                        <Text style={styles.textTitle}>Selected ingredient</Text>
                        {elementSelected.typeElement == "meal" ?
                            <>
                                <View style={styles.elementBox}>
                                    <View style={styles.elementNameBox}>
                                        <Text style={styles.elementText}>{elementSelected.name}</Text>
                                    </View>
                                    <View style={styles.sizeCaloriesBox}>
                                        <View style={styles.elementPortionBox}>
                                            <Text style={styles.elementPortionText}>1 portion</Text>
                                        </View>
                                        <View style={styles.elementCaloriesBox}>
                                            <Text style={styles.elementCaloriesText}>{elementSelected.calories} kcal</Text>
                                        </View>
                                    </View>
                                </View>
                            </>
                            :
                            <>
                                <View style={styles.elementBox}>
                                    <View style={styles.elementNameBox}>
                                        <Text style={styles.elementText}>{elementSelected.name}</Text>
                                    </View>
                                    <View style={styles.sizeCaloriesBox}>
                                        <View style={styles.elementPortionBox}>
                                            <Text style={styles.elementPortionText}>{elementSelected.size} g</Text>
                                        </View>
                                        <View style={styles.elementCaloriesBox}>
                                            <Text style={styles.elementCaloriesText}>{elementSelected.calories} kcal</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.text}>Quantity of ingredient {elementSelected.name} [g]</Text>
                                <TextInput
                                    placeholder="Size"
                                    style={styles.input}
                                    keyboardType="numeric"
                                    onChangeText={text => setSizeSelectedIngredient(text)}
                                />
                                <Text style={styles.text}>Calories per serving {elementSelected.name} [kcal]</Text>
                                <Text style={styles.input}>{ingredientCalories}</Text>
                            </>
                        }





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

export default AddElement;

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