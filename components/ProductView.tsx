import {
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  StyleProp,
  ViewStyle,
} from "react-native";
import { ProductCard, ProductCardProps } from "./ProductCard";

export type ProductViewProps = {
  products: ProductCardProps[];
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
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          key={item.id}
          id={item.id}
          title={item.title}
          featuredImage={item.featuredImage}
          price={item.price}
          currency={item.currency}
        />
      )}
      ListHeaderComponent={HeaderComponent}
      ListFooterComponent={() => (
        <Footer
          hasNextPage={hasNextPage}
          onLoad={onLoad}
          isLoading={isLoading}
        />
      )}
      contentContainerStyle={[styles.container, style]}
    />
  );
}

function Footer({ hasNextPage, onLoad, isLoading }: any) {
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
        <Text style={styles.buttonText}>Load More</Text>
      </Pressable>
    );
  } else return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
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
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
  },
});
