export const CREATE_CART = `
  mutation CreateCart {
    cartCreate {
      cart {
        id
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
      }
    }
  }
`;

export const VIEW_CART = `
query GetCart($cartId: ID!) {
  cart(id: $cartId) {
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 10) {
      edges {
        node {
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
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
