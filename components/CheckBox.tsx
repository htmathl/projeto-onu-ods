import colors from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CheckBoxProps {
    options: string[];
    checkedValues: string[];
    onChange: Function;
    style?: object;
}

export const CheckBox = ({ options, checkedValues, onChange, style }: CheckBoxProps) => {

    let updateCheckedValues = [...checkedValues]

    return (
        <View style={[styles.container, style]}>
            {options.map((option) => {
                let active = updateCheckedValues.includes(option)
                return (
                    <TouchableOpacity
                        style={active ? [styles.checkbox, styles.activeCheckBox] : styles.checkbox}
                        onPress={() => {
                            if (active) {
                                updateCheckedValues = updateCheckedValues.filter((value) => value !== option)
                                return onChange(updateCheckedValues)
                            }

                            updateCheckedValues.push(option)
                            onChange(updateCheckedValues)
                        }}
                        key={option}
                    >
                        <MaterialIcons
                            name={active ? "check-box" : "check-box-outline-blank"}
                            color={colors.roxo}
                            size={24}
                        />
                        <Text style={active ? [styles.text, styles.activeText] : styles.text}>{option}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center'
    },
    checkbox: {
        height: 60,
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    activeCheckBox: {
        backgroundColor: '#673ab7' + '11',
    },
    text: {
        fontSize: 16,
        marginLeft: 15,
        color: '#6b7280',
    },
    activeText: {
        color: "#374151",
    },
})