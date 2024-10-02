import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { Pressable, StyleProp, TextInput, View, ViewStyle } from "react-native";

type NumberSelectorProps = {
  max?: number;
  min?: number;
  value?: number;
  onSelect?: (selected: number) => void;
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

  function onIncrement() {
    if (value < min) {
      setTextValue(min.toString());
      if (onSelect) {
        onSelect(min);
      }
      return;
    }
    let newAmount = value + 1;
    setTextValue(newAmount.toString());
    if (onSelect) {
      onSelect(newAmount);
    }
  }

  function onDecrement() {
    if (value > max) {
      setTextValue(max.toString());
      if (onSelect) {
        onSelect(max);
      }
      return;
    }
    let newAmount = value - 1;
    setTextValue(newAmount.toString());
    if (onSelect) {
      onSelect(newAmount);
    }
  }

  function onTextInput(newAmount: string) {
    let value: number = Number.parseInt(newAmount);
    if (isNaN(value)) {
      if (onSelect) {
        onSelect(0);
      }
      return;
    }
    if (onSelect) {
      onSelect(value);
    }
  }

  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: disabled ? "gainsboro" : "white",
          borderRadius: 64,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Pressable
        onPress={onDecrement}
        disabled={value <= min}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: 48,
        }}
      >
        {({ pressed }) => (
          <AntDesign
            name="minus"
            size={16}
            color={value <= min || disabled || pressed ? "lightgrey" : "black"}
            style={{
              marginLeft: 16,
            }}
          />
        )}
      </Pressable>
      <TextInput
        style={[{ flex: 1, textAlign: "center" }, textContainerStyle]}
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
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          width: 48,
        }}
      >
        {({ pressed }) => (
          <AntDesign
            name="plus"
            size={16}
            color={value >= max || disabled || pressed ? "lightgrey" : "black"}
            style={{
              marginRight: 16,
            }}
          />
        )}
      </Pressable>
    </View>
  );
}
