import { View, StyleSheet, TextInput, Text, Pressable, Modal, ToastAndroid, Keyboard } from "react-native";
import React, { useState } from "react";
import colors from "@/constants/colors";
import Radio from "@/components/input";
import Header from "@/components/header";
import { Stack } from "expo-router";
import DatePicker from "react-native-modern-datepicker"
import { Feather } from "@expo/vector-icons";
import { saveMovimentacao } from "@/data/storage";
import Dropdown from "@/components/DropDown";
import { CheckBox } from "@/components/CheckBox";

export default function Page() {
    const [isKeyboardVisible, setKeyboardVisible] = React.useState(false); // Adicionado estado

    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);

        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);


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
    const [category, setCategory] = useState('');
    const [reco, setReco] = useState([]);

    const handleInputChange = (text: string) => {
        const formattedText = text.replace(/[^0-9,]/g, '');

        // Substitui múltiplas vírgulas por uma única vírgula
        const singleCommaText = formattedText.replace(/,+/g, ',');

        // Atualiza o estado com o valor formatado
        setAmount(singleCommaText);
    };


    const handleOnPressSubmit = async () => {

        if (!description || !amount) {
            ToastAndroid.show('Preencha todos os campos!', ToastAndroid.SHORT);
            return;
        }

        try {
            if (category) {
                await saveMovimentacao({
                    id: Math.random().toString(36).substr(2, 9),
                    description,
                    amount: Number(amount.replace(',', '.')),
                    type: type as 'receitas' | 'despesas',
                    date: formatDateToISO(selectedDate),
                    category: category as 'Alimentação' | 'Educação' | 'Lazer' | 'Moradia' | 'Saúde' | 'Transporte' | 'Outros' | 'Salário' | 'Outras Receitas',
                    recorrying: reco.length ? true : false
                })

                setDescription('');
                setAmount('');
                setCategory('');
                setSelectedDate(formatDateView(today));
                setReco([]);
                setType('receitas');

                ToastAndroid.show('Movimentação salva com sucesso!', ToastAndroid.SHORT);

            } else {
                ToastAndroid.show('Categoria inválida para o tipo de movimentação!', ToastAndroid.SHORT);
            }

        } catch (error) {
            ToastAndroid.showWithGravity('Erro ao salvar movimentação!', ToastAndroid.LONG, ToastAndroid.TOP);
            console.error(error);
        }
    }

    return (
        <>
            <Stack.Screen options={{ header: () => <Header label="Adicionar Movimentações" /> }} />
            <View style={!isKeyboardVisible ? styles.container : [styles.container, { paddingBottom: 0 }]}>

                <Radio options={[
                    { label: "Receita", value: "receitas" },
                    { label: "Despesa", value: "despesas" },
                ]}

                    checkedValue={type}
                    onChange={(value) => {
                        setType(value);
                        setCategory('');
                    }}
                    style={{ marginBottom: 16 }}
                />

                <View style={styles.viewr}>

                    <TextInput
                        style={[styles.input, styles.inputV]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Descrição"
                    />

                    <TextInput
                        style={[styles.input, styles.inputV]}
                        value={amount}
                        onChangeText={handleInputChange}
                        placeholder="Valor"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.viewr}>

                    <Dropdown
                        data={type == 'despesas' ? [
                            { value: 'alimentacao', label: 'Alimentação' },
                            { value: 'educacao', label: 'Educação' },
                            { value: 'lazer', label: 'Lazer' },
                            { value: 'moradia', label: 'Moradia' },
                            { value: 'saude', label: 'Saúde' },
                            { value: 'transporte', label: 'Transporte' },
                            { value: 'outros', label: 'Outros' },

                        ] : [
                            { value: 'salario', label: 'Salário' },
                            { value: 'outras-receitas', label: 'Outras Receitas' },
                        ]}
                        onChange={(item) => setCategory(item.label)}
                        placeholder="Selecione uma categoria"
                        value={category}
                    />

                    <Pressable
                        style={[styles.input, styles.inputV]}
                        onPress={handleOnPressSrartDate}
                    >
                        <Text style={{ textAlign: 'center' }}>{selectedDate}</Text>
                        <Feather name="calendar" size={22} color={colors.roxo} />
                    </Pressable>

                </View>

                <CheckBox
                    options={['Movimentação recorrente']}
                    checkedValues={reco}
                    onChange={(value:[]) => {
                        setReco(value)
                        value.length ? alert(
                            `No campo "Data" selecione:\n\nDia que será cobrado mensalmente; \nMês e ano desejado para a última cobrança.`
                        ) : null
                    }}
                    style={{ marginBottom: 16, marginTop: 16 }}
                />

                <Pressable style={styles.button} onPress={handleOnPressSubmit}>
                    <Text style={styles.buttonText}>Enviar</Text>
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
        gap: 10,
        paddingBottom: 150,
        backgroundColor: '#fff',
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
        marginTop: 16,
        backgroundColor: colors.roxo,
        borderWidth: 0,
        padding: 15,
        paddingHorizontal: 28,
        borderRadius: 12,
        width: "50%",
        height: 55,
        fontSize: 16,
        justifyContent: 'center',
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
    },
});
