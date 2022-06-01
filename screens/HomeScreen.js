import { useNavigation } from '@react-navigation/core'

import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import CalendarScreen from './navscreens/CalendarScreen';
import MealScreen from './navscreens/MealScreen';
import IngredientScreen from './navscreens/IngredientScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Tabs = AnimatedTabBarNavigator();

const HomeScreen = () => {
    const navigation = useNavigation()



    return (
        <>
            <Tabs.Navigator
                // default configuration from React Navigation
                tabBarOptions={{
                    activeTintColor: "#F2A52B",
                    inactiveTintColor: "#F2A52B",
                    activeBackgroundColor: "#2B255A"
                }}
            >
                <Tabs.Screen
                    name="Calendar"
                    component={CalendarScreen}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <MaterialCommunityIcons name="calendar" color={focused ? color : "#2B255A"} size={size ? size : 24} focused={focused} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="Meal"
                    component={MealScreen}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <MaterialCommunityIcons name="food-turkey" color={focused ? color : "#2B255A"} size={size ? size : 24} focused={focused} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="Ingredient"
                    component={IngredientScreen}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <MaterialCommunityIcons name="food-apple" color={focused ? color : "#2B255A"} size={size ? size : 24} focused={focused} />
                        )
                    }}
                />
            </Tabs.Navigator>
        </>

    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})