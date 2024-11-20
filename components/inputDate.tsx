import colors from "@/constants/colors"
import { filtrarMovimentacoes } from "@/data/storage";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"
import DatePicker from "react-native-modern-datepicker";

export const InputDate = ({ onDateChange}: {onDateChange:Function}) => {
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

    const [openDatePicker, setOpenDatePicker] = useState(false);

    const handleOnPressSrartDate = () => setOpenDatePicker(!openDatePicker);

    const handleDateList = async () => {
        const isoDate = formatDateToISO(selectedDate);
        const result = await filtrarMovimentacoes(isoDate);
        onDateChange(result);
    }

    return (
        <>
        <Pressable
            style={[styles.input, styles.inputV]}
            onPress={handleOnPressSrartDate}
        >
            <Text style={{ textAlign: 'center' }}>{selectedDate}</Text>
            <Feather name="calendar" size={22} color={colors.roxo} />
        </Pressable>
        
        <Modal
            animationType="fade"
            transparent={true}
            visible={openDatePicker} >
        
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
                <Pressable onPress={() => {handleOnPressSrartDate(); handleDateList() }} style={styles.btnClose}>
                    <Text style={{ color: '#fff' }}>Pronto</Text>
                </Pressable>
            </View>
        </View>
    </Modal>
    </>
    )
}

const styles = StyleSheet.create({
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

    inputV: {
        width: '48%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
})