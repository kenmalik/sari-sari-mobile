import { Colors } from "@/constants/Colors";
import { Pressable, type PressableProps, type ViewProps } from "react-native";

export type ThemedButtonProps = PressableProps &
  ViewProps & {
    lightColor?: string;
    lightPressedColor?: string;
    lightDisabledColor?: string;
  };

export function ThemedButton({
  style,
  lightColor,
  lightPressedColor,
  lightDisabledColor,
  ...otherProps
}: ThemedButtonProps) {
  const backgroundColor = otherProps.disabled
    ? Colors["tintDimmed"]
    : lightColor
      ? lightColor
      : Colors["tint"];
  const pressedColor = lightPressedColor
    ? lightPressedColor
    : Colors["tintHighlight"];

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? pressedColor : backgroundColor,
          borderRadius: 64,
          overflow: "hidden",
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
