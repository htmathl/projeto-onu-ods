import { View, StyleSheet, TextInput, Text, Pressable, Modal } from "react-native";
import React, { FC, useState } from "react";
import colors from "@/constants/colors";
import Radio from "@/components/input";
import Header from "@/components/header";
import { Stack } from "expo-router";
import DatePicker from "react-native-modern-datepicker"
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveMovimentacao } from "@/data/storage";

export default function Page() {

    const today = new Date();

    const formatDateView = (date: Date) => date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

    const [selectedDate, setSelectedDate] = useState(formatDateView(today));

    const handleDateChange = (date: string) => {
        const [year, month, day] = date.split('/').map(Number);
        const newDate = new Date(year, month - 1, day);
        setSelectedDate(formatDateView(newDate));
    }

    const formatDateToISO = (date: string) => {
        const [day, month, year] = date.split('/').map(Number);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState('receitas');
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const handleOnPressSrartDate = () => setOpenDatePicker(!openDatePicker);

    const handleOnPressSubmit = async () => {
        try {
            // const existingData = await AsyncStorage.getItem('movimentacoes');
            // let newData = existingData ? JSON.parse(existingData) : {};

            // if (!newData[type]) {
            //     newData[type] = [];
            // }

            // newData[type].push({
            //     id: Math.random().toString(36).substr(2, 9),
            //     description: description,
            //     amount: amount,
            //     date: formatDateToISO(selectedDate)
            // });

            // await AsyncStorage.setItem('movimentacoes', JSON.stringify(newData));

            await saveMovimentacao({
                id: Math.random().toString(36).substr(2, 9),
                description,
                amount: Number(amount),
                type: type as 'receitas' | 'despesas',
                date: formatDateToISO(selectedDate)
            })

            setDescription('');
            setAmount('');
            setSelectedDate(formatDateView(today));
            setType('receitas');

            alert('Salvou porraaaaa!');
        } catch (error) {
            console.error(error);
        }
    }

    const show = async () => {
        try {
            const value = await AsyncStorage.getItem('movimentacoes');
            if (value !== null) {
                alert(JSON.stringify(JSON.parse(value), null, 2));
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Stack.Screen options={{ header: () => <Header label="Adicionar Movimentações" /> }} />
            <View style={styles.container}>

                <Radio options={[
                    { label: "Receita", value: "receitas" },
                    { label: "Despesa", value: "despesas" },
                ]}

                    checkedValue={type}
                    onChange={setType}
                    style={{ marginBottom: 15 }}
                />

                <TextInput
                    style={[styles.input]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Descrição"
                />

                <View style={styles.viewr}>
                    <TextInput
                        style={[styles.input, styles.inputV]}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Valor"
                        keyboardType="numeric"
                    />

                    <Pressable
                        style={[styles.input, styles.inputV]}
                        onPress={handleOnPressSrartDate}
                    >
                        <Text style={{ textAlign: 'center' }}>{selectedDate}</Text>
                        <Feather name="calendar" size={22} color={colors.roxo} />
                    </Pressable>
                </View>

                <Pressable style={styles.button} onPress={handleOnPressSubmit}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={show}>
                    <Text style={styles.buttonText}>Mostra tudo</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={ () => {
                    AsyncStorage.removeItem('movimentacoes');
                    alert('Excluiu tudo!');
                }}>
                    <Text style={styles.buttonText}>Excluir tudo</Text>
                </Pressable>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={openDatePicker}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' }}>
                        <View style={styles.modalView}>
                            <DatePicker
                                mode="calendar"
                                selected={formatDateToISO(selectedDate)}
                                onSelectedChange={handleDateChange}
                                options={{
                                    backgroundColor: '#fff',
                                    textHeaderColor: '#000',
                                    textDefaultColor: '#000',
                                    selectedTextColor: '#fff',
                                    mainColor: colors.roxo,
                                    textSecondaryColor: colors.roxo,
                                    borderColor: '#fff',
                                }}
                            />
                            <Pressable onPress={handleOnPressSrartDate} style={styles.btnClose}>
                                <Text style={{ color: '#fff' }}>Pronto</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
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
        height: 55,
        padding: 15,
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.1,
        shadowRadius: 25,
        borderWidth: 2,
        borderColor: colors.roxo,
        borderRadius: 12,
        backgroundColor: 'transparent',
        color: '#000',
    },

    button: {
        marginTop: 24,
        backgroundColor: colors.roxo,
        borderWidth: 0,
        padding: 15,
        paddingHorizontal: 28,
        borderRadius: 12,
        width: "50%",
    },

    buttonText: {
        color: '#ffffff',
        textAlign: "center",
    },

    inputV: {
        width: '48%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    viewr: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },

    btnClose: {
        backgroundColor: colors.roxo,
        padding: 15,
        borderRadius: 12,
        marginTop: 24,
        width: '20%',
        alignItems: 'center',
    },

    modalView: {
        width: '90%',
        height: '60%',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
});