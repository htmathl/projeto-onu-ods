import TabBar from "@/components/TabBar";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
    return (
        <Tabs tabBar={props => <TabBar {...props} />}>
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="add" options={{ title: "Add" }} />
            <Tabs.Screen name="trans" options={{ title: "Trans" }} />
        </Tabs>
    )
}