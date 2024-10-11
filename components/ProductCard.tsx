import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Link } from "expo-router";

export type ProductCardProps = {
  id: string;
  title: string;
  featuredImage: { id: string; url: string } | null;
  price: number;
  currency: string;
};

export function ProductCard({
  id,
  title,
  featuredImage,
  price,
  currency,
}: ProductCardProps) {
  return (
    <Link
      href={{
        pathname: "/(pages)/products/[id]",
        params: { id: id },
      }}
      asChild
    >
      <Pressable style={styles.card}>
        {({ pressed }) => (
          <>
            <Text
              style={[styles.cardTitle, pressed ? { color: "grey" } : null]}
            >
              {title}
            </Text>
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
              style={[styles.cardPrice, pressed ? { color: "grey" } : null]}
            >
              {currency === "USD" && "$"}
              {Number(price).toFixed(2)}
              {currency !== "USD" && ` ${currency}`}
            </Text>
          </>
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
  },
  cardTitle: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 2,
  },
  cardImage: {
    width: "100%",
    height: 256,
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
});
