import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import {
  ApiService,
  Goal,
  Score,
  Venue,
  League,
  Team,
  leagueTranslationKey,
  matchLongStatusToKey,
  getFormattedDate,
  getFormattedTime,
  cleanLeagueName,
  buildMatchInfoSvgString,
  useCharteableMatchNow,
  useTopGuysAvailable,
} from "open-football-project-core";
import TeamDetailsInfo from "./team-details-info/TeamDetailsInfo";
import ShareSvgButton from "../../../general/share-svg-button/ShareSvgButton";
import MatchButton from "../../../general/match-button/MatchButton";
import ChartButton from "../../../general/chart-button/ChartButton";
import TopGuysButton from "../../../general/top-guys-button/TopGuysButton";
import {
  TrophyIcon,
  CalendarIcon,
  LocationPinIcon,
} from "../../../../icons/Icons";
import { colors, spacing, fontSize, fontWeight, borders, breakpoints } from "../../../../theme";
import type { RootStackParamList } from "../../../../navigation/RootNavigator";
import { Routes } from "../../../../navigation/RootNavigator";

interface DetailsMainInfoProps {
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  league: League;
  venue: Venue;
  goals: Goal;
  score: Score;
  statusLong: string;
  isLiveNow: boolean;
  fixtureId: number;
  apiService: ApiService;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DetailsMainInfo = ({
  homeTeam,
  awayTeam,
  date,
  league,
  venue,
  goals,
  score,
  statusLong,
  isLiveNow,
  fixtureId,
  apiService,
}: DetailsMainInfoProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const { isCharteableMatchNow } = useCharteableMatchNow(apiService, fixtureId);
  const { isTopGuysAvailable } = useTopGuysAvailable(apiService, fixtureId);

  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const handleLeaguePress = () => {
    if (league?.id) {
      navigation.navigate(Routes.LEAGUE, { leagueId: String(league.id) });
    }
  };

  const mainScoreFontSize = isLargeScreen
    ? fontSize.xxxxl
    : isTablet
    ? fontSize.xxxl
    : fontSize.xl;

  const scoreDetailsFontSize = isLargeScreen ? fontSize.base : fontSize.xs;
  const labelFontSize = isLargeScreen ? fontSize.xs : fontSize.xs;

  const leagueNameLabel = cleanLeagueName(
    t(`league.${leagueTranslationKey(league.name)}`, {
      defaultValue: league.name,
    }),
  );

  const statusLabel = !isLiveNow
    ? t(`matchstatuslong.${matchLongStatusToKey(statusLong)}`, {
        defaultValue: statusLong,
      })
    : undefined;

  const svgString = useMemo(
    () =>
      buildMatchInfoSvgString({
        homeTeamName: homeTeam.name,
        homeTeamLogo: homeTeam.logo,
        awayTeamName: awayTeam.name,
        awayTeamLogo: awayTeam.logo,
        goalsHome: goals.home,
        goalsAway: goals.away,
        score,
        leagueName: leagueNameLabel,
        leagueLogo: league.logo,
        venueName: venue.name,
        venueCity: venue.city,
        formattedDate: `${getFormattedDate(date)}, ${getFormattedTime(date)}`,
        statusLabel,
        labels: {
          ht: t("common.HT"),
          ft: t("common.FT"),
          et: t("common.ET"),
          pen: t("common.PEN"),
        },
      }),
    [
      homeTeam,
      awayTeam,
      goals,
      score,
      leagueNameLabel,
      league.logo,
      venue,
      date,
      statusLabel,
      t,
    ],
  );

  return (
    <View testID="details-main-info">
      <View style={styles.container}>
        <View style={styles.teamsAndScoreSection}>
          <View style={styles.teamColumn}>
            <TeamDetailsInfo team={homeTeam} />
          </View>

          <View style={styles.scoreSection}>
            <Text
              style={[styles.mainScore, { fontSize: mainScoreFontSize }]}
              testID="main-score"
            >
              {goals.home ?? "-"} : {goals.away ?? "-"}
            </Text>

            <View style={styles.scoreDetailsContainer}>
              <View style={styles.scoreDetail}>
                <Text
                  style={[styles.scoreLabel, { fontSize: labelFontSize }]}
                  testID="halftime-label"
                >
                  {t("common.HT")}
                </Text>
                <Text
                  style={[
                    styles.scoreValue,
                    { fontSize: scoreDetailsFontSize },
                  ]}
                  testID="halftime-score"
                >
                  {score.halftime?.home ?? "-"} : {score.halftime?.away ?? "-"}
                </Text>
              </View>

              <View style={styles.scoreDetail}>
                <Text
                  style={[styles.scoreLabel, { fontSize: labelFontSize }]}
                  testID="fulltime-label"
                >
                  {t("common.FT")}
                </Text>
                <Text
                  style={[
                    styles.scoreValue,
                    { fontSize: scoreDetailsFontSize },
                  ]}
                  testID="fulltime-score"
                >
                  {score.fulltime?.home ?? "-"} : {score.fulltime?.away ?? "-"}
                </Text>
              </View>

              {score?.extratime && (
                <View style={styles.scoreDetail}>
                  <Text
                    style={[styles.scoreLabel, { fontSize: labelFontSize }]}
                    testID="extratime-label"
                  >
                    {t("common.ET")}
                  </Text>
                  <Text
                    style={[
                      styles.scoreValue,
                      { fontSize: scoreDetailsFontSize },
                    ]}
                    testID="extratime-score"
                  >
                    {score?.extratime?.home ?? "-"} :
                    {score?.extratime?.away ?? "-"}
                  </Text>
                </View>
              )}

              {score?.penalty && (
                <View style={styles.scoreDetail}>
                  <Text
                    style={[styles.scoreLabel, { fontSize: labelFontSize }]}
                    testID="penalty-label"
                  >
                    {t("common.PEN")}
                  </Text>
                  <Text
                    style={[
                      styles.scoreValue,
                      { fontSize: scoreDetailsFontSize },
                    ]}
                    testID="penalty-score"
                  >
                    {score?.penalty?.home ?? "-"} :{" "}
                    {score?.penalty?.away ?? "-"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.teamColumn}>
            <TeamDetailsInfo team={awayTeam} />
          </View>
        </View>

        <View style={styles.matchInfoSection}>
          <Pressable
            onPress={handleLeaguePress}
            disabled={!league?.id}
            style={({ pressed }) => [
              styles.leagueLink,
              pressed && styles.pressedOpacity,
            ]}
            testID="league-link"
          >
            <View style={styles.leagueLinkInner}>
              <TrophyIcon size={fontSize.base} color={colors.brand.yellow} />
              <Text style={styles.leagueText}>{leagueNameLabel}</Text>
            </View>
          </Pressable>

          {(venue.name || venue.city) && (
            <View style={styles.venueDetails} testID="venue-details">
              <View style={styles.venueRow}>
                <LocationPinIcon size={fontSize.sm} />
                <Text style={styles.venueText}>
                  {[venue.name, venue.city].filter(Boolean).join(", ")}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.dateTimeRow}>
            <CalendarIcon size={fontSize.base} color={colors.brand.yellow} />
            <Text style={styles.matchDateTime} testID="match-date">
              {getFormattedDate(date)}, {getFormattedTime(date)}
            </Text>
          </View>

          {isLiveNow ? (
            <View testID="live-button-container">
              <MatchButton isLiveNow={isLiveNow} fixtureId={fixtureId} />
            </View>
          ) : (
            <Text style={styles.matchStatus} testID="match-status">
              {t(`matchstatuslong.${matchLongStatusToKey(statusLong)}`, {
                defaultValue: statusLong,
              })}
            </Text>
          )}

          {(isCharteableMatchNow || isTopGuysAvailable) && (
            <View style={styles.entryPointsRow}>
              {isCharteableMatchNow && <ChartButton fixtureId={fixtureId} />}
              {isTopGuysAvailable && <TopGuysButton fixtureId={fixtureId} />}
            </View>
          )}
        </View>

        <View style={styles.shareButtonContainer}>
          <ShareSvgButton svgString={svgString} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xxs,
    gap: spacing.lg,
  },

  teamsAndScoreSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },

  shareButtonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: borders.thin,
    borderTopColor: colors.secondary.dark,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.secondary.dark,
    alignItems: "flex-end",
  },

  teamColumn: {
    flex: 1,
    alignItems: "center",
  },

  scoreSection: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minWidth: 100,
  },

  mainScore: {
    color: colors.text.primary,
    fontWeight: fontWeight.extrabold,
    lineHeight: undefined,
  },

  scoreDetailsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
  },

  scoreDetail: {
    alignItems: "center",
  },
  scoreLabel: {
    color: colors.brand.orange,
    fontWeight: fontWeight.semibold,
  },
  scoreValue: {
    color: colors.text.primary,
    fontWeight: fontWeight.bold,
  },

  // Match Info Section
  matchInfoSection: {
    alignItems: "center",
    gap: spacing.sm,
  },

  leagueLink: {
    paddingVertical: spacing.xs,
  },
  leagueLinkInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  leagueText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textTransform: "uppercase",
    textAlign: "center",
    flexShrink: 1,
  },
  pressedOpacity: {
    opacity: 0.7,
  },

  venueDetails: {
    alignItems: "center",
  },
  venueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  venueText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textTransform: "uppercase",
    textAlign: "center",
    flexShrink: 1,
  },

  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  matchDateTime: {
    fontSize: fontSize.base,
    color: colors.brand.yellow,
    fontWeight: fontWeight.semibold,
    textAlign: "center",
  },

  matchStatus: {
    fontSize: fontSize.xs,
    color: colors.brand.orange,
    fontWeight: fontWeight.semibold,
    textAlign: "center",
  },

  entryPointsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
  },
});
