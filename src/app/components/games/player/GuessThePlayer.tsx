import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  FlatList,
  Linking,
  useWindowDimensions,
  ImageSourcePropType,
} from "react-native";
import { useTranslation } from "react-i18next";
import ShareSvgButton from "../../general/share-svg-button/ShareSvgButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Routes } from "../../../navigation/RootNavigator";

import {
  GuessThePlayerGameData,
  GuessThePlayerGameHint,
  translateCountry,
  translateLeague,
  buildPlayerTriviaSvg,
  SVGItemKind,
} from "@matchinsights/core";

import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontSize,
  fontWeight,
  opacity,
  breakpoints,
} from "../../../theme";

import {
  XIcon,
  TrophyIcon,
  HintIcon,
  SparkleIcon,
  IncorrectIcon,
} from "../../../icons/Icons";

import { RootStackParamList } from "../../../navigation/RootNavigator";

const playerPlaceholder: ImageSourcePropType = require("../../../assets/images/player.png");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface GuessThePlayerProps {
  teamName: string;
  game: GuessThePlayerGameData;
  newGame: () => void;
}

const GuessThePlayer = ({ game, newGame, teamName }: GuessThePlayerProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [wrongGuess, setWrongGuess] = useState(true);

  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const handleSelect = (option: string) => {
    setSelected(option);
    if (option === game.playerName) {
      setRevealed(true);
      setWrongGuess(false);
    } else {
      setWrongGuess(true);
      setRevealed(false);
    }
  };

  const getTrophyHintYear = (value: string | null | undefined) => {
    if (value) return `(${value})`;
    return "";
  };

  const getTransferHintYear = (value: number | null | undefined) => {
    if (value) return `(${value})`;
    return "";
  };

  const buildHintDescription = (
    hint: GuessThePlayerGameHint,
    trfYear?: boolean,
  ): string => {
    if (hint.hintKey === "TRANSFER") {
      return `${t("common.trf_from")} ${
        hint.transferFromTeam ?? t("common.unknown")
      } ${t("common.trf_to")} ${hint.transferToTeam ?? t("common.unknown")} ${
        trfYear ? getTransferHintYear(hint.transferYear) : ""
      }`;
    }
    return `${translateLeague(
      hint.trophyLeague ?? t("common.unknown"),
      t,
    )} ${getTrophyHintYear(hint.trophySeason)}`;
  };

  const teamTag = teamName.replace(/\s+/g, "");

  const svgData = useMemo(
    () =>
      buildPlayerTriviaSvg({
        title: t("quiz.player_quiz"),
        subtitle: `${t("common.position")}: ${t(
          `playerposition.${game.playerPosition.toLowerCase()}`,
          { defaultValue: game.playerPosition },
        )}`,
        hints: game.hints.map((hint) => {
          if (hint.hintKey === "TRANSFER") {
            return {
              kind: SVGItemKind.Transfer,
              label: t("quiz.transfer"),
              description: `${t("common.trf_from")} ${
                hint.transferFromTeam ?? t("common.unknown")
              } ${t("common.trf_to")} ${
                hint.transferToTeam ?? t("common.unknown")
              }${hint.transferYear ? ` (${hint.transferYear})` : ""}`,
              fromTeamLogo: hint.transferFromLogo ?? undefined,
              toTeamLogo: hint.transferToLogo ?? undefined,
            };
          }
          return {
            kind: SVGItemKind.Trophy,
            label: t("quiz.trophy"),
            description: `${translateLeague(
              hint.trophyLeague ?? t("common.unknown"),
              t,
            )}${hint.trophySeason ? ` (${hint.trophySeason})` : ""}`,
            countryName: translateCountry(hint.trophyCountry ?? "", t),
          };
        }),
        options: game.options,
        filename: `player-quiz-${game.playerPosition.toLowerCase()}.png`,
      }),
    [game, t],
  );

  const handleAskTwitter = async () => {
    const formatHint = (hint: GuessThePlayerGameHint) => {
      if (hint.hintKey === "TRANSFER") {
        return `${buildHintDescription(hint, true)}`.trim();
      }
      return `${buildHintDescription(hint)}`.trim();
    };

    const header = `${t("quiz.player_quiz")} — ${t("common.position")}: ${t(
      `playerposition.${game.playerPosition.toLowerCase()}`,
      { defaultValue: game.playerPosition },
    )}\n`;

    const text = encodeURIComponent(
      `${header}${game.hints.map(formatHint).join("\n")}\n\n#${teamTag}`,
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

  const playerImageSize = isTv ? 280 : isDesktop ? 220 : isTablet ? 180 : 140;
  const columnCount = isTv ? 4 : isDesktop ? 3 : isTablet ? 3 : 2;
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
              { width: playerImageSize, height: playerImageSize },
            ]}
            testID="photo-container"
          >
            {revealed ? (
              <Image
                source={
                  game.playerPhoto
                    ? { uri: game.playerPhoto }
                    : playerPlaceholder
                }
                style={styles.playerImage}
              />
            ) : (
              <Image
                source={playerPlaceholder}
                style={[styles.playerImage, styles.playerImageHidden]}
              />
            )}
            {!revealed && (
              <Text style={styles.questionMark} testID="question-mark">
                ?
              </Text>
            )}
          </View>

          <View style={styles.positionContainer}>
            <Text style={styles.positionLabel}>
              {t("common.position")}:
              <Text style={styles.positionValue}>
                {" "}
                {t(`playerposition.${game.playerPosition.toLowerCase()}`, {
                  defaultValue: game.playerPosition,
                })}
              </Text>
            </Text>

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
                  navigation.navigate(Routes.PLAYER_HISTORY, {
                    playerId: String(game.playerId),
                  })
                }
                testID="player-name-link"
                accessibilityRole="button"
                accessibilityLabel={game.playerName}
              >
                <View style={styles.playerNameContainer}>
                  <SparkleIcon size={iconSize} color={colors.brand.yellow} />
                  <Text style={styles.playerNameRevealed}>
                    {game.playerName}
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>

        <View style={[styles.hintsSection, isSmallScreen && { width: "100%" }]}>
          <Text style={styles.hintsTitle} testID="hints-title">
            {t("quiz.hints")}
          </Text>

          {game.hints.length === 0 ? (
            <Text style={styles.nationalityText}>
              {t("common.nationality")}: {game.playerNationality}
            </Text>
          ) : (
            <View style={styles.hintsList}>
              {game.hints.map((hint, index) => (
                <View
                  key={index}
                  style={styles.hintCard}
                  testID={`hint-card-${index}`}
                >
                  {hint.hintKey === "TROPHY" && hint.trophyCountry && (
                    <View style={styles.hintRow}>
                      <TrophyIcon size={iconSize} color={colors.brand.yellow} />
                      <Text
                        style={styles.hintCountry}
                        testID={`trophy-country-${index}`}
                      >
                        {translateCountry(hint.trophyCountry, t)}
                      </Text>
                    </View>
                  )}

                  {hint.hintKey === "TRANSFER" &&
                    hint.transferFromLogo &&
                    hint.transferToLogo && (
                      <View style={styles.transferRow}>
                        <Image
                          source={{ uri: hint.transferFromLogo }}
                          style={styles.teamLogo}
                        />
                        <Text style={styles.transferArrow}>→</Text>
                        <Image
                          source={{ uri: hint.transferToLogo }}
                          style={styles.teamLogo}
                        />
                        {hint.transferYear && (
                          <Text
                            style={styles.transferYear}
                            testID={`transfer-year-${index}`}
                          >
                            {t("common.year")}: {hint.transferYear}
                          </Text>
                        )}
                      </View>
                    )}

                  <View style={styles.hintDescriptionRow}>
                    <HintIcon size={iconSize} color={colors.brand.yellow} />
                    <View style={styles.hintDescriptionText}>
                      <Text style={styles.hintDescriptionLabel}>
                        {t(`quiz.${hint.hintKey.toLowerCase()}`)}:
                      </Text>
                      <Text style={styles.hintDescriptionValue}>
                        {buildHintDescription(hint)}
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
        <View style={styles.optionsContainer} testID="options-grid">
          <FlatList
            data={game.options}
            numColumns={columnCount}
            scrollEnabled={false}
            columnWrapperStyle={styles.optionRow}
            renderItem={({ item: option }) => (
              <Pressable
                key={option}
                style={({ pressed }) => [
                  styles.optionButton,
                  pressed && styles.optionButtonPressed,
                  selected === option &&
                    (option === game.playerName
                      ? styles.optionButtonCorrect
                      : styles.optionButtonIncorrect),
                  selected !== option && styles.optionButtonDefault,
                ]}
                onPress={() => handleSelect(option)}
                testID={`option-${option}`}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected === option &&
                      (option === game.playerName
                        ? styles.optionTextCorrect
                        : styles.optionTextIncorrect),
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item}
          />
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
      padding: isTv ? spacing.xxl : isMobile ? spacing.md : spacing.lg,
      paddingBottom: spacing.xxl,
    },
    mainContainer: {
      flexDirection: isMobile ? "column" : "row",
      gap: isTv ? spacing.xxxl : spacing.xl,
      alignItems: isMobile ? "center" : "flex-start",
    },
    photoSection: isMobile
      ? { width: "100%", alignItems: "center" }
      : { flexBasis: 0, flexGrow: 0.45, alignItems: "center" },
    buttonRow: {
      flexDirection: "row",
      gap: isTv ? spacing.lg : spacing.sm,
      marginTop: spacing.sm,
      justifyContent: "center",
    },
    shareRow: {
      marginTop: spacing.sm,
      alignItems: "center",
    },
    // Ask Help — outlined yellow, subtle (least important action)
    helpButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: colors.brand.yellow,
      borderRadius: borderRadius.lg,
      paddingVertical: isTv ? spacing.md : spacing.sm,
      paddingHorizontal: isTv ? spacing.lg : spacing.sm,
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
      backgroundColor: colors.brand.orange,
      borderRadius: borderRadius.lg,
      paddingVertical: isTv ? spacing.md : spacing.sm,
      paddingHorizontal: isTv ? spacing.lg : spacing.sm,
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
      marginTop: spacing.xl,
      borderWidth: isTv ? 3 : 2,
      borderColor: colors.brand.yellow,
      borderRadius: borderRadius.full,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background.dark,
      ...shadows.md,
    },
    playerImage: {
      width: "100%",
      height: "100%",
    },
    playerImageHidden: {
      opacity: opacity.disabled,
    },
    questionMark: {
      position: "absolute",
      color: colors.text.darker,
      fontSize: isTv ? 100 : 72,
      fontWeight: fontWeight.bold,
    },
    positionContainer: {
      marginTop: spacing.md,
      alignItems: "center",
      width: "100%",
    },
    positionLabel: {
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      color: colors.brand.yellow,
      fontWeight: fontWeight.semibold,
      textTransform: "uppercase",
    },
    positionValue: {
      color: colors.text.primary,
      fontWeight: fontWeight.normal,
    },
    wrongGuessContainer: {
      marginTop: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      justifyContent: "center",
    },
    wrongGuessText: {
      marginTop: spacing.sm,
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      color: colors.brand.danger,
      fontWeight: fontWeight.semibold,
    },
    playerNameContainer: {
      marginTop: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      justifyContent: "center",
    },
    playerNameRevealed: {
      marginTop: spacing.sm,
      fontSize: isTv ? fontSize.xxl : fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.brand.yellow,
      textAlign: "center",
    },
    hintsSection: isMobile
      ? { width: "100%" }
      : { flexBasis: 0, flexGrow: 0.55 },
    hintsTitle: {
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      color: colors.brand.purplel,
      fontWeight: fontWeight.semibold,
      textTransform: "uppercase",
      marginBottom: spacing.md,
    },
    nationalityText: {
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.md,
      textTransform: "uppercase",
    },
    hintsList: {
      gap: isTv ? spacing.md : spacing.sm,
    },
    hintCard: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: isTv ? spacing.lg : spacing.md,
      borderWidth: 1,
      borderColor: colors.brand.yellow + "33",
      gap: spacing.sm,
    },
    hintRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    hintCountry: {
      flex: 1,
      color: colors.brand.aqualight,
      fontWeight: fontWeight.semibold,
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      textTransform: "uppercase",
    },
    transferRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      flexWrap: "wrap",
    },
    transferArrow: {
      fontSize: isTv ? fontSize.xl : fontSize.base,
      color: colors.brand.yellow,
      fontWeight: fontWeight.semibold,
    },
    teamLogo: {
      width: isTv ? 40 : 28,
      height: isTv ? 40 : 28,
      borderRadius: isTv ? 20 : 14,
      borderWidth: 1,
      borderColor: colors.brand.yellow + "80",
      backgroundColor: colors.background.dark,
    },
    transferYear: {
      fontSize: isTv ? fontSize.sm : fontSize.xs,
      color: colors.brand.aqualight,
      fontWeight: fontWeight.semibold,
      marginLeft: spacing.sm,
    },
    hintDescriptionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    hintDescriptionText: {
      flex: 1,
      gap: spacing.xs,
    },
    hintDescriptionLabel: {
      color: colors.text.primary,
      fontWeight: fontWeight.semibold,
      fontSize: isTv ? fontSize.lg : fontSize.xs,
    },
    hintDescriptionValue: {
      color: colors.brand.cream,
      fontWeight: fontWeight.semibold,
      fontSize: isTv ? fontSize.lg : fontSize.xs,
    },
    optionsContainer: {
      marginTop: isTv ? spacing.xxl : spacing.xl,
    },
    optionRow: {
      gap: isTv ? spacing.lg : spacing.md,
      marginBottom: isTv ? spacing.lg : spacing.md,
    },
    optionButton: {
      flex: 1 / 2,
      paddingVertical: isTv ? spacing.md : spacing.sm,
      paddingHorizontal: isTv ? spacing.md : spacing.sm,
      borderRadius: borderRadius.lg,
      minHeight: isTv ? 60 : 44,
      justifyContent: "center",
      alignItems: "center",
    },
    optionButtonDefault: {
      backgroundColor: colors.brand.gridblue,
      borderWidth: 1,
      borderColor: colors.brand.yellow + "66",
    },
    optionButtonCorrect: {
      backgroundColor: colors.brand.yellow,
      borderWidth: 1,
      borderColor: colors.brand.yellow,
    },
    optionButtonIncorrect: {
      backgroundColor: colors.background.dark,
      borderWidth: 1,
      borderColor: colors.brand.danger,
    },
    optionButtonPressed: {
      opacity: opacity.hover,
    },
    optionText: {
      fontSize: isTv ? fontSize.lg : fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text.primary,
      textAlign: "center",
    },
    optionTextCorrect: {
      color: colors.background.dark,
    },
    optionTextIncorrect: {
      color: colors.brand.danger,
    },
  });

export default GuessThePlayer;
