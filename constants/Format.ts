export type Price = {
  amount: number;
  currencyCode: string;
};

export function formatPrice(price: Price): string {
  return price.currencyCode === "USD"
    ? `$${price.amount}`
    : `${price.amount} ${price.currencyCode}`;
}
