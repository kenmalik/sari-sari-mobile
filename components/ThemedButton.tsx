import { Pressable, type PressableProps, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

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
    ? useThemeColor(
        {
          light: lightDisabledColor,
        },
        "tintDimmed",
      )
    : useThemeColor(
        {
          light: lightColor,
        },
        "tint",
      );
  const pressedColor = useThemeColor(
    { light: lightPressedColor },
    "tintHighlight",
  );

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
