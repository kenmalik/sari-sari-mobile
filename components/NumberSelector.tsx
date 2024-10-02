import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { Pressable, StyleProp, TextInput, View, ViewStyle } from "react-native";

type NumberSelectorProps = {
  max?: number;
  min?: number;
  value?: number;
  onSelect?: (selected: number) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function NumberSelector({
  max = Infinity,
  min = -Infinity,
  value = 1,
  onSelect,
  style,
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
    if (value >= max) {
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
    if (value <= min) {
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
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: 48,
        }}
      >
        <AntDesign
          name="minus"
          size={16}
          color={disabled ? "grey" : "black"}
          style={{
            marginLeft: 16,
          }}
        />
      </Pressable>
      <TextInput
        style={{ padding: 16, flex: 1, textAlign: "center" }}
        inputMode="numeric"
        onChangeText={setTextValue}
        onEndEditing={() => onTextInput(textValue)}
        value={disabled ? "" : textValue}
        selectTextOnFocus
        editable={!disabled}
      />
      <Pressable
        onPress={onIncrement}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          width: 48,
        }}
      >
        <AntDesign
          name="plus"
          size={16}
          color={disabled ? "grey" : "black"}
          style={{
            marginRight: 16,
          }}
        />
      </Pressable>
    </View>
  );
}
