import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { auth, db, collection, setDoc, doc } from '../configs/firebase'


const ParameterScreen = () => {
    const navigation = useNavigation()

    const [gender, setGender] = useState("woman");
    const [age, setAge] = useState("30");
    const [height, setHeight] = useState("180");
    const [weight, setWight] = useState("80");
    const [activity, setActivity] = useState("1");
    const [dietObject, setDietObject] = useState("1");

    const [BMR, setBMR] = useState(0)
    const [TMR, setTMR] = useState(0)
    const [calorie, setCalorie] = useState(0)

    const [result, setResults] = useState(false);

    const calculateBMR = () => {
        let W, H, A, X
        switch (gender) {
            case "woman":
                W = 9.247
                H = 3.098
                A = 4.330
                X = 447.593
                break;

            case "man":
                W = 13.397
                H = 4.799
                A = 5.677
                X = 88.362
                break;

            default:
                break;
        }
        return Math.round(W * weight + H * height - A * age + X)
    }

    const calculateTMR = () => {
        let activityValue = null
        switch (activity) {
            case "1":
                activityValue = 1.2
                break;
            case "2":
                activityValue = 1.3
                break;
            case "3":
                activityValue = 1.4
                break;
            case "4":
                activityValue = 1.5
                break;
            case "5":
                activityValue = 1.75
                break;
            case "6":
                activityValue = 2.0
                break;
            case "7":
                activityValue = 2.2
                break;
            case "8":
                activityValue = 2.4
                break;
            default:
                break;
        }
        return activityValue * calculateBMR()
    }

    const calculateCalories = () => {
        let caloricCorrection = null
        switch (dietObject) {
            case "1":
                caloricCorrection = -300
                break;
            case "2":
                caloricCorrection = 0
                break;
            case "3":
                caloricCorrection = 300
                break;
            default:
                break;
        }
        return calculateTMR() + caloricCorrection
    }

    const addParameterUser = (uid) => {
        const current = new Date();
        const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()}`;

        const parameter = {
            gender: gender,
            age: age,
            height: height,
            weight: weight,
            activityLevel: activity,
            dietObject: dietObject,
            basalMetabolicRate: BMR,
            totalMetabolicRate: TMR,
            calorie: calorie
        }

        console.log(date);
        console.log(parameter);

        try {
            const docRef = doc(db, "users", uid, "parameters", date);
            setDoc(docRef, parameter);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const handleCalculate = (e) => {
        e.preventDefault(e);

        setBMR(calculateBMR())
        setTMR(calculateTMR())
        setCalorie(calculateCalories())

        setResults(true)
    }

    const handleSave = (e) => {
        e.preventDefault(e);

        auth.onAuthStateChanged((user) => {
            if (user) {
                addParameterUser(user.uid)
                console.log("Add to: ", user.uid, " parameters diet")
            } else {
                console.log("User is signed out")
            }
        })

        navigation.replace("Home")
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.containerBox}>
                <View style={styles.box}>
                    <Text style={styles.textTitle}>BMR and TMR Calculator</Text>
                    <Text style={styles.text}>Just fill in the form below and correctly enter your gender, age, height, weight, physical, activity level and diet goal. Based on your information we will choose the right diet for you.</Text>
                    <Text style={styles.textForm}>Gender</Text>
                    <Picker
                        selectedValue={gender}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                    >
                        <Picker.Item label="Man" value="man" />
                        <Picker.Item label="Woman" value="woman" />
                    </Picker>
                    <Text style={styles.text}>Age</Text>
                    <TextInput
                        placeholder="Age"
                        style={styles.input}
                        keyboardType="numeric"
                        value={age}
                        defaultValue={age}
                        onChangeText={text => setAge(text)}
                    />
                    <Text style={styles.text}>Height</Text>
                    <TextInput
                        placeholder="Height"
                        style={styles.input}
                        keyboardType="numeric"
                        value={height}
                        defaultValue={height}
                        onChangeText={text => setHeight(text)}
                    />
                    <Text style={styles.text}>Weight</Text>
                    <TextInput
                        placeholder="Weight"
                        style={styles.input}
                        keyboardType="numeric"
                        value={weight}
                        defaultValue={weight}
                        onChangeText={text => setWight(text)}
                    />
                    <Text style={styles.text}>Activity Level</Text>
                    <Picker
                        selectedValue={activity}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) => setActivity(itemValue)}
                    >
                        <Picker.Item label="Patient lying in bed, very low activity" value="1" />
                        <Picker.Item label="Sedentary job, minimal activity during the day" value="2" />
                        <Picker.Item label="Sedentary job, medium activity, light exercise 3 times a week" value="3" />
                        <Picker.Item label="Lots of movement during the day, light training" value="4" />
                        <Picker.Item label="Lots of movement during the day, heavy, regular training" value="5" />
                        <Picker.Item label="Physical work, lots of movement after work" value="6" />
                        <Picker.Item label="Physical work, light training" value="7" />
                        <Picker.Item label="Physical work, heavy workouts" value="8" />
                    </Picker>
                    <Text style={styles.text}>Object of the diet</Text>
                    <Picker
                        selectedValue={dietObject}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) => setDietObject(itemValue)}
                    >
                        <Picker.Item label="Weight reduction" value="1" />
                        <Picker.Item label="Weight maintenancey" value="2" />
                        <Picker.Item label="Weight gain" value="3" />
                    </Picker>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={(e) => handleCalculate(e)}
                    >
                        <Text style={styles.buttonText}>CALCULATE</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {result &&
                <View style={styles.containerBox}>
                    <View style={styles.box}>
                        <Text style={styles.textTitle}>Harris-Benedict formula results</Text>
                        <Text style={styles.text}>Your Basal Metabolic Rate (BMR):</Text>
                        <View style={styles.resultBox}><Text style={styles.textResult}>{BMR}</Text></View>
                        <Text style={styles.text}>Basal Metabolic Rate (BMR) is the amount of calories your body needs to sustain basic life functions.</Text>
                        <Text style={styles.text}>Your Total Metabolic Rate (TMR):</Text>
                        <View style={styles.resultBox}><Text style={styles.textResult}>{TMR}</Text></View>
                        <Text style={styles.text}>Total Caloric Metabolism (TCM) is the average amount of calories your body needs for activity throughout the day. </Text>
                        <Text style={styles.textTitle}>Suggested diet</Text>
                        <Text style={styles.text}>Your calorie requirements are:</Text>
                        <View style={styles.resultBox}><Text style={styles.textResult}>{calorie}</Text></View>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={(e) => handleSave(e)}
                    >
                        <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>

                </View>
            }

        </ScrollView>
    )
}

export default ParameterScreen;

const styles = StyleSheet.create({
    scrollView: {
        display: 'flex',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 30
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
    picker: {
        height: 50,
        width: '80%',
    },
    input: {
        width: '80%',
        // backgroundColor: '#2B255A1A',
        // borderRadius: 10,
        // paddingHorizontal: 20,
        // paddingVertical: 2,
        // marginBottom: 10,
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
})