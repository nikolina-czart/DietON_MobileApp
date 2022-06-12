
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import IngredientServices from '../../services/IngredientServices';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../../configs/firebase";
import { async } from '@firebase/util';
import IngredientNutririonalRow from '../component/IngredientNutritionalRow';
const Tabs = AnimatedTabBarNavigator();

const IngredientScreen = ({ ingredient }) => {

    return (
        <View style={styles.box}>
            <Text style={styles.textTitle}>{ingredient.name}</Text>
            <IngredientNutririonalRow name={"Calories"} value={ingredient.calories} unit="kcal" />
            <IngredientNutririonalRow name={"Size"} value={ingredient.size} unit="g" />
            <IngredientNutririonalRow name={"Protein"} value={ingredient.protein} unit="g" />
            <IngredientNutririonalRow name={"Fat"} value={ingredient.fat} unit="g" />
            <IngredientNutririonalRow name={"Carbo"} value={ingredient.carbohydrate} unit="g" />
            <IngredientNutririonalRow name={"Fiber"} value={ingredient.fiber} unit="g" />
            <IngredientNutririonalRow name={"Sugars"} value={ingredient.sugars} unit="g" />
        </View>
    )
}

export default IngredientScreen

const styles = StyleSheet.create({
    box: {
        width: "40%",
        backgroundColor: "white",
        padding: 10,
        display: "flex",
        alignItems: 'center',
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        margin: 5,
        borderRadius: 20
    },
    textTitle: {
        fontWeight: '700',
        fontSize: 14,
        color: '#2B255A',
        marginBottom: 5,
    },
})