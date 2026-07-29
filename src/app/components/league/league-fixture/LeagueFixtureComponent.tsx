import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  Modal,
  FlatList,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  ApiService,
  LeagueFixture,
  sortLeagueFixturesMatch,
  buildFixtureSvgString,
  cleanLeagueName,
  leagueTranslationKey,
} from "@matchinsights/core";
import ShareSvgButton from "../../general/share-svg-button/ShareSvgButton";
import { useTranslation } from "react-i18next";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "../../../icons/Icons";
import NoData from "../../general/no-data/NoData";
import MatchRow from "../../match/match-row/MatchRow";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  borders,
  breakpoints,
} from "../../../theme";
import { ms } from "../../../theme/scale";

interface LeagueFixtureProps {
  fixture: LeagueFixture | undefined;
  loading: boolean;
  leagueName: string;
  leagueLogo?: string;
  apiService: ApiService;
}

export const LeagueFixtureComponent = ({
  fixture,
  loading,
  leagueName,
  leagueLogo,
  apiService,
}: LeagueFixtureProps) => {
  const { width } = useWindowDimensions();
  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet;

  const responsiveStyles = useMemo(() => {
    if (isTV) {
      return {
        chevronSize: 28,
        roundButtonFontSize: fontSize.lg,
        teamNameFontSize: fontSize.base,
        scoreFontSize: fontSize.lg,
        cardPadding: spacing.lg,
        teamGap: spacing.md,
      };
    }
    if (isLargeScreen) {
      return {
        chevronSize: 24,
        roundButtonFontSize: fontSize.base,
        teamNameFontSize: fontSize.sm,
        scoreFontSize: fontSize.base,
        cardPadding: spacing.md,
        teamGap: spacing.sm,
      };
    }
    if (isTablet) {
      return {
        chevronSize: 22,
        roundButtonFontSize: fontSize.sm,
        teamNameFontSize: fontSize.sm,
        scoreFontSize: fontSize.sm,
        cardPadding: spacing.sm,
        teamGap: spacing.sm,
      };
    }
    return {
      chevronSize: 20,
      roundButtonFontSize: fontSize.sm,
      teamNameFontSize: fontSize.xs,
      scoreFontSize: fontSize.sm,
      cardPadding: spacing.sm,
      teamGap: spacing.xs,
    };
  }, [isTV, isLargeScreen, isTablet]);

  if (loading) return <NoData loading={loading} />;

  if (!loading && !(Number(fixture?.totalRounds) > 0)) {
    return <NoData />;
  }

  const [currentRoundIndex, setCurrentRoundIndex] = useState(
    fixture?.currentRoundIndex ?? 0,
  );
  const [roundDropDown, setRoundDropDown] = useState(false);
  const roundNames = fixture?.rounds
    ? fixture?.rounds.map((it) => it.name)
    : [];

  const trKey = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/-/g, "_")
      .replace(/\s+/g, "_")
      .replace(/__+/g, "_");

  const { t } = useTranslation();

  const roundNameDisplayedFormat = (roundName: string): string =>
    t(`fixtures.${trKey(roundName.toLowerCase())}`, {
      defaultValue: roundName,
    });

  const leagueDisplayedName = cleanLeagueName(
    t(`league.${leagueTranslationKey(leagueName)}`, {
      defaultValue: leagueName,
    }),
  );

  const handleSelectRound = (roundNameIndex: number) => {
    setCurrentRoundIndex(roundNameIndex);
    setRoundDropDown(false);
  };

  const setCurrentLeft = () =>
    setCurrentRoundIndex(
      roundNames.length > 0 && currentRoundIndex === 0
        ? roundNames.length - 1
        : currentRoundIndex - 1,
    );

  const setCurrentRight = () =>
    setCurrentRoundIndex(
      roundNames.length > 0 && currentRoundIndex === roundNames.length - 1
        ? 0
        : currentRoundIndex + 1,
    );

  const currentRound = fixture?.rounds[currentRoundIndex]
    ? {
        ...fixture.rounds[currentRoundIndex],
        name: roundNameDisplayedFormat(fixture.rounds[currentRoundIndex].name),
      }
    : undefined;

  const svgString = currentRound
    ? buildFixtureSvgString(currentRound, leagueDisplayedName, leagueLogo)
    : "";

  return (
    <ScrollView
      style={styles.container}
      testID="league-fixture-container"
      accessibilityLabel={t("accessibility.league_fixtures")}
    >

      <View style={styles.controlsContainer}>
        <Pressable
          testID="left-round"
          onPress={setCurrentLeft}
          style={styles.navigationButton}
          accessibilityLabel={t("accessibility.previous_round")}
          accessibilityRole="button"
        >
          <ChevronLeftIcon
            size={responsiveStyles.chevronSize}
            color={colors.text.primary}
          />
        </Pressable>

        <View style={styles.roundSelectContainer}>
          <Pressable
            testID="drop-rounds"
            onPress={() => setRoundDropDown(!roundDropDown)}
            style={styles.roundButton}
            accessibilityLabel={t("accessibility.select_round")}
            accessibilityRole="button"
            accessibilityState={{ expanded: roundDropDown }}
          >
            <Text
              style={[
                styles.roundButtonText,
                { fontSize: responsiveStyles.roundButtonFontSize },
              ]}
              numberOfLines={1}
            >
              {roundNameDisplayedFormat(roundNames[currentRoundIndex])}
            </Text>
            {roundDropDown ? (
              <ChevronUpIcon size={responsiveStyles.chevronSize} />
            ) : (
              <ChevronDownIcon size={responsiveStyles.chevronSize} />
            )}
          </Pressable>

          <Modal
            visible={roundDropDown}
            transparent
            animationType="fade"
            onRequestClose={() => setRoundDropDown(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setRoundDropDown(false)}
              accessibilityLabel={t("accessibility.close_dropdown")}
            >
              <View style={styles.modalContent}>
                <FlatList
                  data={roundNames}
                  renderItem={({ item: roundName, index: idx }) => (
                    <Pressable
                      testID={`round-${idx}`}
                      onPress={() => handleSelectRound(idx)}
                      style={[
                        styles.roundOption,
                        idx === currentRoundIndex && styles.roundOptionActive,
                      ]}
                      accessibilityRole="menuitem"
                      accessibilityState={{
                        selected: idx === currentRoundIndex,
                      }}
                    >
                      <Text
                        style={[
                          styles.roundOptionText,
                          idx === currentRoundIndex &&
                            styles.roundOptionTextActive,
                        ]}
                        numberOfLines={2}
                      >
                        {roundNameDisplayedFormat(roundName)}
                      </Text>
                    </Pressable>
                  )}
                  keyExtractor={(item, idx) => `${item}-${idx}`}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                />
              </View>
            </Pressable>
          </Modal>
        </View>

        <Pressable
          testID="right-round"
          onPress={setCurrentRight}
          style={styles.navigationButton}
          accessibilityLabel={t("accessibility.next_round")}
          accessibilityRole="button"
        >
          <ChevronRightIcon
            size={responsiveStyles.chevronSize}
            color={colors.text.primary}
          />
        </Pressable>
      </View>

      {roundNames.length > 0 &&
        fixture?.rounds[currentRoundIndex].days.map((roundDays) => (
          <View key={roundDays.date} style={styles.daysContainer}>
            {sortLeagueFixturesMatch(roundDays.matches).map((match) => (
              <MatchRow
                key={match.fixtureId}
                match={match}
                testID={`match-card-${match.fixtureId}`}
                apiService={apiService}
                logoOuter={false}
                style={styles.matchCardRow}
                cardStyle={[
                  styles.matchCard,
                  { padding: responsiveStyles.cardPadding },
                ]}
                sizing={{
                  teamNameFontSize: fontSize.xxs,
                  scoreFontSize: responsiveStyles.scoreFontSize,
                  logoSize: ms(20),
                  teamGap: responsiveStyles.teamGap,
                }}
              />
            ))}
          </View>
        ))}

      {currentRound && (
        <View style={styles.toolbar}>
          <ShareSvgButton svgString={svgString} />
        </View>
      )}


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.card,
  } as ViewStyle,
  toolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  } as ViewStyle,
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    gap: spacing.xs,
    backgroundColor: colors.background.dark,
    borderBottomWidth: borders.thin,
    borderRadius: borderRadius.sm,
    borderBottomColor: colors.background.card,
  } as ViewStyle,
  navigationButton: {
    padding: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
  } as ViewStyle,
  roundSelectContainer: {
    flex: 1,
    justifyContent: "center",
  } as ViewStyle,
  roundButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
  } as ViewStyle,
  roundButtonText: {
    color: colors.text.primary,
    fontWeight: fontWeight.bold,
    textTransform: "uppercase",
    textAlign: "center",
  } as TextStyle,
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  modalContent: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    maxHeight: "60%",
    width: "80%",
    paddingVertical: spacing.sm,
  } as ViewStyle,
  roundOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.background.dark,
  } as ViewStyle,
  roundOptionActive: {
    backgroundColor: colors.brand.green,
  } as ViewStyle,
  roundOptionText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    textTransform: "uppercase",
  } as TextStyle,
  roundOptionTextActive: {
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  } as TextStyle,
  daysContainer: {
    marginVertical: spacing.xs,
  } as ViewStyle,
  matchCard: {
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  } as ViewStyle,
  matchCardRow: {
    justifyContent: "space-between",
    gap: spacing.xs,
  } as ViewStyle,
});
