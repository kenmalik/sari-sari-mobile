import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ShopifyContext } from "../ShopifyContext";
import ProductCard, { ProductCardProps } from "@/components/ProductCard";

export default function Index() {
  const shopifyClient = useContext(ShopifyContext);
  const [products, setProducts] = useState<ProductCardProps[]>([]);

  useEffect(() => {
    if (!shopifyClient) {
      return;
    }

    shopifyClient
      .request(pageQuery, {
        variables: {
          count: 6,
          cursor: null,
        },
      })
      .then(({ data, errors, extensions }) => {
        console.log(data);
        const page: ProductCardProps[] = data.products.edges.map(
          (edge: { node: ProductCardProps }) => edge.node,
        );
        console.log(page);
        setProducts(page);

        if (errors || extensions) {
          console.log(errors);
          console.log(extensions);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <ScrollView>
      <Text style={styles.pageTitle}>Products</Text>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          handle={product.handle}
          featuredImage={product.featuredImage}
          priceRange={product.priceRange}
        />
      ))}
    </ScrollView>
  );
}

const pageQuery = `
  query PageQuery($count: Int, $cursor: String) {
    products(first: $count, after: $cursor) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            id
            url
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 32,
    textAlign: "center",
  },
});
