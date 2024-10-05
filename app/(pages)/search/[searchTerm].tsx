import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Search() {
  const { searchTerm } = useLocalSearchParams();
  console.log(searchTerm);

  return (
    <View style={{ justifyContent: "center" }}>
      <Text style={{ textAlign: "center" }}>Search "{searchTerm}"</Text>
    </View>
  );
}
