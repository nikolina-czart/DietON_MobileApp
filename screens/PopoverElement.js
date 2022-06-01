import React from "react";
import { Popover, Button, Box, Center, NativeBaseProvider } from "native-base";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'

const PopoverElement = () => {
    return (
        <Box h="60%" w="100%" alignItems="center">
            <Popover placement="left top" trigger={triggerProps => {
                return <Button {...triggerProps} colorScheme="danger">
                    D
                </Button>;
            }}>
                <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                    <Popover.Arrow />
                    <Popover.CloseButton />
                    <Popover.Header>D</Popover.Header>
                    <Popover.Body>
                        <Text>This will remove all data relating to Alex. This action cannot be
                            reversed. Deleted data can not be recovered.</Text>
                    </Popover.Body>
                    <Popover.Footer justifyContent="flex-end">
                        <Button.Group space={2}>
                            <Button colorScheme="coolGray" variant="ghost">
                                Cancel
                            </Button>
                            <Button colorScheme="danger">s</Button>
                        </Button.Group>
                    </Popover.Footer>
                </Popover.Content>
            </Popover>
        </Box>
    )

}

export default PopoverElement;