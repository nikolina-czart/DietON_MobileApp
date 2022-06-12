import React, { useEffect, useState } from "react";
import { Popover, Button, Box, Center, NativeBaseProvider } from "native-base";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { db, auth, onAuthStateChanged, doc, getDoc } from '../../configs/firebase'
import * as Progress from 'react-native-progress';

const IngredientNutririonalRow = ({ name, value, unit }) => {
    console.log(value)
    return (
        <>
            <View style={styles.box}>
                <Text style={styles.text}>{name}</Text>
                <View style={styles.boxValue}>
                    <Text style={styles.textValue}>{value + " " + unit}</Text>
                </View>

            </View>
        </>

    )

}

export default IngredientNutririonalRow;

const styles = StyleSheet.create({
    box: {
        marginVertical: 4,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        backgroundColor: "white",
        borderRadius: 20,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.20,
        // shadowRadius: 1.41,
        // elevation: 2,
        justifyContent: "space-between"
    },
    view: {
        width: 250,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {
        marginLeft: 2,
        fontWeight: '300',
        fontSize: 12,
        color: '#2B255A',
        textAlign: 'justify',
        marginTop: 5,
        marginBottom: 2,
    },
    textValue: {
        fontWeight: '500',
        fontSize: 12,
        color: 'white',
        textAlign: 'justify',
        marginTop: 5,
        marginBottom: 2,
    },
    boxValue: {
        width: "50%",
        height: "100%",
        backgroundColor: '#2B255A',
        alignItems: "center",
        borderBottomRightRadius: 15,
        borderTopLeftRadius: 15,
    }
});