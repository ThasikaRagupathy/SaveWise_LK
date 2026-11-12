/**
 * Currency utility functions for Sri Lankan Rupee (LKR)
 */

export function formatLKR(amount: number, showDecimals = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatted = new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(absAmount);

  return `${isNegative ? "-" : ""}Rs. ${formatted}`;
}

export function formatLKRSymbol(amount: number): string {
  return formatLKR(amount, false);
}

export function parseLKR(val: string): number {
  const cleaned = val.replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
