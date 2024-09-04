import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export type ProductCardProps = {
  id: string;
  title: string;
  featuredImage?: { id: string; url: string };
  price: number;
  currency: string;
};

export default function ProductCard({
  id,
  title,
  featuredImage,
  price,
  currency,
}: ProductCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => console.log(`Opening item ${id}`)}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      {featuredImage ? (
        <Image style={styles.cardImage} source={{ uri: featuredImage.url }} />
      ) : (
        <View style={[styles.cardImage, styles.cardNoImage]}>
          <AntDesign name="picture" size={64} color="lightgrey" />
        </View>
      )}
      <Text style={styles.cardPrice}>
        {currency === "USD" && "$"}
        {price}
        {currency !== "USD" && ` ${currency}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 32,
    marginLeft: 64,
    marginRight: 64,
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
