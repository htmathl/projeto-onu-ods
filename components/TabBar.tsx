import { View, StyleSheet, Keyboard } from 'react-native';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import TabBarButton from './TabBarButton';
import React from 'react';

export default function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const [isKeyboardVisible, setKeyboardVisible] = React.useState(false); // Adicionado estado

    React.useEffect(() => { // Adicionado useEffect
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

    if (isKeyboardVisible) { 
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.tabbar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarButton
                            key={route.key}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            isFocused={isFocused}
                            routeName={route.name}
                            color={isFocused ? '#fff' : '#673ab7'} label={label as string}/>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    tabbar: {
        position: "absolute",
        bottom: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: 4,
        minWidth: 250,
    }
});
