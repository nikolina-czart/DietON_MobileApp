const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: 'pink' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: '400'
            }}
        />
    ),
    error: (props) => (
        <ErrorToast
            {...props}
            text1Style={{
                fontSize: 40
            }}
            text2Style={{
                fontSize: 15
            }}
        />
    ),
}

export { toastConfig };