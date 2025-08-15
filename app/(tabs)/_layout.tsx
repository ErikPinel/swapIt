import React from "react";
import { Tabs } from "expo-router";
import CustomTabBar from "@/components/ui/CustomTabBar";
import TopHeader from "@/components/ui/TopHeader";


export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // header: () => <TopHeader />, // ⬅️ global logo + user icon
      }}
    >
      <Tabs.Screen name="index"   options={{ title: "Map" }} />
      <Tabs.Screen name="search"  options={{ title: "Search" }} />
      <Tabs.Screen name="chat"    options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
