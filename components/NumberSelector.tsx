import AntDesign from "@expo/vector-icons/AntDesign";
import { useRef, useState } from "react";
import {
  Pressable,
  StyleProp,
  TextInput,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native";

type NumberSelectorProps = {
  max?: number;
  min?: number;
  value?: number;
  onSelect: (selected: number) => void;
  style?: StyleProp<ViewStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function NumberSelector({
  max = Infinity,
  min = -Infinity,
  value = 1,
  onSelect,
  style,
  textContainerStyle,
  disabled = false,
}: NumberSelectorProps) {
  const [textValue, setTextValue] = useState<string>(value.toString());
  const inputRef = useRef<TextInput>(null);

  if (!inputRef.current?.isFocused() && value.toString() !== textValue) {
    setTextValue(value.toString());
  }

  function onIncrement() {
    if (value < min) {
      onSelect(min);
      return;
    }
    let newAmount = value + 1;
    onSelect(newAmount);
  }

  function onDecrement() {
    if (value > max) {
      onSelect(max);
      return;
    }
    let newAmount = value - 1;
    onSelect(newAmount);
  }

  function onTextInput(newAmount: string) {
    let value: number = parseInt(newAmount);
    if (isNaN(value)) {
      onSelect(1);
      // Parent rerender won't be triggered by onSelect if the parent state is 1.
      // Therefore, we need to manually reset the input text state to "1".
      setTextValue("1");
      return;
    }
    onSelect(value);
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: disabled ? "gainsboro" : "white",
        },
        style,
      ]}
    >
      <Pressable
        onPress={onDecrement}
        disabled={value <= min}
        style={styles.buttons}
      >
        {({ pressed }) => (
          <AntDesign
            name="minus"
            size={16}
            color={value <= min || disabled || pressed ? "lightgrey" : "black"}
          />
        )}
      </Pressable>
      <TextInput
        ref={inputRef}
        style={[styles.input, textContainerStyle]}
        inputMode="numeric"
        onChangeText={setTextValue}
        onEndEditing={() => onTextInput(textValue)}
        value={disabled ? "" : textValue}
        selectTextOnFocus
        editable={!disabled}
      />
      <Pressable
        onPress={onIncrement}
        disabled={value >= max}
        style={styles.buttons}
      >
        {({ pressed }) => (
          <AntDesign
            name="plus"
            size={16}
            color={value >= max || disabled || pressed ? "lightgrey" : "black"}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 64,
    overflow: "hidden",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  input: { flexGrow: 6, flexShrink: 0, textAlign: "center" },
});
