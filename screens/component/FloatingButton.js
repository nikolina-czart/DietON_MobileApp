
import React, { useEffect, useState, Component } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import ActionButton from 'react-native-action-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FloatingButton = () => {
    const navigation = useNavigation()

    return (
        <ActionButton buttonColor="#F29F1D">
            <ActionButton.Item
                buttonColor='#2B255A'
                title="Add meal"
                textStyle={styles.actionButtonTitle}
                textContainerStyle={styles.actionButtonTitleContainer}
                onPress={() => navigation.navigate("AddMeal", { meals: [] })}>
                <Ionicons name="restaurant" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
                buttonColor='#2B255A'
                title="Add ingredient"
                textStyle={styles.actionButtonTitle}
                textContainerStyle={styles.actionButtonTitleContainer}
                onPress={() => navigation.navigate("AddIngredient")}>
                <MaterialCommunityIcons name="food-apple" style={styles.actionButtonIcon} />
            </ActionButton.Item>
        </ActionButton>
    )
}

export default FloatingButton

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: "#F29F1D",
    },
    actionButtonTitle: {
        color: '#2B255A',
        fontWeight: '700',
        fontSize: 14,
    },
    actionButtonTitleContainer: {
        backgroundColor: "#F29F1D",
    }
});
