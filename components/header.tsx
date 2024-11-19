import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";

const Header = ({label} : {label:string}) => {
    return (
        <SafeAreaView style={{backgroundColor: '#fff'}}>
            <View style={styles.container}>
                <Text style={styles.text}>{label}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.roxo,
    }
})

export default Header;