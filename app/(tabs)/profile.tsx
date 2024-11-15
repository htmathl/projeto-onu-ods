import { Text, View, StyleSheet, FlatList, ScrollView } from "react-native";
import React from "react";
import data from "@/data/bd.json"

export default function Page() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Despesas</Text>
            {data.despesas.map((item) => (
                <View key={item.id} style={styles.item}>
                    <Text style={styles.descricao}>{item.descricao}</Text>
                    <Text style={styles.valor2}>R$ {item.valor.toFixed(2)}</Text>
                </View>
            ))}

            <Text style={styles.header}>Receitas</Text>
            {data.receitas.map((item) => (
                <View key={item.id} style={styles.item}>
                    <Text style={styles.descricao}>{item.descricao}</Text>
                    <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 30,
    },
    item: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderColor: '#000',
        borderWidth: 2,
        padding: 10,
        borderRadius: 12,
    },
    descricao: {
        fontSize: 18,
    },
    valor: {
        fontSize: 18,
        color: 'green',
    },
    valor2: {
        fontSize: 18,
        color: 'red',
    },
});