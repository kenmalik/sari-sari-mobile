import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { NumberSelector } from "./NumberSelector";
import { ThemedButton } from "./ThemedButton";
import { Colors } from "@/constants/Colors";

export type ProductListItemProps = {
  lineId: string;
  variantId: string;
  productId: string;
  variantTitle: string;
  productTitle: string;
  featuredImage: { id: string; url: string } | null;
  price: number;
  currency: string;
  quantity: number;
  onDelete?: VoidFunction;
  quantityAvailable: number;
  onQuantityChange?: (newQuantity: number) => void;
};

export default function ProductListItem({
  productId,
  productTitle,
  variantTitle,
  featuredImage,
  price,
  currency,
  quantity,
  quantityAvailable,
  onDelete,
  onQuantityChange,
}: ProductListItemProps) {
  const variantColor = Colors["tintDimmed"];

  return (
    <Link
      href={{
        pathname: "/(pages)/products/[id]",
        params: { id: productId },
      }}
      asChild
    >
      <Pressable style={styles.container}>
        <View style={styles.header}>
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
            <View style={styles.title}>
              <Text
                style={{
                  marginBottom: variantTitle === "Default Title" ? null : 4,
                }}
              >
                {productTitle}
              </Text>
              {variantTitle === "Default Title" ? null : (
                <Text style={{ color: variantColor }}>{variantTitle}</Text>
              )}
            </View>
            <Text style={styles.price}>
              {currency === "USD" ? `\$${price}` : `${price} ${currency}`}
            </Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <NumberSelector
            style={styles.numberSelector}
            textContainerStyle={{ padding: 8 }}
            max={quantityAvailable}
            min={0}
            value={quantity}
            onSelect={(selected) =>
              onQuantityChange ? onQuantityChange(selected) : null
            }
          />
          <ThemedButton style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </ThemedButton>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 8,
  },
  image: {
    width: 128,
    aspectRatio: "1 / 1",
    objectFit: "contain",
    marginRight: 8,
  },
  info: {
    flex: 1,
    padding: 8,
  },
  header: {
    flexDirection: "row",
    marginBottom: 8,
  },
  buttons: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    color: "white",
  },
  numberSelector: {
    minWidth: "40%",
    maxWidth: "60%",
    borderWidth: 0.8,
    borderColor: "black",
  },
  price: {
    fontWeight: "bold",
    fontSize: 24,
  },
  title: {
    marginBottom: 8,
  },
});
