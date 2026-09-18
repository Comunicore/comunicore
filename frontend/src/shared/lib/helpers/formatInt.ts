export const formatInt = (views: number | null | undefined): string => {
  const value = typeof views === 'number' && Number.isFinite(views) ? views : 0;

  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'м';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'к';
  }
  return value.toString();
};
