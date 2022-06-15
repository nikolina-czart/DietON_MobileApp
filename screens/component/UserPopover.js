import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/core'
import { Popover, Button, Box, Center, NativeBaseProvider } from "native-base";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { db, auth, onAuthStateChanged, doc, getDoc } from '../../configs/firebase'

const UserPopover = () => {
    const [user, setUser] = useState({})
    const navigation = useNavigation()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                getDoc(doc(db, "users", uid)).then(docSnap => {
                    if (docSnap.exists()) {
                        setUser(docSnap.data())
                        console.log(user.name)
                    } else {
                        console.log("No such document!");
                    }
                })
            } else {
            }
        });
    }, []);



    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    return (
        <Box style={styles.box}>
            <Popover placement="left top" trigger={triggerProps => {
                return <Button {...triggerProps} style={styles.circle}>
                    {/* {user && user.name.charAt(0)} */}
                </Button>;
            }}>
                <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                    <Popover.Arrow />
                    <Popover.CloseButton />
                    <Popover.Header>{user.name}</Popover.Header>
                    <Popover.Body>
                        <Text>Do you really want to log out?</Text>
                    </Popover.Body>
                    <Popover.Footer justifyContent="flex-end">
                        <Button style={styles.button} onPress={handleSignOut}>Log out!</Button>
                    </Popover.Footer>
                </Popover.Content>
            </Popover>
        </Box>
    )

}

export default UserPopover;

const styles = StyleSheet.create({
    box: {
        alignItems: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10,
        width: 200,
    },
    circle: {
        width: 40,
        height: 40,
        backgroundColor: '#2B255A',
        borderRadius: 999999,
    },
    button: {
        backgroundColor: '#2B255A',
        width: '70%',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
    }
});