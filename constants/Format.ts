export type Price = {
  amount: number;
  currencyCode: string;
};

export function formatPrice(price: Price): string {
  const amount = Number(price.amount).toFixed(2);
  return price.currencyCode === "USD"
    ? `$${amount}`
    : `${amount} ${price.currencyCode}`;
}
