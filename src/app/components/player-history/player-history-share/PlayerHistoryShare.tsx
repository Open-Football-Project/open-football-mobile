import React, { useMemo } from "react";
import { View, StyleSheet, ViewStyle, Image } from "react-native";
import { useTranslation } from "react-i18next";
import {
  PlayerTransferInfo,
  PlayerTrophyInfo,
  SVGTransferOrTrophyItem,
  SVGItemKind,
  TransfersSvgStrategy,
  TrophiesSvgStrategy,
  QuizMixSvgStrategy,
  buildPlayerHistorySvgString,
  getFormattedDate,
  translateCountry,
  translateLeague,
} from "open-football-project-core";
import ShareSvgButton from "../../general/share-svg-button/ShareSvgButton";
import { colors, spacing } from "../../../theme";

const PLAYER_FALLBACK_PHOTO = Image.resolveAssetSource(
  require("../../../assets/images/player.png"),
).uri;

interface PlayerHistoryShareProps {
  playerName: string;
  playerPhoto: string;
  transfers: PlayerTransferInfo[];
  trophies: PlayerTrophyInfo[];
}

const PlayerHistoryShare = ({
  playerName,
  playerPhoto,
  transfers,
  trophies,
}: PlayerHistoryShareProps) => {
  const { t } = useTranslation();

  const allItems: SVGTransferOrTrophyItem[] = useMemo(
    () => [
      ...transfers.map(
        (trans): SVGTransferOrTrophyItem => ({
          kind: SVGItemKind.Transfer,
          date: trans.date ? getFormattedDate(trans.date, "dd MMM yyyy") : "—",
          fromTeamName: trans.fromTeamName,
          fromTeamLogo: trans.fromTeamLogo ?? undefined,
          toTeamName: trans.toTeamName,
          toTeamLogo: trans.toTeamLogo ?? undefined,
        }),
      ),
      ...trophies
        .filter((tr) => tr.league && tr.season && tr.place)
        .map(
          (tr): SVGTransferOrTrophyItem => ({
            kind: SVGItemKind.Trophy,
            leagueName: translateLeague(tr.league, t),
            countryName: translateCountry(tr.country, t),
            place: tr.place,
            season: tr.season!,
          }),
        ),
    ],
    [transfers, trophies, t],
  );

  const transfersStrategy = useMemo(
    () =>
      new TransfersSvgStrategy({
        title: t("playerhistory.downloadTransfersTitle"),
        photoUrl: playerPhoto,
      }),
    [t, playerPhoto],
  );

  const trophiesStrategy = useMemo(
    () =>
      new TrophiesSvgStrategy({
        title: t("playerhistory.downloadTrophiesTitle"),
        photoUrl: playerPhoto,
      }),
    [t, playerPhoto],
  );

  const quizStrategy = useMemo(
    () =>
      new QuizMixSvgStrategy({
        title: t("playerhistory.downloadQuizTitle"),
        photoUrl: PLAYER_FALLBACK_PHOTO,
        transferLabel: t("quiz.transfer"),
        trophyLabel: t("quiz.trophy"),
      }),
    [t],
  );

  const transfersSvg = buildPlayerHistorySvgString(
    transfersStrategy,
    allItems,
    playerName,
  );
  const trophiesSvg = buildPlayerHistorySvgString(
    trophiesStrategy,
    allItems,
    playerName,
  );
  const quizSvg = buildPlayerHistorySvgString(
    quizStrategy,
    allItems,
    playerName,
  );

  return (
    <View style={styles.container}>
      <ShareSvgButton
        svgString={transfersSvg}
        label={t("playerhistory.downloadTransfers")}
      />
      <ShareSvgButton
        svgString={trophiesSvg}
        label={t("playerhistory.downloadTrophies")}
      />
      <ShareSvgButton
        svgString={quizSvg}
        label={t("playerhistory.downloadQuiz")}
        backgroundColor={colors.brand.purplel}
        textColor={colors.background.dark}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  } as ViewStyle,
});

export default PlayerHistoryShare;
