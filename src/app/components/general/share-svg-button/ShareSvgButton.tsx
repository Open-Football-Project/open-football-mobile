import React, { useCallback, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import ViewShot from "react-native-view-shot";
import { SvgXml } from "react-native-svg";
import RNShare from "react-native-share";
import { useTranslation } from "react-i18next";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  opacity,
  sizes,
} from "../../../theme";

interface ShareSvgButtonProps {
  svgString: string;
  label?: string;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
}

const ShareSvgButton = ({
  svgString,
  label,
  backgroundColor,
  textColor,
  onPress,
}: ShareSvgButtonProps) => {
  const [sharing, setSharing] = useState(false);
  const [shotMounted, setShotMounted] = useState(false);
  const pendingCapture = useRef(false);
  const viewShotRef = useRef<ViewShot>(null);
  const { t } = useTranslation();

  const onViewShotMount = useCallback((ref: ViewShot | null) => {
    viewShotRef.current = ref;
    if (ref && pendingCapture.current) {
      pendingCapture.current = false;
      ref.capture!()
        .then((uri) =>
          RNShare.open({ url: uri, type: "image/png", failOnCancel: false }),
        )
        .catch(() => {})
        .finally(() => setSharing(false));
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (sharing) return;
    onPress?.();
    setSharing(true);
    if (!shotMounted) {
      pendingCapture.current = true;
      setShotMounted(true);
      return;
    }
    try {
      const uri = await viewShotRef.current!.capture!();
      await RNShare.open({ url: uri, type: "image/png", failOnCancel: false });
    } catch {
    } finally {
      setSharing(false);
    }
  }, [sharing, shotMounted, onPress]);

  return (
    <>
      <Pressable
        testID="share-button"
        onPress={handleShare}
        disabled={sharing}
        accessibilityState={{ disabled: sharing }}
        style={({ pressed }) => [
          styles.shareButton,
          backgroundColor ? { backgroundColor } : undefined,
          pressed && styles.shareButtonPressed,
          sharing && styles.shareButtonDisabled,
        ]}
      >
        <Text
          style={[
            styles.shareButtonText,
            textColor ? { color: textColor } : undefined,
          ]}
        >
          {label ?? t("common.share", { defaultValue: "Compartir" })}
        </Text>
      </Pressable>

      {shotMounted && (
        <View pointerEvents="none" style={styles.hiddenShot}>
          <ViewShot
            ref={onViewShotMount}
            options={{ format: "png", quality: 1 }}
          >
            <SvgXml xml={svgString} />
          </ViewShot>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  shareButton: {
    minWidth: sizes.matchButtonMinWidth,
    backgroundColor: colors.brand.yellow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  shareButtonPressed: {
    opacity: opacity.hover,
  } as ViewStyle,
  shareButtonDisabled: {
    opacity: opacity.disabled,
  } as ViewStyle,
  shareButtonText: {
    color: colors.background.dark,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  hiddenShot: {
    position: "absolute",
    top: -9999,
    left: -9999,
  } as ViewStyle,
});

export default ShareSvgButton;
