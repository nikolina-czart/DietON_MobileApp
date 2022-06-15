import { StyleSheet, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import TestScreen from './screens/TestScreen';
import React, { useEffect, useState, useMemo } from 'react'
import PopoverElement from './screens/PopoverElement';
import { Center, NativeBaseProvider, } from "native-base";
import LoginScreen from "./screens/auth/LoginScreen"
import RegistrationScreen from "./screens/auth/RegistrationScreen"
import ParameterScreen from './screens/ParameterScreen';
import HomeScreen from './screens/HomeScreen';
import Toast from 'react-native-toast-message'
import toastConfig from "./configs/toastConfig"
import TestScreen from './screens/TestScreen';
import UserPopover from './screens/component/UserPopover';
import AddMeal from './screens/navscreens/AddMeal';
import AddIngredient from './screens/navscreens/AddIngredient';
import PlanMeal from './screens/navscreens/PlanMeal';
import AddElement from './screens/navscreens/AddElement';

const Stack = createStackNavigator();

export default function App() {


  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {/* <Stack.Screen
            name="TEST"
            component={TestScreen}
            options={{
              // headerTitle: props => <LogoTitle {...props} />,
              headerRight: () => (
                <NativeBaseProvider>
                  <Center flex={1} px="3">
                    <PopoverElement />
                  </Center>
                </NativeBaseProvider>
              ),
            }}
          /> */}
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              // headerTitle: props => <LogoTitle {...props} />,
              headerRight: () => (
                <NativeBaseProvider>
                  <Center flex={1} px="3">
                    <UserPopover />
                  </Center>
                </NativeBaseProvider>
              ),
            }}
          />
          <Stack.Screen options={{ headerShown: false }} name="Registration" component={RegistrationScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Parameters" component={ParameterScreen} />
          <Stack.Screen
            name="AddMeal"
            component={AddMeal}
            options={{
              // headerTitle: props => <LogoTitle {...props} />,
              headerRight: () => (
                <NativeBaseProvider>
                  <Center flex={1} px="3">
                    <UserPopover />
                  </Center>
                </NativeBaseProvider>
              ),
            }}
          />
          <Stack.Screen
            name="AddIngredient"
            component={AddIngredient}
            options={{
              // headerTitle: props => <LogoTitle {...props} />,
              headerRight: () => (
                <NativeBaseProvider>
                  <Center flex={1} px="3">
                    <UserPopover />
                  </Center>
                </NativeBaseProvider>
              ),
            }}
          />
          <Stack.Screen
            name="Plan meal"
            component={PlanMeal}
            options={{
              // headerTitle: props => <LogoTitle {...props} />,
              headerRight: () => (
                <NativeBaseProvider>
                  <Center flex={1} px="3">
                    <UserPopover />
                  </Center>
                </NativeBaseProvider>
              ),
            }}
          />
          <Stack.Screen
            name="Add element"
            component={AddElement}
            options={{
              // headerTitle: props => <LogoTitle {...props} />,
              headerRight: () => (
                <NativeBaseProvider>
                  <Center flex={1} px="3">
                    <UserPopover />
                  </Center>
                </NativeBaseProvider>
              ),
            }}
          />
        </Stack.Navigator>
        <Toast config={toastConfig} />

      </NavigationContainer>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
  },
  circle: {
    width: 10,
    height: 10,
    backgroundColor: '#2B255A26',
  }
});