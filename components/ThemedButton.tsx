import { Pressable, type PressableProps, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedButtonProps = PressableProps &
  ViewProps & {
    lightColor?: string;
    darkColor?: string;
    lightPressedColor?: string;
    darkPressedColor?: string;
  };

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  lightPressedColor,
  darkPressedColor,
  ...otherProps
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tint",
  );
  const pressedColor = useThemeColor(
    { light: lightPressedColor, dark: darkPressedColor },
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
