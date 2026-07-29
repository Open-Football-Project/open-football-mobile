import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Routes } from "../../../navigation/RootNavigator";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadows,
  sizes,
} from "../../../theme";

interface MatchButtonProps {
  isLiveNow: boolean;
  fixtureId: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MatchButton = ({ isLiveNow, fixtureId }: MatchButtonProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (isLiveNow) {
      navigation.navigate(Routes.LIVE, { fixtureId: String(fixtureId) });
    } else {
      navigation.navigate(Routes.MATCH_DETAILS, { matchId: String(fixtureId) });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        isLiveNow ? styles.liveButton : styles.detailButton,
        pressed && styles.buttonPressed,
      ]}
      testID={isLiveNow ? "live-now-button" : "match-details-button"}
    >
      <Text
        style={[
          styles.buttonText,
          isLiveNow ? styles.liveButtonText : styles.detailButtonText,
        ]}
      >
        {isLiveNow ? t("matchbtn.live") : t("matchbtn.detail")}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: sizes.matchButtonMinWidth,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  liveButton: {
    backgroundColor: colors.brand.success,
  },
  detailButton: {
    backgroundColor: colors.brand.aqua,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  liveButtonText: {
    color: colors.text.primary,
  },
  detailButtonText: {
    color: colors.text.primary,
  },
});

export default MatchButton;
