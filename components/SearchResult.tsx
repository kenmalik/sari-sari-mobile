import {
  View,
  Text,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/build/Feather";

type SearchResultProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
  title: string;
  productId: string;
};

export function SearchResult({
  style,
  title,
  productId,
  ...otherProps
}: SearchResultProps) {
  return (
    <Link
      href={{ pathname: "/(pages)/products/[id]", params: { id: productId } }}
      asChild
      replace
    >
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
            <Feather
              name="arrow-up-left"
              size={24}
              color={pressed ? "black" : "grey"}
            />
          </View>
        )}
      </Pressable>
    </Link>
  );
}
