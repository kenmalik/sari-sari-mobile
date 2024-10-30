import { Text, View } from "react-native";
import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FakeSearchBar } from "@/components/SearchBar";
import { useContext } from "react";
import { CartContext } from "../CartContext";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout() {
  const { cart } = useContext(CartContext);
  return (
    <>
      <StatusBar style="light" />
      <Tabs screenOptions={{ tabBarActiveTintColor: "#f54242" }}>
        <Tabs.Screen
          name="index"
          options={{
            header: () => <FakeSearchBar />,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            header: () => <FakeSearchBar />,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <View>
                <AntDesign name="shoppingcart" size={24} color={color} />
                {cart ? (
                  <Text
                    style={{
                      position: "absolute",
                      left: 9,
                      bottom: 13,
                      backgroundColor: "white",
                      color: color,
                      paddingHorizontal: 2,
                      borderRadius: 8,
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    {cart.quantity < 1000 ? cart.quantity : "999+"}
                  </Text>
                ) : null}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="catalog"
          options={{
            header: () => <FakeSearchBar />,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <AntDesign name="appstore-o" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
