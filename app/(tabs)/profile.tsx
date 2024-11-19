import { Text, View, StyleSheet, FlatList, RefreshControl } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Header from "@/components/header";
import { getMovimentacoes } from "@/data/storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Page() {

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

    const [isRefresh, setIsRefresh] = React.useState(false);

    const [data1, setData] = React.useState({ despesas: [], receitas: [] } as Movimentacoes);

    const [loading, setLoading] = React.useState(true);

    async function listTransaction() {
        setIsRefresh(true);
        const transaction = await getMovimentacoes();

        setLoading(false);
        setData(transaction);
        setIsRefresh(false)
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
            <Stack.Screen options={{ header: () => <Header label="Movimentações"/> }} />
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
                                <Text style={styles.descricao}>{despesa.description}</Text>
                                <Text style={styles.valor2}>R$ {despesa.amount}</Text>
                            </View>
                        ))}
                        
                        <Text style={styles.header}>Receitas</Text>
                        {data1.receitas.length === 0 && <Text>Não há receitas cadastradas.</Text>}
                        {data1.receitas.map((receita) => (
                            <View key={receita.id} style={styles.item}>
                                <Text style={styles.descricao}>{receita.description}</Text>
                                <Text style={styles.valor}>R$ {receita.amount}</Text>
                            </View>
                        ))}
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