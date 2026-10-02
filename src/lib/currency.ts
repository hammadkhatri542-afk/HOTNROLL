/**
 * Currency utility for Pakistani Rupees (PKR / Rs.)
 */

export function formatPrice(amount: number): string {
  const rounded = Math.round(amount);
  return `Rs. ${rounded.toLocaleString('en-PK')}`;
}

export function formatPriceNum(amount: number): string {
  return Math.round(amount).toLocaleString('en-PK');
}

export const CURRENCY_SYMBOL = 'Rs.';
