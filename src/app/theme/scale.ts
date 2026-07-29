import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const s = scale;
export const vs = verticalScale;

// Default factor 0.1 — component-specific pixel values (e.g. table column widths)
// scale gently so layouts don't over-expand on tablets/TV
export const ms = (size: number, factor = 0.1) => moderateScale(size, factor);
