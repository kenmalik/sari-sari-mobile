import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, StyleSheet, Image } from "react-native";

export type ProductCardProps = {
  id: string;
  title: string;
  handle: string;
  featuredImage?: { id: string; url: string };
  priceRange: { minVariantPrice: number; maxVariantPrice: number };
};

export default function ProductCard({
  id,
  title,
  handle,
  featuredImage,
  priceRange,
}: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {featuredImage ? (
        <Image style={styles.cardImage} source={{ uri: featuredImage.url }} />
      ) : (
        <View style={[styles.cardImage, styles.cardNoImage]}>
          <AntDesign name="picture" size={64} color="lightgrey" />
        </View>
      )}
    </View>
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
});
