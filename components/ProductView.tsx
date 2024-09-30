import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { ProductCard, ProductCardProps } from "./ProductCard";
import { ReactNode } from "react";

export type ProductViewProps = {
  products: ProductCardProps[];
  onLoad: VoidFunction;
  hasNextPage: boolean;
  isLoading: boolean;
  titleBlock?: ReactNode;
};

export function ProductView({
  products,
  onLoad,
  hasNextPage,
  isLoading,
  titleBlock,
}: ProductViewProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {titleBlock}
      <View style={styles.cardContainer}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            featuredImage={product.featuredImage}
            price={product.price}
            currency={product.currency}
          />
        ))}
      </View>
      {hasNextPage && (
        <Pressable
          onPress={onLoad}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgb(33, 39, 186)" : "rgb(3, 9, 156)",
            },
            styles.loadMoreButton,
          ]}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Load More</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
  },
  loadMoreButton: {
    paddingVertical: 16,
    paddingHorizontal: 64,
    marginTop: 16,
    marginBottom: 64,
    shadowColor: "grey",
    shadowOpacity: 100,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "white",
  },
});
