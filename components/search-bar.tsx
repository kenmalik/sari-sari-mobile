import { TextInput, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 4 }]}>
      <TextInput style={styles.input} placeholder="Search Shop Sari Sari" />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    padding: 12,
    backgroundColor: "#5873f9",
  },
  input: {
    height: 32,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
  },
});
