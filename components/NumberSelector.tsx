import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export function NumberSelector({ max, min }: { max: number; min: number }) {
  const [displayValue, setDisplayValue] = useState<string>("1");
  const [amount, setAmount] = useState<number>(1);

  function onIncrement() {
    if (amount < min) {
      setAmount(min);
      setDisplayValue(min.toString());
      return;
    }
    if (amount >= max) {
      return;
    }
    let newAmount = amount + 1;
    setAmount(newAmount);
    setDisplayValue(newAmount.toString());
  }

  function onDecrement() {
    if (amount > max) {
      setAmount(max);
      setDisplayValue(max.toString());
      return;
    }
    if (amount <= min) {
      return;
    }
    let newAmount = amount - 1;
    setAmount(newAmount);
    setDisplayValue(newAmount.toString());
  }

  function onChangeAmount(newAmount: string) {
    let amount: number = Number.parseInt(newAmount);
    if (isNaN(amount)) {
      setAmount(1);
      setDisplayValue(newAmount);
      return;
    }
    setAmount(amount);
    setDisplayValue(newAmount.toString());
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: 64,
        marginBottom: 16,
        overflow: "hidden",
      }}
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
          color="black"
          style={{
            marginLeft: 16,
          }}
        />
      </Pressable>
      <TextInput
        style={{ padding: 16 }}
        inputMode="numeric"
        onChangeText={onChangeAmount}
        value={displayValue}
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
          color="black"
          style={{
            marginRight: 16,
          }}
        />
      </Pressable>
    </View>
  );
}
