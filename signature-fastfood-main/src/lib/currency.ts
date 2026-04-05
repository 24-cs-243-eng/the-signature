/**
 * Format a price in PKR (Pakistani Rupees)
 */
export const formatPKR = (price: number): string => {
  return `Rs. ${price.toLocaleString("en-PK")}`;
};
