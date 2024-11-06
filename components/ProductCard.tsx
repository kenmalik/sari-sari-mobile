import AntDesign from "@expo/vector-icons/AntDesign";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";

export type ProductCardProps = {
  id: string;
  title: string;
  featuredImage: { id: string; url: string } | null;
  price: number;
  compareAtPrice: number;
  currency: string;
  style?: StyleProp<ViewStyle>;
};

export function ProductCard({
  id,
  title,
  featuredImage,
  price,
  compareAtPrice,
  currency,
  style,
}: ProductCardProps) {
  return (
    <Link
      href={{
        pathname: "/(pages)/products/[id]",
        params: { id: id },
      }}
      asChild
    >
      <Pressable style={style}>
        {({ pressed }) => (
          <View style={styles.card}>
            {featuredImage ? (
              <Image
                style={[styles.cardImage, pressed ? { opacity: 0.5 } : null]}
                source={{ uri: featuredImage.url }}
              />
            ) : (
              <View style={[styles.cardImage, styles.cardNoImage]}>
                <AntDesign name="picture" size={64} color="lightgrey" />
              </View>
            )}
            <Text
              style={[styles.cardTitle, pressed ? { color: "grey" } : null]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text style={styles.cardPrice}>
              <Text style={pressed ? { color: "grey" } : null}>
                {currency === "USD" && "$"}
                {Number(price).toFixed(2)}
                {currency !== "USD" && ` ${currency}`}
              </Text>
              {compareAtPrice > price && (
                <>
                  <Text> </Text>
                  <Text
                    style={[
                      styles.compareAtPrice,
                      pressed ? { color: "grey" } : null,
                    ]}
                  >
                    {currency === "USD" && "$"}
                    {Number(compareAtPrice).toFixed(2)}
                    {currency !== "USD" && ` ${currency}`}
                  </Text>
                </>
              )}
            </Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    shadowColor: "lightgrey",
    shadowOpacity: 50,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    width: "100%",
    height: "100%",
  },
  cardTitle: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 2,
  },
  cardImage: {
    width: "100%",
    flexGrow: 1,
    objectFit: "contain",
  },
  cardNoImage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardPrice: {
    textAlign: "center",
    marginTop: 2,
  },
  compareAtPrice: {
    color: Colors.secondaryHighlight,
    textDecorationLine: "line-through",
  },
});
