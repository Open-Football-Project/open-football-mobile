import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  useWindowDimensions,
  LayoutChangeEvent,
} from "react-native";
import {
  TeamsLineups,
  LineupPlayer,
  buildMatchLineupsSvgString,
} from "@matchinsights/core";
import { useTranslation } from "react-i18next";
import NoData from "../../general/no-data/NoData";
import ShareSvgButton from "../../general/share-svg-button/ShareSvgButton";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  borders,
} from "../../../theme";

interface TeamsLineupsProps {
  lineups: TeamsLineups;
}
const HOME_LINE_TOP = [5, 18, 30, 42];
const AWAY_LINE_TOP = [90, 78, 65, 53];

const positionToLine = (pos: string): number => {
  if (!pos) return 3;
  const p = pos.toLowerCase();
  if (p.includes("g")) return 0;
  if (p.includes("d")) return 1;
  if (p.includes("m")) return 2;
  return 3;
};

const groupByLine = (
  players: LineupPlayer[],
): Record<number, LineupPlayer[]> => {
  const lines: Record<number, LineupPlayer[]> = {};
  players.forEach((p) => {
    const line = positionToLine(p.pos);
    if (!lines[line]) lines[line] = [];
    lines[line].push(p);
  });
  return lines;
};

const getLeftPercent = (index: number, total: number): number => {
  const padding = 12;
  switch (total) {
    case 1:
      return 50;
    case 2:
      return index === 0 ? 25 : 75;
    case 3:
      return [25, 50, 75][index] ?? 50;
    default:
      return (index / (total - 1)) * (100 - 2 * padding) + padding;
  }
};

interface PlayerMarkerProps {
  player: LineupPlayer;
  topPixels: number;
  leftPixels: number;
  color: string;
  playerSize: number;
}

const PlayerMarker = ({
  player,
  topPixels,
  leftPixels,
  color,
  playerSize,
}: PlayerMarkerProps) => {
  const circleSize = playerSize;
  const fontSize = playerSize * 0.4;

  return (
    <View
      style={[
        styles.playerMarkerContainer,
        {
          top: topPixels - circleSize / 2,
          left: leftPixels - circleSize / 2,
          width: circleSize,
        },
      ]}
      testID={`player-marker-${player.number}`}
    >
      <View
        style={[
          styles.playerCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: color,
          },
        ]}
      >
        <Text
          style={[styles.playerNumber, { fontSize }]}
          testID={`player-number-${player.number}`}
        >
          {player.number}
        </Text>
      </View>
      <Text
        style={[
          styles.playerName,
          { fontSize: Math.max(fontSize * 0.6, 8), minWidth: circleSize + 40 },
        ]}
        numberOfLines={2}
        testID={`player-name-${player.number}`}
      >
        {player.name}
      </Text>
    </View>
  );
};

interface TeamHeaderProps {
  teamName: string;
  teamLogo: string;
  formation: string;
  testID?: string;
}

const TeamHeader = ({
  teamName,
  teamLogo,
  formation,
  testID,
}: TeamHeaderProps) => {
  return (
    <View style={styles.teamHeader} testID={testID}>
      <Image
        source={{ uri: teamLogo }}
        style={styles.teamLogo}
        resizeMode="contain"
        testID={`team-logo-${teamName}`}
      />
      <View style={styles.teamInfo}>
        <Text
          style={styles.teamName}
          numberOfLines={1}
          testID={`team-name-${teamName}`}
        >
          {teamName}
        </Text>
        <Text style={styles.formation} testID={`team-formation-${teamName}`}>
          {formation}
        </Text>
      </View>
    </View>
  );
};

interface SubstitutesListProps {
  substitutes: LineupPlayer[];
  testID?: string;
}

const SubstitutesList = ({ substitutes, testID }: SubstitutesListProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.substitutesContainer} testID={testID}>
      <Text style={styles.substitutesTitle} testID="substitutes-title">
        {t("lineups.substitutes")}
      </Text>
      {substitutes.length > 0 ? (
        <FlatList
          data={substitutes}
          scrollEnabled={false}
          keyExtractor={(item) => `${item.name}-${item.number}`}
          renderItem={({ item }) => (
            <View
              style={styles.substitutionRow}
              testID={`substitute-${item.number}`}
            >
              <Text
                style={styles.substituteName}
                numberOfLines={1}
                testID={`sub-name-${item.number}`}
              >
                {item.name}
              </Text>
              <Text
                style={styles.substituteNumber}
                testID={`sub-number-${item.number}`}
              >
                {item.number}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noSubstitutes} testID="no-substitutes">
          {t("lineups.no_substitutes")}
        </Text>
      )}
    </View>
  );
};

