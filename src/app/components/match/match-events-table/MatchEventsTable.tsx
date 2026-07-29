import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { MatchEvent, buildMatchEventsSvgString } from "@matchinsights/core";
import { useTranslation } from "react-i18next";
import ShareSvgButton from "../../general/share-svg-button/ShareSvgButton";
import {
  FootballIcon,
  SubstitutionIcon,
  YellowCardIcon,
  RedCardIcon,
  VideoIcon,
  IncorrectIcon,
} from "../../../icons/Icons";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  borders,
  breakpoints,
} from "../../../theme";

interface MatchEventsTableProps {
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  events: MatchEvent[];
}

const MatchEventsTable = ({
  events,
  homeTeamName,
  homeTeamLogo,
  awayTeamName,
  awayTeamLogo,
}: MatchEventsTableProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= breakpoints.desktop;

  const headerFontSize = isLargeScreen ? fontSize.sm : fontSize.xs;
  const eventFontSize = isLargeScreen ? fontSize.sm : fontSize.xs;
  const logoSize = isLargeScreen ? 24 : 18;
  const iconSize = isLargeScreen ? 16 : 13;
  const horizontalPadding = isLargeScreen ? spacing.md : spacing.sm;

  const eventDetailTKey = (eType: string): string => {
    return eType
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "");
  };

  // Sort events by time (descending)
  const sortedEvents: MatchEvent[] = useMemo(
    () =>
      [...(events ?? [])].sort(
        (a, b) =>
          (b.timeElapsed ?? 0) +
          (b.timeExtra ?? 0) -
          ((a.timeElapsed ?? 0) + (a.timeExtra ?? 0)),
      ),
    [events],
  );

  const formatEventTime = (elapsed?: number, extra?: number): string => {
    if (elapsed == null) return "-";
    return extra ? `${elapsed}' +${extra}` : `${elapsed}'`;
  };

  const renderEventIcon = (
    eventType: string,
    eventDetail: string,
  ): React.ReactNode => {
    const detail = (eventDetail ?? "").toLowerCase();
    const eType = (eventType ?? "").toLowerCase();

    if (eType.includes("var")) return <VideoIcon size={iconSize} />;
    if (eType.includes("goal")) {
      if (detail.includes("missed"))
        return <IncorrectIcon size={iconSize} color={colors.text.secondary} />;
      return <FootballIcon size={iconSize} />;
    }
    if (eType.includes("card")) {
      if (detail.includes("yellow")) return <YellowCardIcon size={iconSize} />;
      if (detail.includes("red")) return <RedCardIcon size={iconSize} />;
    }
    if (detail.includes("substitution"))
      return <SubstitutionIcon size={iconSize} />;

    return <Text style={styles.bulletDot}>•</Text>;
  };

  const displayPlayer = (
    eventType: string,
    eventDetail: string,
    playerName?: string,
  ): boolean => {
    const detail = (eventDetail ?? "").toLowerCase();
    const eType = (eventType ?? "").toLowerCase();

    return (
      (detail.includes("substitution") ||
        eType.includes("card") ||
        eType.includes("goal")) &&
      playerName !== null &&
      playerName !== undefined &&
      playerName.length > 0
    );
  };

  const renderedPlayerName = (playerName: string): string => {
    const parts = playerName.trim().split(" ");
    const firstInitial = parts[0]?.charAt(0) || "";
    const lastName = parts[parts.length - 1] || "";
    return `${firstInitial}. ${lastName}`;
  };

  const eventLabel = (event: MatchEvent): string => {
    if (displayPlayer(event.eventType, event.eventDetails, event.playerName)) {
      return renderedPlayerName(event.playerName as string);
    }
    return t(`liveevents.${eventDetailTKey(event.eventType)}`, {
      defaultValue: event.eventDetails,
    });
  };

  const svgString = useMemo(
    () =>
      buildMatchEventsSvgString({
        homeTeamName,
        homeTeamLogo,
        awayTeamName,
        awayTeamLogo,
        events: sortedEvents,
        timeLabel: t("liveevents.time"),
        eventLabel,
      }),
    [homeTeamName, homeTeamLogo, awayTeamName, awayTeamLogo, sortedEvents, t],
  );

  const renderEventRow = ({
    item: event,
    index: idx,
  }: {
    item: MatchEvent;
    index: number;
  }) => {
    const isHomeTeamEvent = event.teamName === homeTeamName;
    const rowBg =
      idx % 2 === 0 ? colors.background.navbar : colors.background.card;

    return (
      <View
        style={[
          styles.eventRow,
          { backgroundColor: rowBg, paddingHorizontal: horizontalPadding },
        ]}
        testID={`event-row-${idx}`}
      >
        {/* Home team side */}
        <View style={styles.teamSide}>
          {isHomeTeamEvent && (
            <>
              <View testID={`event-icon-${idx}`}>
                {renderEventIcon(event.eventType, event.eventDetails)}
              </View>
              {displayPlayer(
                event.eventType,
                event.eventDetails,
                event.playerName,
              ) ? (
                <Text
                  style={[styles.playerName, { fontSize: eventFontSize }]}
                  numberOfLines={1}
                  testID="homePlayer"
                >
                  {renderedPlayerName(event.playerName as string)}
                </Text>
              ) : (
                <Text
                  style={[styles.eventDetail, { fontSize: eventFontSize }]}
                  numberOfLines={1}
                  testID="homeDetail"
                >
                  {t(`liveevents.${eventDetailTKey(event.eventType)}`, {
                    defaultValue: event.eventDetails,
                  })}
                </Text>
              )}
            </>
          )}
        </View>

        <View style={styles.timeColumn}>
          <Text
            style={[styles.timeText, { fontSize: eventFontSize }]}
            testID={`event-time-${idx}`}
          >
            {formatEventTime(event.timeElapsed, event.timeExtra)}
          </Text>
        </View>
        <View style={[styles.teamSide, styles.teamSideRight]}>
          {!isHomeTeamEvent && (
            <>
              {displayPlayer(
                event.eventType,
                event.eventDetails,
                event.playerName,
              ) ? (
                <Text
                  style={[styles.playerName, { fontSize: eventFontSize, textAlign: "right" }]}
                  numberOfLines={1}
                  testID="awayPlayer"
                >
                  {renderedPlayerName(event.playerName as string)}
                </Text>
              ) : (
                <Text
                  style={[styles.eventDetail, { fontSize: eventFontSize, textAlign: "right" }]}
                  numberOfLines={1}
                  testID="awayDetail"
                >
                  {t(`liveevents.${eventDetailTKey(event.eventType)}`, {
                    defaultValue: event.eventDetails,
                  })}
                </Text>
              )}
              <View testID={`event-icon-${idx}`}>
                {renderEventIcon(event.eventType, event.eventDetails)}
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { marginHorizontal: horizontalPadding }]}>
      <View style={styles.header}>
        <View style={styles.teamHeader}>
          {homeTeamLogo && (
            <Image
              source={{ uri: homeTeamLogo }}
              style={[styles.logo, { width: logoSize, height: logoSize }]}
              testID="homeTeamLogo"
            />
          )}
          <Text
            style={[styles.teamHeaderText, { fontSize: headerFontSize }]}
            numberOfLines={1}
          >
            {homeTeamName}
          </Text>
        </View>

        <Text style={[styles.timeHeader, { fontSize: headerFontSize }]}>
          {t("liveevents.time")}
        </Text>

        <View style={[styles.teamHeader, styles.teamHeaderRight]}>
          <Text
            style={[styles.teamHeaderText, { fontSize: headerFontSize, textAlign: "right" }]}
            numberOfLines={1}
          >
            {awayTeamName}
          </Text>
          {awayTeamLogo && (
            <Image
              source={{ uri: awayTeamLogo }}
              style={[styles.logo, { width: logoSize, height: logoSize }]}
              testID="awayTeamLogo"
            />
          )}
        </View>
      </View>

      <FlatList
        data={sortedEvents}
        renderItem={renderEventRow}
        keyExtractor={(_, idx) => `event-${idx}`}
        scrollEnabled={false}
        testID="events-list"
      />

      <View style={styles.shareButtonContainer}>
        <ShareSvgButton svgString={svgString} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  marginTop: spacing.xs,
  borderRadius: borderRadius.sm,
  backgroundColor: colors.background.navbar,
  overflow: 'hidden',

  borderWidth: borders.thin,
  borderColor: colors.overlay.orange30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.secondary.dark,
  },
  shareButtonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.secondary.dark,
    alignItems: "flex-end",
  },
  teamHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minWidth: 80,
  },
  teamHeaderRight: {
    justifyContent: "flex-end",
  },
  teamHeaderText: {
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textTransform: "uppercase",
    flex: 1,
    flexShrink: 1,
  },
  logo: {
    resizeMode: "contain",
  },
  timeHeader: {
    fontWeight: fontWeight.semibold,
    color: colors.brand.orange,
    textAlign: "center",
    minWidth: 50,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  teamSide: {
    flex: 1,
    minWidth: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  teamSideRight: {
    justifyContent: "flex-end",
  },
  timeColumn: {
    minWidth: 50,
    alignItems: "center",
  },
  timeText: {
    fontWeight: fontWeight.semibold,
    color: colors.brand.success,
    textAlign: "center",
  },
  playerName: {
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  eventDetail: {
    color: colors.text.primary,
    textTransform: "uppercase",
    flex: 1,
  },
  bulletDot: {
    fontSize: 10,
    color: colors.text.secondary,
  },
});

export default MatchEventsTable;
