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
          count: 20,
          cursor: null,
        },
      })
      .then(({ data, errors, extensions }) => {
        console.log(data);
        const page: any[] = data.products.edges.map((edge: any) => ({
          ...edge.node,
          price: edge.node.priceRange.minVariantPrice.amount,
          currency: edge.node.priceRange.minVariantPrice.currencyCode,
        }));
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
          featuredImage={product.featuredImage}
          price={product.price}
          currency={product.currency}
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
          featuredImage {
            id
            url
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
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
