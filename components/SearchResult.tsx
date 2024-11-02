import {
  View,
  Text,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Href, Link } from "expo-router";
import Feather from "@expo/vector-icons/build/Feather";
import { ReactElement } from "react";

type SearchResultProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
  title: string;
  link: Href;
  icon?: ReactElement | null;
};

export function SearchResult({
  style,
  title,
  link,
  icon,
  ...otherProps
}: SearchResultProps) {
  return (
    <Link href={link} asChild>
      <Pressable {...otherProps}>
        {({ pressed }) => (
          <View
            style={[
              { flexDirection: "row", gap: 16, alignItems: "center" },
              style,
            ]}
          >
            <Text
              style={{ flex: 1, color: pressed ? "grey" : "black" }}
              numberOfLines={1}
            >
              {title}
            </Text>
            <View
              style={{
                width: 24,
                height: 24,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {icon ? (
                icon
              ) : (
                <Feather name="arrow-up-left" size={24} color={"grey"} />
              )}
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}
