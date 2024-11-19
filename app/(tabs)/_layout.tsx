import TabBar from "@/components/TabBar";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
    return (
        <Tabs tabBar={props => <TabBar {...props} />}>
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="explore" options={{ title: "Add" }} />
            <Tabs.Screen name="profile" options={{ title: "Trans" }} />
        </Tabs>
    )
}