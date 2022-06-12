
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import IngredientServices from '../../services/IngredientServices';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../../configs/firebase";
import { async } from '@firebase/util';
import Ingredient from "./Ingredient"

const Tabs = AnimatedTabBarNavigator();

const IngredientScreen = () => {
    const navigation = useNavigation()

    const [ingredients, setIngredients] = useState([]);
    const [lastKey, setLastKey] = useState(undefined);
    const [nextIngredients_loading, setNextIngredientsLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [isSearch, setIsSearch] = useState(false)


    useEffect(() => {
        const first = query(collection(db, "ingredients"));
        getDocs(first).then(({ docs }) => {
            const tempIngredients = docs.map(doc => ({
                id: doc.id,
                calories: doc.data().calories,
                carbohydrate: doc.data().carbohydrate,
                fat: doc.data().fat,
                fiber: doc.data().fiber,
                name: doc.data().name,
                protein: doc.data().protein,
                size: doc.data().size,
                sugars: doc.data().sugars
            }))

            setIngredients(tempIngredients)
        });
    }, []);


    return (

        <ScrollView
            contentContainerStyle={styles.scrollView}
        >
            {ingredients.map(ingredient => (
                <Ingredient key={ingredient.id} ingredient={ingredient} />
            ))}
        </ScrollView>
    )
}

export default IngredientScreen

const styles = StyleSheet.create({
    scrollView: {
        display: 'flex',
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "center",
        paddingHorizontal: 0,
        paddingVertical: 30,

    },
})