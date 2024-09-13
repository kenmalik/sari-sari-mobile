import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import SearchBar from "@/components/search-bar";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#f54242" }}>
      <Tabs.Screen
        name="index"
        options={{
          header: () => <SearchBar />,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="shoppingcart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          header: () => <SearchBar />,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="appstore-o" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
