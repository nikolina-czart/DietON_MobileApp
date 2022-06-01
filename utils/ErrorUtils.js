function getErrorMessage(errorCode) {
    switch (errorCode) {
        case "auth/email-already-exists":
            return "The e-mail address is already taken. "
        case "auth/invalid-email":
            return "The e-mail you have entered is incorrect."
        case "auth/invalid-password":
            return "Password must contain at least 6 characters."
        case "auth/user-not-found":
            return "There is no user with this email."
        case 'auth/email-already-in-use':
            return "This e-mail is already in use."
    }
}

export { getErrorMessage }