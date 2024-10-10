import AntDesign from "@expo/vector-icons/AntDesign";
import { useRef, useState } from "react";
import { Pressable, StyleProp, TextInput, View, ViewStyle } from "react-native";

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
        ref={inputRef}
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
