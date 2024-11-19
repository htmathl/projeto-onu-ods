import { Text, View, StyleSheet, FlatList } from "react-native";
import React from "react";
import colors from "@/constants/colors";
import { Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Stack } from "expo-router";
import Header from "@/components/header";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

const receitas = [
    { id: '1', descricao: 'Salário', valor: 5000 },
    { id: '2', descricao: 'Freelance', valor: 2000 },
];

const despesas = [
    { id: '1', descricao: 'Aluguel', valor: 1500 },
    { id: '2', descricao: 'Supermercado', valor: 800 },
    { id: '3', descricao: 'Supermercado', valor: 800 },
    { id: '4', descricao: 'Supermercado', valor: 800 },
];

const somaReceitas = receitas.reduce((acc, receita) => acc + receita.valor, 0);
const somaDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
const totalGastos = somaDespesas;

export default function Page() {
    return (
        <>
            <Stack.Screen options={{ header: () => <Header label="Novembro de 2024" color={colors.branco} background={colors.roxo} /> }} />
            <GestureHandlerRootView>
                <View style={styles.container}>
                    
                    <ScrollView>
                    <View style={styles.header}>
                        <Text style={styles.title1}>Minhas Despesas </Text>
                        <Text style={styles.title2}>R$ {totalGastos}</Text>
                    </View>
                        <View style={styles.container1}>
                            <Text style={styles.subtitle}>Maiores Gastos <Feather name="trending-down" size={24} /></Text>
                            <FlatList
                                data={despesas}
                                renderItem={({ item }) => (
                                    <View style={styles.card}>
                                        <Text style={styles.descricao1}>{item.descricao}</Text>
                                        <Text style={styles.descricao}>R$ {item.valor}</Text>
                                    </View>
                                )}
                                keyExtractor={item => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />

                            <Text style={styles.subtitle}>Fontes de Renda <Feather name="trending-up" size={24} /> </Text>
                            <FlatList
                                data={receitas}
                                renderItem={({ item }) => (
                                    <View style={styles.card}>
                                        <Text style={styles.descricao1}>{item.descricao}</Text>
                                        <Text style={styles.descricao}>R$ {item.valor}</Text>
                                    </View>
                                )}
                                keyExtractor={item => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        <View style={styles.space}></View>
                    </ScrollView>
                </View>
            </GestureHandlerRootView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    container1: {
        padding: 0,
    },

    header: {
        backgroundColor: colors.roxo,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },

    title1: {
        fontSize: 18,
        fontWeight: "400",
        marginBottom: 10,
        textAlign: "left",
        color: colors.branco,
    },

    title2: {
        fontSize: 35,
        fontWeight: "400",
        marginBottom: 20,
        textAlign: "left",
        color: colors.branco,
    },

    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        padding: 20,
    },

    card: {
        width: 120,
        height: 120,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 5,
        backgroundColor: colors.roxo,
        color: colors.branco,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    descricao1: {
        color: colors.branco,
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
    },
    descricao: {
        color: colors.branco,
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 35,
        textAlign: "left",
    },
    space: {
        height: 250,
    }
});