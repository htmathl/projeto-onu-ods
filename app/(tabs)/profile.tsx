import { Text, View, StyleSheet, FlatList } from "react-native";
import React from "react";
import data from "@/data/bd.json"

export default function Page() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Receitas</Text>
            <FlatList
                style={styles.list}
                data={data.receitas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.descricao}>{item.descricao}</Text>
                        <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>
                    </View>
                )}
            />

            <Text style={styles.header}>Despesas</Text>
            <FlatList
                style={styles.list}
                data={data.despesas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.descricao}>{item.descricao}</Text>
                        <Text style={styles.valor2}>R$ {item.valor.toFixed(2)}</Text>
                    </View>
                )}
            />
        </View>

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
    list:{
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
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