const MatchLineups = ({ lineups }: TeamsLineupsProps) => {
  const { teamA, teamB } = lineups;
  const { width: screenWidth } = useWindowDimensions();
  const { t } = useTranslation();
  const [pitchSize, setPitchSize] = useState({ width: 0, height: 0 });

  const handlePitchLayout = useCallback((e: LayoutChangeEvent) => {
    setPitchSize({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  }, []);

  if (!teamA || !teamB || !teamA.lineup.length || !teamB.lineup.length) {
    return <NoData />;
  }

  const svgString = useMemo(
    () =>
      buildMatchLineupsSvgString(
        teamA,
        teamB,
        getLeftPercent,
        groupByLine,
        positionToLine,
      ),
    [teamA, teamB],
  );

  const teamALines = groupByLine(teamA.lineup);
  const teamBLines = groupByLine(teamB.lineup);

  const isTablet = screenWidth > 768;
  const isLargeScreen = screenWidth > 1024;

  const basePlayerSize = isLargeScreen ? 48 : isTablet ? 40 : 32;

  const toPixels = (percent: number, total: number) => (percent / 100) * total;

  const renderPitch = () => (
    <View
      style={[
        styles.pitchContainer,
        {
          width: "100%",
          maxWidth: isLargeScreen ? 600 : isTablet ? 500 : undefined,
          aspectRatio: 9 / 16,
        },
      ]}
      onLayout={handlePitchLayout}
      testID="pitch-container"
    >
      <View
        style={[StyleSheet.absoluteFill, styles.pitchField]}
        testID="pitch-image"
      />

      <View
        style={[styles.centerLine, { top: pitchSize.height * 0.5 }]}
        testID="center-line"
      />
      <View
        style={[
          styles.centerCircle,
          {
            top: pitchSize.height * 0.5 - 28,
            left: pitchSize.width * 0.5 - 28,
          },
        ]}
      />

      {Object.entries(teamALines).map(([lineStr, players]) => {
        const line = Number(lineStr);
        const topPercent = HOME_LINE_TOP[line] ?? 50;
        return players.map((p, idx) => {
          const leftPercent = getLeftPercent(idx, players.length);
          return (
            <PlayerMarker
              key={`home-${p.number}-${p.name}`}
              player={p}
              topPixels={toPixels(topPercent, pitchSize.height)}
              leftPixels={toPixels(leftPercent, pitchSize.width)}
              color={colors.brand.blueintense}
              playerSize={basePlayerSize}
            />
          );
        });
      })}

      {Object.entries(teamBLines).map(([lineStr, players]) => {
        const line = Number(lineStr);
        const topPercent = AWAY_LINE_TOP[line] ?? 50;
        return players.map((p, idx) => {
          const leftPercent = getLeftPercent(idx, players.length);
          return (
            <PlayerMarker
              key={`away-${p.number}-${p.name}`}
              player={p}
              topPixels={toPixels(topPercent, pitchSize.height)}
              leftPixels={toPixels(leftPercent, pitchSize.width)}
              color={colors.brand.danger}
              playerSize={basePlayerSize}
            />
          );
        });
      })}
    </View>
  );

  const renderTeamsInfo = () => (
    <View style={styles.teamsInfoContainer} testID="teams-info">
      <View style={styles.teamCard} testID="team-a-card">
        <TeamHeader
          teamName={teamA.teamName}
          teamLogo={teamA.teamLogo}
          formation={teamA.teamFormation}
          testID="team-a-header"
        />
        <SubstitutesList
          substitutes={teamA.substitutes}
          testID="team-a-substitutes"
        />
      </View>

      <View style={styles.teamCard} testID="team-b-card">
        <TeamHeader
          teamName={teamB.teamName}
          teamLogo={teamB.teamLogo}
          formation={teamB.teamFormation}
          testID="team-b-header"
        />
        <SubstitutesList
          substitutes={teamB.substitutes}
          testID="team-b-substitutes"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container} testID="match-lineups-container">
      {isTablet ? (
        <View style={styles.layoutRow}>
          <View style={styles.pitchSection}>{renderPitch()}</View>
          <View style={styles.infoSection}>{renderTeamsInfo()}</View>
        </View>
      ) : (
        <>
          <View style={styles.shareButtonContainer}>
            <ShareSvgButton svgString={svgString} />
          </View>
          {renderPitch()}
          {renderTeamsInfo()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  layoutRow: {
    flexDirection: "row",
    gap: spacing.lg,
    justifyContent: "space-between",
  },
  pitchSection: {
    flex: 1,
    alignItems: "center",
  },
  pitchContainer: {
    position: "relative",
    backgroundColor: colors.brand.aqua,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.brand.green,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  pitchField: {
    backgroundColor: colors.brand.green,
  },
  centerLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.overlay.white40,
    zIndex: 5,
  },
  centerCircle: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.overlay.white40,
    zIndex: 5,
  },
  playerMarkerContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 10,
  },
  playerCircle: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  playerNumber: {
    fontWeight: fontWeight.bold,
    color: colors.white,
    textAlign: "center",
  },
  playerName: {
    color: colors.text.primary,
    fontWeight: fontWeight.bold,
    textTransform: "uppercase",
    marginTop: 0.2,
    maxWidth: 60,
    textAlign: "center",
  },
  infoSection: {
    flex: 1,
    minWidth: 300,
  },
  teamsInfoContainer: {
    gap: spacing.md,
  },
  teamCard: {
    backgroundColor: colors.background.navbar,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2,
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.overlay.white10,
  },
  teamLogo: {
    width: 32,
    height: 32,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  formation: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.brand.success,
    textTransform: "uppercase",
  },
  substitutesContainer: {
    marginTop: spacing.md,
  },
  substitutesTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.brand.cream,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  substitutionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.overlay.white05,
  },
  substituteName: {
    flex: 1,
    fontSize: fontSize.xs,
    color: colors.text.primary,
    textTransform: "uppercase",
  },
  substituteNumber: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.brand.purple,
    textTransform: "uppercase",
    marginLeft: spacing.md,
  },
  noSubstitutes: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    fontStyle: "italic",
    paddingVertical: spacing.sm,
  },
  shareButtonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.secondary.dark,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.secondary.dark,
    alignItems: "flex-end",
  },
});

export default MatchLineups;
