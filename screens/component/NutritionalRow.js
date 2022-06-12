import React, { useEffect, useState } from "react";
import { Popover, Button, Box, Center, NativeBaseProvider } from "native-base";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { db, auth, onAuthStateChanged, doc, getDoc } from '../../configs/firebase'
import * as Progress from 'react-native-progress';

const NutririonalRow = ({ title, value, maxValue }) => {
    function getProgressBarColor() {
        if (value >= maxValue - 0.1 * value && value <= maxValue + 0.1 * value) {
            return "#9FD276"
        } else if (value > maxValue + 0.1 * value) {
            return "#E76057"
        }

        return "#2B255A"
    }

    return (
        <Box style={styles.box}>
            <View style={styles.view}>
                <Text style={styles.text}>{title}</Text>
                <Text style={styles.text}>{value + " / " + maxValue + " g"}</Text>
            </View>

            <Progress.Bar
                progress={value / maxValue}
                width={250}
                height={15}
                color={getProgressBarColor()}
                unfilledColor="#C4C4C44D"
                borderWidth={0}
                borderRadius={10} />

        </Box>
    )

}

export default NutririonalRow;

const styles = StyleSheet.create({
    box: {
        alignItems: "center",
        marginTop: 15
    },
    view: {
        width: 250,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {
        fontWeight: '300',
        fontSize: 14,
        color: '#2B255A',
        textAlign: 'justify',
        marginTop: 5,
        marginBottom: 2,
    },
});