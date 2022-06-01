import Toast from 'react-native-toast-message';

const showToast = (typeError, positionError, title, message) => {
    Toast.show({
        type: typeError,
        position: positionError,
        text1: title,
        text2: message,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 40,
        style: { fontSize: 40 },
        onPress: () => Toast.hide()
    })
};


const isEmpty = (value, message) => {
    if (!value) {
        showToast("error", "top", "Error!", message)
        return true
    }
    return false
}

const validateEmail = (email) => {
    if (String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
        return true

    }
    showToast("error", "top", "Error!", "Incorrect e-mail address entered.")
    return false
};

const matchPassword = (password, repeatPassword) => {
    if (password === repeatPassword) {
        return true
    }
    showToast("error", "top", "Error!", "Passwords don't match")
    return false
};

export { isEmpty, validateEmail, matchPassword, showToast }