import { TextInput, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 4 }]}>
      <TextInput
        style={styles.input}
        placeholder="Search Shop Sari Sari"
        placeholderTextColor="grey"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    padding: 12,
    backgroundColor: "rgb(3, 9, 156)",
  },
  input: {
    height: 32,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
  },
});
