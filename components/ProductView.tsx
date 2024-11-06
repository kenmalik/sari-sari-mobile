import {
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  StyleProp,
  ViewStyle,
  View,
} from "react-native";
import { ProductCard, ProductCardProps } from "./ProductCard";

export type ProductViewProps = {
  products: (ProductCardProps | null)[];
  onLoad: VoidFunction;
  hasNextPage: boolean;
  isLoading: boolean;
  HeaderComponent?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ComponentType<any>
    | null;
  style?: StyleProp<ViewStyle>;
};

export function ProductView({
  products,
  onLoad,
  hasNextPage,
  isLoading,
  HeaderComponent,
  style,
}: ProductViewProps) {
  if (products.length % 2 !== 0) {
    products.push(null);
  }
  return (
    <FlatList
      data={products}
      renderItem={({ item }) =>
        item ? (
          <ProductCard
            key={item.id}
            id={item.id}
            title={item.title}
            featuredImage={item.featuredImage}
            price={item.price}
            compareAtPrice={item.compareAtPrice}
            currency={item.currency}
            style={styles.card}
          />
        ) : (
          <View style={styles.card} />
        )
      }
      ListHeaderComponent={HeaderComponent}
      ListFooterComponent={
        <LoadMoreButton
          hasNextPage={hasNextPage}
          onLoad={onLoad}
          isLoading={isLoading}
        />
      }
      contentContainerStyle={[styles.container, style]}
      numColumns={2}
      columnWrapperStyle={{
        gap: 8,
      }}
    />
  );
}

function LoadMoreButton({ hasNextPage, onLoad, isLoading }: any) {
  if (hasNextPage) {
    return (
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
        <Text style={styles.buttonText}>
          {isLoading ? "Loading..." : "Load More"}
        </Text>
      </Pressable>
    );
  } else return null;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  card: {
    flex: 1,
    aspectRatio: "1 / 1.25",
  },
  loadMoreButton: {
    paddingVertical: 16,
    paddingHorizontal: 64,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: "grey",
    shadowOpacity: 100,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
  },
});
