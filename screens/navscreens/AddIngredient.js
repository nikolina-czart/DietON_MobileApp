
import React, { useEffect, useState, Component } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
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
import { auth, db, createUserWithEmailAndPassword, setDoc, doc, addDoc, collection } from '../../configs/firebase'

const Tabs = AnimatedTabBarNavigator();

const AddIngredient = () => {
    const navigation = useNavigation()

    const [name, setName] = useState("");
    const [calories, setCalories] = useState(0);
    const [carbohydrate, setCarbohydrate] = useState(0);
    const [fat, setFat] = useState(0);
    const [fiber, setFiber] = useState(0);
    const [protein, setProtein] = useState(0);
    const [size, setSize] = useState(0);
    const [sugars, setSugars] = useState(0);


    const handleSave = () => {
        if (
            !isEmpty(name, "Please enter the name of the ingredient") &&
            !isEmpty(calories, "Please enter the calories of the ingredient") &&
            !isEmpty(size, "Please enter the size of the ingredient") &&
            !isEmpty(protein, "Please enter the protein of the ingredient") &&
            !isEmpty(fat, "Please enter the fat of the ingredient") &&
            !isEmpty(carbohydrate, "Please enter the carbohydrate of the ingredient") &&
            !isEmpty(sugars, "Please enter the sugars of the ingredient") &&
            !isEmpty(fiber, "Please enter the fiber of the ingredient")
        ) {
            try {
                const docRef = addDoc(collection(db, "ingredients"), {
                    name: name,
                    calories: calories,
                    carbohydrate: carbohydrate,
                    fat: fat,
                    fiber: fiber,
                    protein: protein,
                    size: size,
                    sugars: sugars
                });
                showToast("success", "top", "Success!", "Super! " + name + " added correctly! :)")
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error ocured: ", errorCode, errorMessage);
                showToast("error", "top", "Error!", "We have a problem with adding " + name + " :(")
            }
        }

    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.containerBox}>
                <View style={styles.box}>
                    <Text style={styles.textTitle}>Add New Ingredient</Text>
                    <Text style={styles.text}>Enter the appropriate nutrients of the ingredient</Text>
                    <Text style={styles.text}>Ingredient name</Text>
                    <TextInput
                        placeholder="Ingredient name"
                        style={styles.input}
                        keyboardType="text"
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                    <Text style={styles.text}>Calories</Text>
                    <TextInput
                        placeholder="Calories"
                        style={styles.input}
                        keyboardType="numeric"
                        value={calories}
                        defaultValue={calories}
                        onChangeText={number => setCalories(number)}
                    />
                    <Text style={styles.text}>Size</Text>
                    <TextInput
                        placeholder="Size"
                        style={styles.input}
                        keyboardType="numeric"
                        value={size}
                        defaultValue={size}
                        onChangeText={number => setSize(number)}
                    />
                    <Text style={styles.text}>Protein</Text>
                    <TextInput
                        placeholder="Protein"
                        style={styles.input}
                        keyboardType="numeric"
                        value={protein}
                        defaultValue={protein}
                        onChangeText={number => setProtein(number)}
                    />
                    <Text style={styles.text}>Fat</Text>
                    <TextInput
                        placeholder="Fat"
                        style={styles.input}
                        keyboardType="numeric"
                        value={fat}
                        defaultValue={fat}
                        onChangeText={number => setFat(number)}
                    />
                    <Text style={styles.text}>Carbohydrate</Text>
                    <TextInput
                        placeholder="Carbohydrate"
                        style={styles.input}
                        keyboardType="numeric"
                        value={carbohydrate}
                        defaultValue={carbohydrate}
                        onChangeText={number => setCarbohydrate(number)}
                    />
                    <Text style={styles.text}>Sugars</Text>
                    <TextInput
                        placeholder="Sugars"
                        style={styles.input}
                        keyboardType="numeric"
                        value={sugars}
                        defaultValue={sugars}
                        onChangeText={number => setSugars(number)}
                    />
                    <Text style={styles.text}>Fiber</Text>
                    <TextInput
                        placeholder="Fiber"
                        style={styles.input}
                        keyboardType="numeric"
                        value={fiber}
                        defaultValue={fiber}
                        onChangeText={number => setFiber(number)}
                    />

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

export default AddIngredient;

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
        marginBottom: 10,
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
});
