import { Text, View, StyleSheet, FlatList, RefreshControl, Dimensions } from "react-native";
import React from "react";
import colors from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import Header from "@/components/header";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { getMovimentacoes } from "@/data/storage";
import { useFocusEffect } from "@react-navigation/native";
import { VictoryChart, VictoryLine, VictoryScatter, VictoryTheme, } from "victory-native"

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
    const [receitas, setReceitas] = React.useState(0);

    const [toggleDespesa, setToggleDespesa] = React.useState(false);
    const [chartData, setChartData] = React.useState([]);

    let mask = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    async function listTransaction() {
        setIsRefresh(true);
        try {
            const transaction = await getMovimentacoes();

            setLoading(false);
            setData(transaction);
            setIsRefresh(false);

            const totalDespesas = transaction.despesas.reduce((acc: number, item: despesas) => acc + item.amount, 0);
            const totalReceitas = transaction.receitas.reduce((acc: number, item: despesas) => acc + item.amount, 0);

            setDespesas(totalDespesas);
            setReceitas(totalReceitas);

            // const formattedData = transaction.despesas.map((item, index) => ({
            //     x: dictMeses[index % 12].substring(0, 3).toLowerCase(),
            //     y: transaction.receitas[index] ? transaction.receitas[index].amount - item.amount : -item.amount
            // }))

            // setChartData(formattedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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

                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={isRefresh} onRefresh={listTransaction} />
                        }
                    >
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.title1}>Meu Balanço</Text>
                                <Text style={styles.title2}>{mask.format(receitas - despesas)}</Text>
                            </View>
                            {
                                toggleDespesa &&
                                <View style={{ flexDirection: 'row', gap: 60, paddingTop: 20 }}>
                                    <View>
                                        <Text style={[styles.title1, { fontSize: 14 }]}>Receitas</Text>
                                        <Text style={[styles.title2, { fontSize: 20 }]}>{mask.format(receitas)}</Text>
                                    </View>

                                    <View>
                                        <Text style={[styles.title1, { fontSize: 14 }]}>Despesas</Text>
                                        <Text style={[styles.title2, { fontSize: 20 }]}>{mask.format(despesas)}</Text>
                                    </View>
                                </View>
                            }
                            <Feather name={!toggleDespesa ? "arrow-down" : "arrow-up"} size={30} color={colors.branco} onPress={() => { setToggleDespesa(!toggleDespesa); }} />
                        </View>

                        {/* <VictoryChart
                            height={390}
                            theme={VictoryTheme.clean}
                            width={Dimensions.get("window").width}
                            padding={{ left: 50, right: 20, top: 20, bottom: 50 }}
                        >
                            <VictoryLine
                                style={{
                                    data: { stroke: colors.roxo },
                                    parent: { border: "1px solid #ccc" }
                                }}
                                data={chartData}
                            />
                            <VictoryScatter
                                style={{ data: { fill: colors.roxo } }}
                                data={chartData}
                                size={5}
                            />
                        </VictoryChart> */}

                        <View style={styles.container1}>
                            <Text style={styles.subtitle}>Maiores Gastos<Feather name="trending-down" size={24} /></Text>
                            <FlatList
                                data={[...data1.despesas].sort((a, b) => b.amount - a.amount).slice(0, 5)}
                                renderItem={({ item }) => (
                                    <View key={item.id} style={styles.card}>
                                        <Text style={styles.descricao1}>{item.description}</Text>
                                        <Text style={styles.descricao}>{mask.format(item.amount)}</Text>
                                    </View>
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
                                    <View key={item.id} style={styles.card}>
                                        <Text style={styles.descricao1}>{item.description}</Text>
                                        <Text style={styles.descricao}>{mask.format(item.amount)}</Text>
                                    </View>
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
        justifyContent: "space-around",
        alignItems: "center",
        padding: 20,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },

    title1: {
        fontSize: 18,
        fontWeight: "400",
        marginBottom: 10,
        textAlign: "center",
        color: colors.branco,
    },

    title2: {
        fontSize: 35,
        fontWeight: "400",
        marginBottom: 20,
        textAlign: "center",
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
        minWidth: 170,
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