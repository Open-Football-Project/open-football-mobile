import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
  useWindowDimensions,
  ImageSourcePropType,
} from "react-native";
import { useTranslation } from "react-i18next";
import ShareSvgButton from "../../general/share-svg-button/ShareSvgButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  GuessTheTeamGameData,
  GuessTheTeamGameHint,
  buildTeamTriviaSvg,
  cleanLeagueName,
  leagueTranslationKey,
} from "@matchinsights/core";

import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  opacity,
  breakpoints,
} from "../../../theme";

import {
  XIcon,
  PlayerIcon,
  StadiumIcon,
  CelebrationIcon,
  IncorrectIcon,
} from "../../../icons/Icons";

import { RootStackParamList, Routes } from "../../../navigation/RootNavigator";

const teamPlaceholder: ImageSourcePropType = require("../../../assets/images/fclogo.png");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface GuessTheTeamProps {
  game: GuessTheTeamGameData;
  newGame: () => void;
  leagueName: string;
}

const GuessTheTeam = ({ game, newGame, leagueName }: GuessTheTeamProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [wrongGuess, setWrongGuess] = useState(true);

  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const handleSelect = (option: string) => {
    setSelected(option);
    if (option === game.teamName) {
      setRevealed(true);
      setWrongGuess(false);
    } else {
      setWrongGuess(true);
      setRevealed(false);
    }
  };

  const leagueNameLabel = cleanLeagueName(
    t(`league.${leagueTranslationKey(leagueName)}`, {
      defaultValue: leagueName,
    }),
  );

  const svgData = useMemo(
    () =>
      buildTeamTriviaSvg({
        title: `${t("quiz.team_quiz")} — ${leagueNameLabel}`,
        subtitle: `${t("common.founded")}: ${
          game.founded > 0 ? game.founded : "?"
        } • ${t("common.season")}: ${game.season}`,
        hints: game.hints.map((hint) => ({
          emoji: hint.hintKey === "PLAYER" ? "👟" : "🏟️",
          label: t(`quiz.${hint.description.toLowerCase()}`),
          value: hint.value,
        })),
        options: game.options,
        filename: `team-quiz-${String(game.season).replace("/", "-")}.png`,
      }),
    [game, t],
  );

  const hintTranslation = (hint: GuessTheTeamGameHint): string => {
    const descKey = hint.description.toLowerCase().replace(/\s+/g, "_");
    const translationKey = descKey.startsWith("team_quiz_")
      ? `quiz.${descKey}`
      : `quiz.team_quiz_${descKey}`;
    return t(translationKey);
  };

  const handleAskTwitter = async () => {
    const formatHint = (hint: GuessTheTeamGameHint) => {
      if (hint.hintKey === "PLAYER") {
        return `${hintTranslation(hint)}: ${hint.value}`;
      }
      return `${hintTranslation(hint)}: ${hint.value}`;
    };

    const header = `${t("quiz.team_quiz")} — ${t("common.founded")}: ${
      game.founded
    }, ${t("common.season")}: ${game.season}\n`;
    const text = encodeURIComponent(
      `${header}${game.hints
        .map(formatHint)
        .join("\n")}\n\n#${leagueNameLabel}`,
    );

    const url = `https://twitter.com/intent/tweet?text=${text}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.info("Failed to open Twitter:", error);
    }
  };

  const isTv = width >= breakpoints.tv;
  const isDesktop = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isMobile = width < breakpoints.tablet;
  const isSmallScreen = width < 600;

  const teamImageSize = isTv ? 280 : isDesktop ? 220 : isTablet ? 180 : 140;
  const iconSize = isTv ? fontSize.xl : isTablet ? fontSize.lg : fontSize.base;

  const styles = getStyles(isMobile, isTv);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mainContainer}>
        <View style={[styles.photoSection, isSmallScreen && { width: "100%" }]}>
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.helpButton,
                pressed && styles.helpButtonPressed,
              ]}
              onPress={handleAskTwitter}
              testID="ask-help-button"
              accessibilityRole="button"
              accessibilityLabel={t("common.ask_help")}
            >
              <XIcon size={iconSize} color={colors.brand.yellow} />
              <Text style={styles.helpButtonText}>{t("common.ask_help")}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.newGameButton,
                pressed && styles.newGameButtonPressed,
              ]}
              onPress={newGame}
              testID="new-game-button"
              accessibilityRole="button"
              accessibilityLabel={t("quiz.new_quiz")}
            >
              <Text style={styles.newGameButtonText}>{t("quiz.new_quiz")}</Text>
            </Pressable>
          </View>

          <View style={styles.shareRow}>
            <ShareSvgButton svgString={svgData.svgString} />
          </View>

          <View
            style={[
              styles.photoContainer,
              { width: teamImageSize, height: teamImageSize },
            ]}
            testID="photo-container"
          >
            {revealed ? (
              <Image
                source={
                  game.teamLogo ? { uri: game.teamLogo } : teamPlaceholder
                }
                style={styles.teamImage}
              />
            ) : (
              <Image
                source={teamPlaceholder}
                style={[styles.teamImage, styles.teamImageHidden]}
              />
            )}
            {!revealed && (
              <Text style={styles.questionMark} testID="question-mark">
                ?
              </Text>
            )}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t("common.founded")}:</Text>
              <Text style={styles.statValue}>
                {game.founded > 0 ? game.founded : t("common.unknown")}
              </Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t("common.season")}:</Text>
              <Text style={styles.statValue}>{game.season}</Text>
            </View>
          </View>

          {selected && wrongGuess && !revealed && (
            <View style={styles.wrongGuessContainer}>
              <IncorrectIcon size={iconSize} color={colors.brand.danger} />
              <Text style={styles.wrongGuessText} testID="wrong-guess">
                {t("quiz.wrong_opt")}
              </Text>
            </View>
          )}

          {!wrongGuess && revealed && (
            <Pressable
              onPress={() =>
                navigation.navigate(Routes.TEAM_DETAILS, {
                  teamId: String(game.teamId),
                })
              }
              testID="team-name-link"
              accessibilityRole="button"
              accessibilityLabel={game.teamName}
            >
              <View style={styles.teamNameContainer}>
                <CelebrationIcon size={iconSize} color={colors.brand.yellow} />
                <Text style={styles.teamNameRevealed}>{game.teamName}</Text>
              </View>
            </Pressable>
          )}
        </View>

        <View style={[styles.hintsSection, isSmallScreen && { width: "100%" }]}>
          <Text style={styles.hintsTitle} testID="hints-title">
            {t("quiz.hints")}
          </Text>

          {game.hints.length === 0 ? (
            <Text style={styles.venueText}>
              {t("common.venue")}: {game.venue || t("common.unknown")}
            </Text>
          ) : (
            <View style={styles.hintsList}>
              {game.hints.map((hint, index) => (
                <View
                  key={index}
                  style={styles.hintCard}
                  testID={`hint-card-${index}`}
                >
                  <View style={styles.hintRow}>
                    {hint.hintKey === "PLAYER" ? (
                      <PlayerIcon size={iconSize} color={colors.text.primary} />
                    ) : (
                      <StadiumIcon
                        size={iconSize}
                        color={colors.text.primary}
                      />
                    )}
                    <View style={styles.hintContent}>
                      <Text style={styles.hintLabel}>
                        <Text style={styles.hintLabelText}>
                          {hintTranslation(hint)}:
                        </Text>
                        <Text style={styles.hintValue}> {hint.value}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {!revealed && (
        <View style={styles.optionsGrid}>
          {game.options.map((option) => (
            <Pressable
              key={option}
              style={({ pressed }) => [
                styles.optionButton,
                selected === option &&
                  (option === game.teamName
                    ? styles.optionButtonCorrect
                    : styles.optionButtonWrong),
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => handleSelect(option)}
              testID={`option-${option}`}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === option &&
                    (option === game.teamName
                      ? styles.optionTextCorrect
                      : styles.optionTextWrong),
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const getStyles = (isMobile: boolean, isTv: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
    },
    contentContainer: {
      flexGrow: 1,
      paddingVertical: isTv ? spacing.xl : spacing.md,
      paddingHorizontal: isTv ? spacing.xxl : spacing.md,
    },
    mainContainer: {
      flexDirection: isMobile ? "column" : "row",
      gap: isTv ? spacing.xxxl : spacing.lg,
      marginBottom: spacing.lg,
    },
    photoSection: {
      ...(isMobile ? { width: "100%" } : { flexBasis: 0, flexGrow: 0.33 }),
      gap: isTv ? spacing.lg : spacing.md,
      alignItems: "center",
    },
    buttonRow: {
      flexDirection: "row",
      gap: isTv ? spacing.lg : spacing.sm,
      justifyContent: "center",
      width: "100%",
      flexWrap: "wrap",
    },
    shareRow: {
      marginTop: spacing.sm,
      alignItems: "center",
    },
    helpButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      paddingVertical: isTv ? spacing.md : spacing.sm,
      paddingHorizontal: isTv ? spacing.lg : spacing.sm,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.brand.yellow,
      backgroundColor: colors.background.dark,
      minHeight: isTv ? 56 : 44,
    },
    helpButtonPressed: {
      backgroundColor: colors.brand.yellow,
      opacity: opacity.hover,
    },
    helpButtonText: {
      color: colors.brand.yellow,
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      fontWeight: fontWeight.semibold,
    },

    // New Quiz — filled orange, white text (secondary action)
    newGameButton: {
      flex: 1,
      paddingVertical: isTv ? spacing.md : spacing.sm,
      paddingHorizontal: isTv ? spacing.lg : spacing.sm,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.brand.orange,
      justifyContent: "center",
      alignItems: "center",
      minHeight: isTv ? 56 : 44,
    },
    newGameButtonPressed: {
      backgroundColor: colors.brand.cream,
      opacity: opacity.hover,
    },
    newGameButtonText: {
      color: colors.text.primary,
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      fontWeight: fontWeight.semibold,
    },
    photoContainer: {
      borderRadius: borderRadius.full,
      borderWidth: isTv ? 3 : 2,
      borderColor: colors.brand.yellow,
      overflow: "hidden",
      backgroundColor: colors.background.dark,
      justifyContent: "center",
      alignItems: "center",
    },
    teamImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    teamImageHidden: {
      opacity: opacity.disabled,
    },
    questionMark: {
      position: "absolute",
      fontSize: isTv ? 100 : isMobile ? 60 : 80,
      fontWeight: fontWeight.bold,
      color: colors.text.darker,
    },
    statsContainer: {
      gap: spacing.sm,
      alignItems: "center",
      width: "100%",
    },
    statRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    statLabel: {
      color: colors.text.primary,
      fontSize: isTv ? fontSize.sm : fontSize.sm,
      fontWeight: fontWeight.semibold,
    },
    statValue: {
      color: colors.brand.yellow,
      fontSize: isTv ? fontSize.sm : fontSize.sm,
      fontWeight: fontWeight.bold,
    },
    wrongGuessContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    wrongGuessText: {
      color: colors.brand.danger,
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      fontWeight: fontWeight.semibold,
    },
    teamNameContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    teamNameRevealed: {
      color: colors.brand.success,
      fontSize: isTv ? fontSize.xl : fontSize.sm,
      fontWeight: fontWeight.bold,
    },
    hintsSection: {
      ...(isMobile ? { width: "100%" } : { flexBasis: 0, flexGrow: 0.67 }),
      gap: spacing.md,
    },
    hintsTitle: {
      color: colors.brand.purplel,
      fontSize: isTv ? fontSize.lg : fontSize.xs,
      fontWeight: fontWeight.semibold,
      textTransform: "uppercase",
      marginBottom: spacing.sm,
    },
    venueText: {
      color: colors.text.secondary,
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      textTransform: "uppercase",
    },
    hintsList: {
      gap: isTv ? spacing.md : spacing.sm,
    },
    hintCard: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: isTv ? spacing.lg : spacing.sm,
      borderWidth: 1,
      borderColor: colors.brand.yellow + "33",
      gap: spacing.xs,
    },
    hintRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    hintContent: {
      flex: 1,
    },
    hintLabel: {
      color: colors.text.secondary,
      fontSize: isTv ? fontSize.lg : fontSize.sm,
    },
    hintLabelText: {
      fontWeight: fontWeight.semibold,
      color: colors.brand.cream,
      fontSize: fontSize.xs,
      textTransform: "uppercase",
    },
    hintValue: {
      color: colors.text.primary,
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.xs,
    },
    optionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: isTv ? spacing.lg : spacing.md,
      justifyContent: "center",
      marginTop: isTv ? spacing.xl : spacing.lg,
    },
    optionButton: {
      paddingVertical: isTv ? spacing.md : spacing.sm,
      paddingHorizontal: isTv ? spacing.lg : spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.brand.yellow,
      backgroundColor: colors.brand.gridblue,
      minWidth: isTv ? "22%" : isMobile ? "45%" : "30%",
      minHeight: isTv ? 60 : 44,
      justifyContent: "center",
      alignItems: "center",
    },
    optionButtonCorrect: {
      backgroundColor: colors.brand.yellow,
      borderColor: colors.brand.yellow,
    },
    optionButtonWrong: {
      backgroundColor: colors.background.dark,
      borderColor: colors.brand.danger,
    },
    optionButtonPressed: {
      opacity: opacity.hover,
    },
    optionText: {
      color: colors.text.primary,
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      fontWeight: fontWeight.bold,
    },
    optionTextCorrect: {
      color: colors.background.dark,
    },
    optionTextWrong: {
      color: colors.brand.danger,
    },
  });

export default GuessTheTeam;
