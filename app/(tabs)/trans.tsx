import { Text, View, StyleSheet, FlatList, RefreshControl } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Header from "@/components/header";
import { excluirMovimentacao, excluirTudo, getMovimentacoes } from "@/data/storage";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { InputDate } from "@/components/inputDate";
import colors from "@/constants/colors";

export default function Page() {

    interface Movimentacoes {
        despesas: {
            id: string;
            description: string;
            amount: number;
            category: string;
            recorrying: boolean;
            date: string;
        }[];
        receitas: {
            id: string;
            description: string;
            amount: number;
            category: string;
            recorrying: boolean;
            date: string;
        }[];
    }

    interface filterMovimentacoes {
        receitas: Array<{ id: string; description: string; amount: number; date: string; category: string; recorrying: boolean; }>;
        despesas: Array<{ id: string; description: string; amount: number; date: string; category: string; recorrying: boolean }>;
    }

    const [isRefresh, setIsRefresh] = React.useState(false);

    const [data1, setData] = React.useState({ despesas: [], receitas: [] } as Movimentacoes);

    const [loading, setLoading] = React.useState(true);

    const [primaryValue, setPrimaryValue] = React.useState('Selecione uma data');

    async function listTransaction() {
        setIsRefresh(true);
        const transaction = await getMovimentacoes();

        setLoading(false);
        setData(transaction);
        setIsRefresh(false)
        setPrimaryValue('Selecione uma data')
    }

    useFocusEffect(
        React.useCallback(() => {
            listTransaction();
        }, [])
    );

    const handleDateChange = (filteredData: filterMovimentacoes) => {
        setData(filteredData);
    };

    let mask = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const formatDateView = (date: Date) => date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );

    } else return (
        <>
            <Stack.Screen options={{ header: () => <Header label="Movimentações" /> }} />
            <View style={{ backgroundColor: colors.branco, alignItems: 'center', paddingBottom: 10 }}>
                <InputDate onDateChange={handleDateChange} primaryValue={primaryValue} setPrimaryValue={setPrimaryValue} />
            </View>
            <FlatList
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={isRefresh} onRefresh={listTransaction} />
                }
                data={[...data1.despesas, ...data1.receitas]}
                renderItem={() => null}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <>
                        <Text style={styles.header}>Despesas</Text>
                        {data1.despesas.length === 0 && <Text>Não há despesas cadastradas.</Text>}
                        {data1.despesas.map((despesa) => (
                            <View key={despesa.id} style={styles.item}>
                                <View style={styles.transContainer}>
                                    <View><Feather onPress={() => { excluirMovimentacao(despesa.id); setTimeout(() => listTransaction(), 50) }} name="trash" size={24} /></View>
                                    <Text>{despesa.category}</Text>
                                </View>

                                <View style={styles.transContainer}>
                                    <Text style={styles.descricao}>{despesa.recorrying ? despesa.description + ' - ' + formatDateView(new Date(despesa.date)) : despesa.description}</Text>
                                    <Text style={styles.valor2}>
                                        {
                                            despesa.recorrying ?
                                                <Feather name="refresh-ccw" size={15} />
                                                : ""
                                        }
                                        {" " + mask.format(despesa.amount)}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        <Text style={[styles.header, { marginTop: 30 }]}>Receitas</Text>
                        {data1.receitas.length === 0 && <Text>Não há receitas cadastradas.</Text>}
                        {data1.receitas.map((receita) => (
                            <View key={receita.id} style={styles.item}>
                                <View style={styles.transContainer}>
                                    <View><Feather onPress={() => { excluirMovimentacao(receita.id); setTimeout(() => listTransaction(), 50) }} name="trash" size={24} /></View>
                                    <Text>{receita.category}</Text>
                                </View>

                                <View style={styles.transContainer}>
                                    <Text style={styles.descricao}>{receita.recorrying ? receita.description + " - " + formatDateView(new Date(receita.date)) : receita.description}</Text>
                                    <Text style={styles.valor}>
                                        {
                                            receita.recorrying ?
                                                <Feather name="refresh-ccw" size={15} />
                                                : ""
                                        }
                                        {" " + mask.format(receita.amount)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        <View style={styles.space}></View>
                    </>
                }
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        marginTop: 15,
        paddingVertical: 8,
        borderColor: '#000',
        borderWidth: 2,
        padding: 10,
        borderRadius: 12,
    },
    transContainer: {
        marginTop: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
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
    space: {
        height: 160,
    },
});