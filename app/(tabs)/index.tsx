import { Text, View, StyleSheet, FlatList, RefreshControl } from "react-native";
import React from "react";
import colors from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import Header from "@/components/header";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { getMovimentacoes } from "@/data/storage";
import { useFocusEffect } from "@react-navigation/native";
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const dictMeses: { [key: number]: string } = {
    0: 'Janeiro',
    1: 'Fevereiro',
    2: 'Março',
    3: 'Abril',
    4: 'Maio',
    5: 'Junho',
    6: 'Julho',
    7: 'Agosto',
    8: 'Setembro',
    9: 'Outubro',
    10: 'Novembro',
    11: 'Dezembro',
};

interface Movimentacoes {
    despesas: {
        id: string;
        description: string;
        amount: number;
    }[];
    receitas: {
        id: string;
        description: string;
        amount: number;
    }[];
}

interface despesas {
    id: string;
    description: string;
    amount: number;
}

export default function Page() {


    const [isRefresh, setIsRefresh] = React.useState(false);

    const [data1, setData] = React.useState({ despesas: [], receitas: [] } as Movimentacoes);

    const [loading, setLoading] = React.useState(true);

    const [despesas, setDespesas] = React.useState(0);

    async function listTransaction() {
        setIsRefresh(true);
        const transaction = await getMovimentacoes();

        setLoading(false);
        setData(transaction);
        setIsRefresh(false);

        setDespesas(transaction.despesas.reduce((acc: number, item: despesas) => acc + item.amount, 0));
    }

    useFocusEffect(
        React.useCallback(() => {
            listTransaction();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );

    } else return (
        <>
            <Stack.Screen options={{ header: () => <Header label={dictMeses[month] + " de " + year} color={colors.branco} background={colors.roxo} /> }} />
            <GestureHandlerRootView>
                <View style={styles.container}>

                    <ScrollView>
                        <View style={styles.header}>
                            <Text style={styles.title1}>Minhas Despesas </Text>
                            <Text style={styles.title2}>R$ {despesas}</Text>
                        </View>
                        <View style={styles.container1}>
                            <Text style={styles.subtitle}>Maiores Gastos <Feather name="trending-down" size={24} /></Text>
                            <FlatList
                                refreshControl={
                                    <RefreshControl refreshing={isRefresh} onRefresh={listTransaction} />
                                }
                                data={[...data1.despesas].sort((a, b) => b.amount - a.amount).slice(0, 5)}

                                renderItem={({ item }) => (
                                    <>
                                        {data1.despesas.length === 0 && <Text>Não há fontes de renda cadastradas</Text>}
                                        <View key={item.id} style={styles.card}>
                                            <Text style={styles.descricao1}>{item.description}</Text>
                                            <Text style={styles.descricao}>R$ {item.amount}</Text>
                                        </View>
                                    </>
                                )}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />

                            <Text style={styles.subtitle}>Fontes de Renda <Feather name="trending-up" size={24} /> </Text>
                            <FlatList
                                refreshControl={
                                    <RefreshControl refreshing={isRefresh} onRefresh={listTransaction} />
                                }
                                data={[...data1.receitas]}

                                renderItem={({ item }) => (
                                    <>
                                        {data1.receitas.length === 0 && <Text>Não há fontes de renda cadastradas</Text>}
                                        <View key={item.id} style={styles.card}>
                                            <Text style={styles.descricao1}>{item.description}</Text>
                                            <Text style={styles.descricao}>R$ {item.amount}</Text>
                                        </View>
                                    </>
                                )}
                                keyExtractor={(item) => item.id}
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
        padding: 10,
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