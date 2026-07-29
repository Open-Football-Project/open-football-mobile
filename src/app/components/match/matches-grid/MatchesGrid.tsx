import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import {
  ApiService,
  cleanLeagueName,
  leagueTranslationKey,
  DayMatches as DayMatchesType,
  dayMatchesToFixtureRound,
  buildFixtureSvgString,
} from "@matchinsights/core";

import { RootStackParamList, Routes } from "../../../navigation/RootNavigator";
import Logo from "../../general/logo/Logo";
import DayMatches from "./day-matches/DayMatches";
import { ChevronRightIcon } from "../../../icons/Icons";
import ShareSvgButton from "../../general/share-svg-button/ShareSvgButton";

import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  borders,
  shadows,
} from "../../../theme";

interface Props {
  league: DayMatchesType;
  apiService: ApiService;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MatchesGrid = ({ league, apiService }: Props) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [isSharing, setIsSharing] = useState(false);

  const handlePress = useCallback(() => {
    navigation.navigate(Routes.LEAGUE, {
      leagueId: String(league.leagueId),
    });
  }, [league.leagueId, navigation]);

  const leagueDisplayedName = cleanLeagueName(
    t(`league.${leagueTranslationKey(league.leagueName)}`, {
      defaultValue: league.leagueName,
    })
  );

  const round = dayMatchesToFixtureRound(league);

  const svgString = isSharing
    ? buildFixtureSvgString(
        round,
        leagueDisplayedName,
        league.leagueLogo ?? undefined
      )
    : "";

  return (
    <View style={styles.card} testID={`league-card-${league.leagueId}`}>
      <View style={styles.header}>
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.headerLink,
            pressed && styles.headerPressed,
          ]}
          testID={`league-header-${league.leagueId}`}
        >
          <Logo src={league.leagueLogo ?? undefined} size={14} />

          <Text style={styles.title} numberOfLines={1}>
            {leagueDisplayedName}
          </Text>

          <View style={styles.shareButtonWrapper}>
            <ShareSvgButton
              svgString={svgString}
              onPress={() => setIsSharing(true)}
            />
          </View>

          <ChevronRightIcon
            size={fontSize.lg}
            color={colors.text.secondary}
            testID={`league-chevron-${league.leagueId}`}
          />
        </Pressable>
      </View>

      <DayMatches matches={league.matches} apiService={apiService} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,

    borderWidth: borders.thin,
    borderColor: colors.brand.dona,

    marginHorizontal: spacing.xs,

    ...shadows.sm,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  headerLink: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,

    backgroundColor: colors.background.overlay,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,

    marginHorizontal: spacing.xs,
  },

  headerPressed: {
    opacity: 0.7,
  },

  title: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    textTransform: "uppercase",
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
  },

  shareButtonWrapper: {
    marginHorizontal: spacing.xs,
  },
});

export default MatchesGrid;
