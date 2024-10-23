import { Colors } from "@/constants/Colors";
import { Pressable, type PressableProps, type ViewProps } from "react-native";

export type ThemedButtonProps = PressableProps &
  ViewProps & {
    color?: string;
    pressedColor?: string;
    disabledColor?: string;
  };

export function ThemedButton({
  style,
  color,
  pressedColor,
  disabledColor,
  ...otherProps
}: ThemedButtonProps) {
  const backgroundColor = otherProps.disabled
    ? Colors["tintDimmed"]
    : color
      ? color
      : Colors["tint"];
  const pressColor = pressedColor ? pressedColor : Colors["tintHighlight"];

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? pressColor : backgroundColor,
          borderRadius: 64,
          overflow: "hidden",
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
