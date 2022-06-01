import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../../configs/firebase'
import { getErrorMessage } from "../../utils/ErrorUtils";
import { isEmpty, validateEmail, matchPassword, showToast } from "../../utils/ValidateUtils";

const RegistrationScreen = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Parameters")
            }
        })

        return unsubscribe
    }, [])

    const createNewUser = (uid) => {
        try {
            const docRef = setDoc(doc(db, "users", uid), {
                name: name,
                email: email
            });
            console.log("Document written with ID: ", uid);
            showToast("success", "top", "Success!", "Super! You have registered correctly! :)")
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error ocured: ", errorCode, errorMessage);
            showToast("error", "top", "Error!", "We have a problem registering you :(")
        }
    }

    const handleSignUp = () => {
        if (!isEmpty(name, "Please enter your name")
            && !isEmpty(email, "Please enter your e-mail")
            && !isEmpty(password, "Please enter your password")
            && validateEmail(email)
            && matchPassword(password, repeatPassword)) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    createNewUser(user.uid)
                    navigation.replace("Parameters")
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("Error ocured: ", errorCode, errorMessage);
                    showToast("error", "top", "Error!", getErrorMessage(error.code))
                });
        }
    }

    const handleLogin = () => {
        navigation.replace("Login")
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
        // behavior="padding"
        >
            <Image source={require('../img/logo.jpg')} style={styles.logo} />
            <View style={styles.boxContainer}>
                <Text style={styles.textTitle}>Create Account</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>or use your email for registration:</Text>
                    <TextInput
                        placeholder="Name"
                        style={styles.input}
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                    <TextInput
                        placeholder="Email"
                        style={styles.input}
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                    <TextInput
                        placeholder="Password"
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />
                    <TextInput
                        placeholder="Repeat password"
                        style={styles.input}
                        secureTextEntry
                        value={repeatPassword}
                        onChangeText={text => setRepeatPassword(text)}
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignUp}
                >
                    <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.textRegistrationBox} onPress={handleLogin}>
                <Text style={styles.text}> Already have an account? </Text>
                <Text style={styles.textRegistration}> Log in </Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>

    )
}

export default RegistrationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: -50,
        borderRadius: 99999,
        zIndex: 1
    },
    boxContainer: {
        width: '80%',
        backgroundColor: '#2B255A26',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        paddingBottom: 30
    },
    textTitle: {
        fontWeight: '700',
        fontSize: 20,
        color: '#2B255A',
        marginTop: 70,
        marginBottom: 30,
    },
    inputContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        alignItems: 'center',
        paddingBottom: 20,
        marginBottom: 10,
    },
    text: {
        fontWeight: '300',
        fontSize: 14,
        color: '#2B255A',
        marginTop: 10,
        marginBottom: 15,
    },
    input: {
        width: '90%',
        backgroundColor: '#2B255A1A',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 2,
        marginBottom: 10,
    },
    button: {
        marginTop: 30,
        backgroundColor: '#2B255A',
        width: '70%',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#2B255A',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#2B255A',
        fontWeight: '700',
        fontSize: 16,
    },
    textRegistrationBox: {
        marginTop: 30,
        flexDirection: 'row',
    },
    textRegistration: {
        fontWeight: '700',
        fontSize: 14,
        color: '#2B255A',
        marginTop: 10,
        marginBottom: 15,
    }
})