import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { auth, signInWithEmailAndPassword } from '../../configs/firebase'
import { getErrorMessage } from "../../utils/ErrorUtils";
import { isEmpty, validateEmail, matchPassword, showToast } from "../../utils/ValidateUtils";


const LoginScreen = () => {
    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home")
            }
        })

        return unsubscribe
    }, [])

    const handleLogin = () => {

        if (!isEmpty(email, "Please enter your e-mail") && !isEmpty(password, "Please enter your password") && validateEmail(email)) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    showToast("success", "top", "Success!", "Welcome back! Correct login!")
                    console.log("Singed in user: ", user);
                })
                .catch((error) => {
                    showToast("error", "top", "Error!", getErrorMessage(error.code))
                });

        }
    }

    const handleRegistration = () => {
        navigation.replace("Registration")
    }

    return (

        <KeyboardAvoidingView
            style={styles.container}
        // behavior="padding"
        >
            <Image source={require('../img/logo.jpg')} style={styles.logo} />
            <View style={styles.boxContainer}>
                <Text style={styles.textTitle}>Sign in to Dieton</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>or use your email account</Text>
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
                </View>

                <Text style={styles.text}>Forgot your password?</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>LOG IN</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.textRegistrationBox} onPress={handleRegistration}>
                <Text style={styles.text}> Don't have an account? </Text>
                <Text style={styles.textRegistration}> Sign Up </Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    )
}

export default LoginScreen;

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