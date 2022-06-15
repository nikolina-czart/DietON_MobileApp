import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import IngredientServices from '../../services/IngredientServices';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../../configs/firebase";
import { async } from '@firebase/util';
import Ingredient from "./Ingredient"
import FloatingButton from '../component/FloatingButton';



const Tabs = AnimatedTabBarNavigator();

const MealScreen = () => {
    const navigation = useNavigation()

    const [meals, setMeals] = useState([]);
    const [search, setSearch] = useState("")
    const [isSearch, setIsSearch] = useState(false)


    useEffect(() => {
        const first = query(collection(db, "meals"));
        getDocs(first).then(({ docs }) => {
            const tempMeals = docs.map(doc => ({
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
            }))

            setMeals(tempMeals)
        });
    }, []);


    return (
        <>

            <ScrollView
                contentContainerStyle={styles.scrollView}
            >

                {meals.map(meal => (
                    <Text>{meal.name}</Text>
                    // <Ingredient key={ingredient.id} ingredient={ingredient} />
                ))}

            </ScrollView>
            <FloatingButton />
        </>

    )
}

export default MealScreen

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