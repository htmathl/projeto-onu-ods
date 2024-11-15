import { View, StyleSheet, TextInput, Text, Pressable } from "react-native";
import React, { useState } from "react";
import colors from "@/constants/colors";
import Radio from "@/components/input";

export default function Page() {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");

    const [ fruit, setFruit ] = useState('receita');

    return (
        <View style={styles.container}>

            <Radio options={[
                { label: "Receita", value: "receita" },
                { label: "Despesa", value: "despesa" },
            ]}

                checkedValue={fruit}
                onChange={setFruit}
                style={{marginBottom: 15}}
            />

            <TextInput
                style={[styles.input]}
                value={description}
                onChangeText={setDescription}
                placeholder="Descrição" 
            />

            <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="Valor"
                keyboardType="numeric" 
            />

            <Pressable style={styles.button} onPress={() => {
                alert(`Descrição: ${description}\nValor: ${amount}\nTipo: ${fruit}`)
            }}>
                <Text style={styles.buttonText}>Enviar</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        height: 100,
        gap: 24,
        backgroundColor: '#fff'
    },

    input: {
        width: '100%',
        height: 45,
        padding: 15,
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.1,
        shadowRadius: 25,
        borderWidth: 1,
        borderColor: colors.roxo,
        borderRadius: 12,
        backgroundColor: 'transparent',
        color: '#000',
        
    },
    button: {
        marginTop: 24,
        backgroundColor: colors.roxo,
        borderWidth: 1,
        padding: 15,
        paddingHorizontal: 28,
        borderRadius: 12,
        width: "100%",
    },
    buttonText: {
        color: '#ffffff',
        textAlign: "center",
    }
});