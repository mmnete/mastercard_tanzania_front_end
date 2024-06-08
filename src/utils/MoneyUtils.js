/**
 * Formats a float as a string with commas and TZS currency.
 *
 * @param {number} num - The float number to be formatted.
 * @returns {string} - The formatted string with commas and TZS currency.
 */
export function formatCurrencyTZS(num) {
  if (isNaN(num)) return '';

  return `TZS ${num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}
