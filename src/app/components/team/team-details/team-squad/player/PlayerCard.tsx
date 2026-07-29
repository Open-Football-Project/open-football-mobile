import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
  ImageStyle,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  TeamPlayer,
  translatePlayerPosition,
  buildPlayerCardSvgString,
  PlayerSvgLabel,
  PlayerSvgLabels,
  obscurePlayerName,
} from "@matchinsights/core";
import {
  RootStackParamList,
  Routes,
} from "../../../../../navigation/RootNavigator";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadows,
  breakpoints,
} from "../../../../../theme";
import { PlayerIcon } from "../../../../../icons/Icons";
import ShareSvgButton from "../../../../general/share-svg-button/ShareSvgButton";

interface PlayerCardProps {
  player: TeamPlayer;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const defaultPlayerImage = require("../../../../../assets/images/player.png");
const PLAYER_FALLBACK_PHOTO = Image.resolveAssetSource(defaultPlayerImage).uri;

const PlayerCard = ({ player }: PlayerCardProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const [imageError, setImageError] = useState(false);

  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet;

  const responsiveStyles = useMemo(() => {
    if (isLargeScreen) {
      return {
        cardWidth: 280,
        imageSize: 120,
        nameFontSize: fontSize.lg,
        detailFontSize: fontSize.sm,
        buttonFontSize: fontSize.sm,
        padding: spacing.lg,
      };
    }
    if (isTablet) {
      return {
        cardWidth: 250,
        imageSize: 100,
        nameFontSize: fontSize.base,
        detailFontSize: fontSize.sm,
        buttonFontSize: fontSize.sm,
        padding: spacing.md,
      };
    }
    return {
      cardWidth: 220,
      imageSize: 80,
      nameFontSize: fontSize.sm,
      detailFontSize: fontSize.xs,
      buttonFontSize: fontSize.xs,
      padding: spacing.sm,
    };
  }, [isLargeScreen, isTablet]);

  const handlePress = () => {
    navigation.navigate(Routes.PLAYER_HISTORY, {
      playerId: String(player.playerId),
    });
  };

  const playerImage =
    !player.photo || imageError ? defaultPlayerImage : { uri: player.photo };

  const labels: PlayerSvgLabels = new Map([
    [PlayerSvgLabel.AGE, t("common.age")],
    [PlayerSvgLabel.POSITION, t("common.position")],
    [PlayerSvgLabel.PLAYER_NUMBER, t("common.number")],
  ]);

  const cardData = {
    playerName: player.name,
    playerPhoto: player.photo ?? PLAYER_FALLBACK_PHOTO,
    playerAge: player.age,
    position: player.position,
    playerNumber: player.playerNumber,
  };

  const svgString = buildPlayerCardSvgString(cardData, labels);
  const quizSvgString = buildPlayerCardSvgString(
    {
      ...cardData,
      playerName: obscurePlayerName(player.name),
      playerPhoto: PLAYER_FALLBACK_PHOTO,
    },
    labels,
  );

  return (
    <View style={styles.container} testID={`player-card-${player.playerId}`}>
      <View style={[styles.card, { width: responsiveStyles.cardWidth }]}>
        <View
          style={[
            styles.imageContainer,
            { height: responsiveStyles.imageSize + spacing.lg },
          ]}
        >
          <View
            style={[
              styles.imageWrapper,
              {
                width: responsiveStyles.imageSize,
                height: responsiveStyles.imageSize,
              },
            ]}
          >
            <Image
              source={playerImage}
              style={styles.playerImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
              testID={`player-image-${player.playerId}`}
            />
          </View>
        </View>

        <View
          style={[
            styles.contentContainer,
            { padding: responsiveStyles.padding },
          ]}
        >
          <Text
            style={[
              styles.playerName,
              { fontSize: responsiveStyles.nameFontSize },
            ]}
            numberOfLines={2}
            testID={`player-name-${player.playerId}`}
          >
            {player.name}
          </Text>

          <View style={styles.detailsContainer}>
            {player.age !== undefined && (
              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.detailLabel,
                    { fontSize: responsiveStyles.detailFontSize },
                  ]}
                >
                  {t("common.age")}:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { fontSize: responsiveStyles.detailFontSize },
                  ]}
                  testID={`player-age-${player.playerId}`}
                >
                  {player.age}
                </Text>
              </View>
            )}

            {player.position && (
              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.detailLabel,
                    { fontSize: responsiveStyles.detailFontSize },
                  ]}
                >
                  {t("common.position")}:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { fontSize: responsiveStyles.detailFontSize },
                  ]}
                  testID={`player-position-${player.playerId}`}
                >
                  {translatePlayerPosition(player.position, t)}
                </Text>
              </View>
            )}

            {player.playerNumber !== undefined && (
              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.detailLabel,
                    { fontSize: responsiveStyles.detailFontSize },
                  ]}
                >
                  {t("common.number")}:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { fontSize: responsiveStyles.detailFontSize },
                  ]}
                  testID={`player-number-${player.playerId}`}
                >
                  {player.playerNumber}
                </Text>
              </View>
            )}
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

          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
              styles.viewButton,
              pressed && styles.viewButtonPressed,
            ]}
            testID={`player-view-button-${player.playerId}`}
            accessibilityLabel={t("accessibility.view_player")}
            accessibilityRole="button"
          >
            <PlayerIcon
              size={responsiveStyles.buttonFontSize}
              color={colors.text.darker}
            />
            <Text
              style={[
                styles.buttonText,
                { fontSize: responsiveStyles.buttonFontSize },
              ]}
            >
              {t("common.view_player")}
            </Text>
          </Pressable>
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
    alignItems: "center",
  } as ViewStyle,
  playerName: {
    fontWeight: fontWeight.bold,
    color: colors.brand.cream,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: spacing.sm,
  } as TextStyle,
  detailsContainer: {
    width: "100%",
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  } as ViewStyle,
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  } as ViewStyle,
  detailLabel: {
    color: colors.brand.dona,
    fontWeight: fontWeight.medium,
  } as TextStyle,
  detailValue: {
    color: colors.brand.cream,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  shareContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  } as ViewStyle,
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand.aqualight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    width: "100%",
    ...shadows.sm,
  } as ViewStyle,
  viewButtonPressed: {
    opacity: 0.7,
  } as ViewStyle,
  buttonText: {
    fontWeight: fontWeight.semibold,
    color: colors.text.darker,
    textAlign: "center",
  } as TextStyle,
});

export default PlayerCard;
