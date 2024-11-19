import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/constants/colors";

interface HeaderProps {
    label: string;
    background?: string;
    color?: string;
}

const Header = ({label, background='#fff', color='#673ab7'} : HeaderProps) => {
    return (
        <SafeAreaView style={{backgroundColor: background}}>
            <View style={styles.container}>
                <Text style={[styles.text, {color: color}]}>{label}</Text>
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