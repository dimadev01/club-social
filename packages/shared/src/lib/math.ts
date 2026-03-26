export const MathUtils = {
  percentage(part: number, total: number, decimals = 2): number {
    if (total === 0) return 0;
    return parseFloat(((part / total) * 100).toFixed(decimals));
  },
};
