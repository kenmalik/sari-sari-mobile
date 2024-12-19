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
import { Price, formatPrice } from "@/constants/Format";

export type ProductCardProps = {
  id: string;
  title: string;
  featuredImage: { id: string; url: string } | null;
  price: Price;
  compareAtPrice: Price;
  style?: StyleProp<ViewStyle>;
};

export function ProductCard({
  id,
  title,
  featuredImage,
  price,
  compareAtPrice,
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
        <View style={styles.card}>
          {featuredImage ? (
            <Image
              style={styles.cardImage}
              source={{ uri: featuredImage.url }}
            />
          ) : (
            <View style={[styles.cardImage, styles.cardNoImage]}>
              <AntDesign name="picture" size={64} color="lightgrey" />
            </View>
          )}
          <Text style={styles.cardTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.cardPrice}>
            <Text>{formatPrice(price)}</Text>
            {compareAtPrice.amount > price.amount && (
              <>
                <Text> </Text>
                <Text style={styles.compareAtPrice}>
                  {formatPrice(compareAtPrice)}
                </Text>
              </>
            )}
          </Text>
        </View>
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
