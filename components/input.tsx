import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface RadioOption {
    label: string;
    value: string;
}

interface RadioProps {
    options: RadioOption[];
    checkedValue: string;
    onChange: (value: string) => void;
    style?: object;
}

const Radio = ({options, checkedValue, onChange, style} : RadioProps) => {
    return (
        <View style={[styles.contaier, style]}>
            {options.map((option:{ label:string, value:string }) => {
                let active = option.value === checkedValue;
                return(
                    <TouchableOpacity style={active ? [styles.radio, styles.activeRadio] : styles.radio} onPress={() => onChange(option.value)} key={option.value}>
                        <MaterialIcons 
                        name={ active ? "radio-button-checked" : "radio-button-unchecked" }
                        size={24} 
                        color={active ? colors.roxo : ''} />
                        <Text style={active ? [styles.text, styles.activeText]: styles.text}>{option.label}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    contaier: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    radio: {
        height: 60,
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    activeRadio: {
        backgroundColor: '#673ab7' + '11',
    },
    text: {
        fontSize: 16,
        marginLeft: 15,
        color: '#6b7280',
    },
    activeText: {
        color: "#374151",
    }
})

export default Radio;