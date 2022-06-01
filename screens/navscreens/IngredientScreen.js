
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";



const Tabs = AnimatedTabBarNavigator();

const IngredientScreen = () => {
    const navigation = useNavigation()


    return (

        <KeyboardAvoidingView
            style={styles.container}
        // behavior="padding"
        >
            <Text style={styles.textTitle}>Scren 3</Text>
        </KeyboardAvoidingView>
    )
}

export default IngredientScreen

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