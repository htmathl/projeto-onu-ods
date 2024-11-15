import { Text, View, StyleSheet } from "react-native";
import React from "react";

export default function Page() {
    return(
        <View style={styles.container}>
            <Text>Caralho!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});