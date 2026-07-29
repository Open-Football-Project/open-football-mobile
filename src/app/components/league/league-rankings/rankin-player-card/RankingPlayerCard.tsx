import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import {
  LeagueRankingPlayer,
  buildPlayerCardSvgString,
  PlayerSvgLabel,
  PlayerSvgLabels,
  obscurePlayerName,
} from "open-football-project-core";
import type { RootStackParamList } from "../../../../navigation/RootNavigator";
import { Routes } from "../../../../navigation/RootNavigator";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadows,
  breakpoints,
} from "../../../../theme";
import ShareSvgButton from "../../../general/share-svg-button/ShareSvgButton";

const PLAYER_FALLBACK_PHOTO = Image.resolveAssetSource(
  require("../../../../assets/images/player.png"),
).uri;

interface RankingPlayerCardProps {
  player: LeagueRankingPlayer;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RankingPlayerCard = ({ player }: RankingPlayerCardProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet;

  const handleViewTeam = () => {
    navigation.navigate(Routes.TEAM_DETAILS, {
      teamId: String(player.playerTeamId),
    });
  };

  const handleViewPlayer = () => {
    navigation.navigate(Routes.PLAYER_HISTORY, {
      playerId: String(player.playerId),
    });
  };

  const imageSize = isLargeScreen ? 100 : isTablet ? 90 : 70;

  const labels: PlayerSvgLabels = new Map([
    [PlayerSvgLabel.AGE, t("common.age")],
    [PlayerSvgLabel.GOALS, t("common.goals")],
    [PlayerSvgLabel.ASSISTS, t("common.assists")],
    [PlayerSvgLabel.YELLOW_CARDS, t("common.y_cards")],
    [PlayerSvgLabel.RED_CARDS, t("common.r_cards")],
    [PlayerSvgLabel.APPEARANCES, t("common.appearences")],
  ]);

  const cardData = {
    playerName: player.playerName,
    playerPhoto: player.playerPhoto ?? PLAYER_FALLBACK_PHOTO,
    playerAge: player.playerAge,
    playerTeamName: player.playerTeamName,
    playerTeamLogo: player.playerTeamLogo ?? "",
    goals: player.playerTotalGoals,
    assists: player.playerTotalAssists,
    yellowCards: player.playerTotalYellowCards,
    redCards: player.playerTotalRedCards,
    appearances: player.playerTotalAppearances,
  };

  const svgString = buildPlayerCardSvgString(cardData, labels);
  const quizSvgString = buildPlayerCardSvgString(
    {
      ...cardData,
      playerName: obscurePlayerName(player.playerName),
      playerPhoto: PLAYER_FALLBACK_PHOTO,
    },
    labels,
  );

  return (
    <View style={styles.container} testID="ranking-player-card">
      <View style={styles.card}>
        <View
          style={[styles.imageContainer, { height: imageSize + spacing.lg }]}
        >
          <View
            style={[
              styles.imageWrapper,
              { width: imageSize, height: imageSize },
            ]}
          >
            <Image
              source={{ uri: player.playerPhoto }}
              testID="player-photo"
              style={styles.playerImage}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text
            style={styles.playerName}
            numberOfLines={2}
            testID="player-name"
          >
            {player.playerName}
          </Text>

          {player.playerAge !== undefined && (
            <Text style={styles.ageText} testID="player-age">
              {t("common.age")}: {player.playerAge}
            </Text>
          )}

          <View style={styles.teamContainer}>
            <Image
              source={{ uri: player.playerTeamLogo }}
              testID="team-logo"
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <Text style={styles.teamName} numberOfLines={1}>
              {player.playerTeamName}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue} testID="goals-value">
                  {player.playerTotalGoals}
                </Text>
                <Text style={styles.statLabel} testID="goals" numberOfLines={1}>
                  {t("common.goals")}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue} testID="assists-value">
                  {player.playerTotalAssists}
                </Text>
                <Text
                  style={styles.statLabel}
                  testID="assists"
                  numberOfLines={1}
                >
                  {t("common.assists")}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue} testID="appearances-value">
                  {player.playerTotalAppearances}
                </Text>
                <Text
                  style={styles.statLabel}
                  testID="appearences"
                  numberOfLines={1}
                >
                  {t("common.appearences")}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, styles.yellowCardValue]}
                  testID="y-cards-value"
                >
                  {player.playerTotalYellowCards}
                </Text>
                <Text style={styles.statLabel} testID="y-cards">
                  {t("common.y_cards")}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, styles.redCardValue]}
                  testID="r-cards-value"
                >
                  {player.playerTotalRedCards}
                </Text>
                <Text style={styles.statLabel} testID="r-cards">
                  {t("common.r_cards")}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.shareContainer}>
            <ShareSvgButton svgString={svgString} />
            <ShareSvgButton
              svgString={quizSvgString}
              label={t("common.genquiz")}
              backgroundColor={colors.brand.purplel}
              textColor={colors.background.dark}
            />
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable
              onPress={handleViewTeam}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              testID="view-team-button"
              accessibilityLabel={t("accessibility.view_team")}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>{t("common.view_team")}</Text>
            </Pressable>

            <Pressable
              onPress={handleViewPlayer}
              style={({ pressed }) => [
                styles.button,
                styles.buttonPrimary,
                pressed && styles.buttonPressed,
              ]}
              testID="view-player-button"
              accessibilityLabel={t("accessibility.view_player")}
              accessibilityRole="button"
            >
              <Text style={styles.buttonTextPrimary}>
                {t("common.view_player")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  } as ViewStyle,
  card: {
    width: 220,
    maxWidth: "100%",
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    ...shadows.md,
  } as ViewStyle,
  imageContainer: {
    width: "100%",
    backgroundColor: colors.brand.gridblue,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xs,
  } as ViewStyle,
  imageWrapper: {
    borderRadius: borderRadius.full,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.brand.cream,
    ...shadows.md,
  } as ViewStyle,
  playerImage: {
    width: "100%",
    height: "100%",
  } as ImageStyle,
  contentContainer: {
    padding: spacing.lg,
    alignItems: "center",
  } as ViewStyle,
  playerName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.brand.yellow,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 2,
  } as TextStyle,
  ageText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.xs,
  } as TextStyle,
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  } as ViewStyle,
  teamLogo: {
    width: 32,
    height: 32,
    marginRight: spacing.xs,
  } as ImageStyle,
  teamName: {
    fontSize: 10,
    color: colors.text.primary,
    flex: 1,
  } as TextStyle,
  statsContainer: {
    width: "100%",
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    marginBottom: spacing.sm,
  } as ViewStyle,
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 2,
  } as ViewStyle,
  statItem: {
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  } as ViewStyle,
  statValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.brand.yellow,
    marginBottom: 1,
  } as TextStyle,
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: "center",
  } as TextStyle,
  yellowCardValue: {
    color: colors.brand.yellow,
  } as TextStyle,
  redCardValue: {
    color: colors.brand.red,
  } as TextStyle,
  shareContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  } as ViewStyle,
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    width: "100%",
  } as ViewStyle,
  button: {
    flex: 1,
    backgroundColor: colors.brand.aqualight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
  } as ViewStyle,
  buttonPrimary: {
    backgroundColor: colors.brand.cream,
  } as ViewStyle,
  buttonPressed: {
    opacity: 0.7,
  } as ViewStyle,
  buttonText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.darker,
    textAlign: "center",
  } as TextStyle,
  buttonTextPrimary: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.darker,
    textAlign: "center",
  } as TextStyle,
});

export default RankingPlayerCard;
