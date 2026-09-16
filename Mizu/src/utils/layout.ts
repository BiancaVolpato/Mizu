// Reserve the device's system navigation area in addition to touchable tab content.
export const tabBarMetrics = (bottomInset: number, fontScale = 1) => ({
  height: 72 + Math.max(0, bottomInset) + Math.ceil(16 * Math.max(0, fontScale - 1)),
  paddingBottom: 10 + Math.max(0, bottomInset),
});
