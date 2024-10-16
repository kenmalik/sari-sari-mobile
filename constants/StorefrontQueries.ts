export const CREATE_CART = `
mutation CreateCart {
  cartCreate {
    cart {
      id
      checkoutUrl
      totalQuantity
    }
  }
}
`;

export const BUY_NOW = `
mutation BuyNow($lines: [CartLineInput!]!) {
  cartCreate(
    input: {
      lines: $lines,
    }
  ) {
    cart {
      checkoutUrl
    }
  }
}
`;

export const ADD_TO_CART = `
mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      checkoutUrl
      totalQuantity
    }
  }
}
`;

export const VIEW_CART = `
query GetCart($cartId: ID!) {
  cart(id: $cartId) {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              quantityAvailable
              image {
                id
                url
              }
              price {
                amount
                currencyCode
              }
              product {
                id
                title
              }
            }
          }
        }
      }
    }
  }
}
`;

export const REMOVE_FROM_CART = `
mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      id
      checkoutUrl
      totalQuantity
    }
    userErrors {
      field
      message
    }
  }
}
`;

export const UPDATE_ITEM_IN_CART = `
mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      id
      checkoutUrl
    }
    userErrors {
      field
      message
    }
  }
}
`;

export const GET_COLLECTIONS = `
query CollectionQuery($count: Int, $cursor: String) {
  collections(first: $count, after: $cursor) {
      edges {
        node {
          id
          title
          image {
            altText
            id
            url
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
}
`;

export const PREDICTIVE_SEARCH = `
query PredictiveSearch($query: String!, $maxResults: Int) {
  predictiveSearch(query: $query, limit: $maxResults) {
    products {
      id
      title
    }
    collections {
      id
      title
    }
  }
}
`;

export const SEARCH = `
query Search($query: String!, $count: Int, $cursor: String) {
  search(query: $query, first: $count, after: $cursor, types: PRODUCT) {
    edges {
      node {
        ... on Product {
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
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

export const GET_PRODUCT_INFO = `
query ProductQuery($id: ID!) {
  product(id: $id) {
    title
    description
    featuredImage {
      id
      url
    }
    images(first: 5) {
      edges {
        node {
          id
          url
        }
      }
    }
  }
}
`;
export const GET_VARIANTS = `
query Variants($productId: ID!, $count: Int!, $cursor: String) {
  product(id: $productId) {
    variants(first: $count, after: $cursor) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          quantityAvailable
          image {
            id
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
`;

export const GET_PRODUCT_PAGE = `
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

export const GET_COLLECTION_INFO = `
  query($id: ID!) {
    collection(id: $id) {
      title
      description
    }
  }
`;

export const GET_COLLECTION_PRODUCTS = `
  query($id: ID!, $count: Int, $cursor: String) {
    collection(id: $id) {
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
          endCursor
          hasNextPage
        }
      }
    }
  }
`;
