import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export type ProductListItemProps = {
  variantId: string;
  productId: string;
  title: string;
  featuredImage: { id: string; url: string } | null;
  price: number;
  currency: string;
  quantity: number;
};

export default function ProductListItem({
  productId,
  title,
  featuredImage,
  price,
  currency,
  quantity,
}: ProductListItemProps) {
  return (
    <Link
      href={{
        pathname: "/(pages)/products/[id]",
        params: { id: productId },
      }}
      asChild
    >
      <Pressable style={styles.container}>
        {featuredImage ? (
          <Image source={{ uri: featuredImage.url }} style={styles.image} />
        ) : (
          <View
            style={[
              styles.image,
              { alignItems: "center", justifyContent: "center" },
            ]}
          >
            <AntDesign name="picture" size={64} color="lightgrey" />
          </View>
        )}

        <View style={styles.info}>
          <Text>{title}</Text>
          <Text>
            {currency === "USD" ? `\$${price}` : `${price} ${currency}`}
          </Text>
          <Text>Quantity: {quantity}</Text>
          <Text>Delete</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 8,
  },
  image: {
    width: 128,
    aspectRatio: "1 / 1",
    objectFit: "contain",
    marginRight: 8,
  },
  info: {
    padding: 8,
  },
});
