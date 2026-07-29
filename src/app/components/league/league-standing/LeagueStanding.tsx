import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import ShareSvgButton from "../../general/share-svg-button/ShareSvgButton";
import {
  LeagueInfo,
  LeagueTeamInfo,
  leagueGroupTranslation,
  buildStandingsSvgString,
  SvgLeagueTableColDefinition,
  cleanLeagueName,
  leagueTranslationKey,
} from "@matchinsights/core";

import { useTranslation } from "react-i18next";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "../../../icons/Icons";
import NoData from "../../general/no-data/NoData";
import { LeagueTable } from "../league-table/LeagueTable";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  borders,
} from "../../../theme";

const SVG_TEAM_NAME_MAX_LENGTH = 20;

const truncateForSvg = (name: string) =>
  name.length > SVG_TEAM_NAME_MAX_LENGTH
    ? name.slice(0, SVG_TEAM_NAME_MAX_LENGTH) + "…"
    : name;

type Translate = (key: string, opts?: object) => string;

const formItemTranslation = (translate: Translate, result: string): string => {
  switch (result) {
    case "W":
      return translate("common.W", { defaultValue: "W" });
    case "D":
      return translate("common.D", { defaultValue: "D" });
    default:
      return translate("common.L", { defaultValue: "L" });
  }
};

function svgReportColumns(translate: Translate): SvgLeagueTableColDefinition[] {
  return [
    { label: "#", x: 0, w: 40, align: "center" },
    {
      label: translate("leaguestanding.team", { defaultValue: "Team" }),
      x: 40,
      w: 210,
      align: "left",
    },
    {
      label: translate("leaguestanding.pts", { defaultValue: "Pts" }),
      x: 250,
      w: 55,
      align: "center",
    },
    {
      label: translate("leaguestanding.p", { defaultValue: "P" }),
      x: 305,
      w: 50,
      align: "center",
    },
    {
      label: translate("leaguestanding.w", { defaultValue: "W" }),
      x: 355,
      w: 50,
      align: "center",
    },
    {
      label: translate("leaguestanding.d", { defaultValue: "D" }),
      x: 405,
      w: 50,
      align: "center",
    },
    {
      label: translate("leaguestanding.l", { defaultValue: "L" }),
      x: 455,
      w: 50,
      align: "center",
    },
    {
      label: translate("leaguestanding.gf", { defaultValue: "GF" }),
      x: 505,
      w: 50,
      align: "center",
    },
    {
      label: translate("leaguestanding.ga", { defaultValue: "GA" }),
      x: 555,
      w: 50,
      align: "center",
    },
    {
      label: translate("leaguestanding.form", { defaultValue: "Form" }),
      x: 605,
      w: 195,
      align: "center",
    },
  ];
}

interface LeagueStandingProps {
  leagueInfo: LeagueInfo | undefined;
  loading: boolean;
}

export default function LeagueStanding({
  leagueInfo,
  loading,
}: LeagueStandingProps) {
  if (loading) return <NoData loading={loading} />;
  if (!loading && !leagueInfo) return <NoData />;

  const { i18n, t } = useTranslation();
  const translate = (key: string, opts?: object): string =>
    t(key, opts as any) as string;

  const [groupDropDown, setGroupDropDown] = useState(false);
  const [teams, setTeams] = useState<LeagueTeamInfo[]>(
    leagueInfo?.group && leagueInfo?.group.length > 0
      ? leagueInfo?.group[0].teams
      : [],
  );
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);

  const groupNames =
    leagueInfo?.group && leagueInfo?.group.length > 0
      ? leagueInfo?.group.map((groupLabel) =>
          leagueGroupTranslation(groupLabel.label ?? "", i18n.language),
        )
      : ["Default"];

  const cleanedLeagueName = (leagueName?: string) =>
    leagueName
      ? cleanLeagueName(
          t(`league.${leagueTranslationKey(leagueName)}`, {
            defaultValue: leagueName,
          }),
        )
      : t("common.unknown");

  const svgString = buildStandingsSvgString(
    teams.map((team) => ({ ...team, teamName: truncateForSvg(team.teamName) })),
    cleanedLeagueName(leagueInfo?.name),
    leagueInfo?.logo,
    groupNames.length > 1 ? groupNames[selectedGroupIndex] : undefined,
    svgReportColumns(translate),
    (result) => formItemTranslation(translate, result),
  );

  const handleSelectGroup = (groupNameIndex: number) => {
    setSelectedGroupIndex(groupNameIndex);
    setTeams(leagueInfo?.group[groupNameIndex].teams ?? []);
    setGroupDropDown(false);
  };

  const setCurrentLeft = () => {
    const newIndex =
      selectedGroupIndex === 0 ? groupNames.length - 1 : selectedGroupIndex - 1;
    setSelectedGroupIndex(newIndex);
    setTeams(leagueInfo?.group[newIndex].teams ?? []);
  };

  const setCurrentRight = () => {
    const newIndex =
      selectedGroupIndex === groupNames.length - 1 ? 0 : selectedGroupIndex + 1;
    setSelectedGroupIndex(newIndex);
    setTeams(leagueInfo?.group[newIndex].teams ?? []);
  };

  return (
    <View style={styles.container}>

      {groupNames.length > 1 && (
        <View style={styles.controlsContainer}>
          <Pressable
            testID="button-left"
            onPress={setCurrentLeft}
            style={styles.navigationButton}
            accessibilityLabel={t('accessibility.previous_group')}
            accessibilityRole="button"
          >
            <ChevronLeftIcon size={fontSize.sm} color={colors.text.primary} />
          </Pressable>

          <View style={styles.selectorContainer}>
            <Pressable
              testID="drop-down-btn"
              onPress={() => setGroupDropDown(!groupDropDown)}
              style={styles.selectorButton}
            >
              <Text style={styles.selectorButtonText} numberOfLines={1}>
                {groupNames[selectedGroupIndex]}
              </Text>
              {groupDropDown ? (
                <ChevronUpIcon size={fontSize.sm} color={colors.text.primary} />
              ) : (
                <ChevronDownIcon
                  size={fontSize.sm}
                  color={colors.text.primary}
                />
              )}
            </Pressable>

            <Modal
              visible={groupDropDown}
              transparent
              animationType="fade"
              onRequestClose={() => setGroupDropDown(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setGroupDropDown(false)}
              >
                <View style={styles.modalContent}>
                  <FlatList
                    data={groupNames}
                    renderItem={({ item: groupName, index: idx }) => (
                      <Pressable
                        testID={`group-option-${idx}`}
                        onPress={() => handleSelectGroup(idx)}
                        style={[
                          styles.groupOption,
                          idx === selectedGroupIndex &&
                            styles.groupOptionActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.groupOptionText,
                            idx === selectedGroupIndex &&
                              styles.groupOptionTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {groupName}
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
            testID="button-right"
            onPress={setCurrentRight}
            style={styles.navigationButton}
            accessibilityLabel={t('accessibility.next_group')}
            accessibilityRole="button"
          >
            <ChevronRightIcon size={fontSize.sm} color={colors.text.primary} />
          </Pressable>
        </View>
      )}

      <LeagueTable teams={teams} />

      <View style={styles.toolbar}>
        <ShareSvgButton svgString={svgString} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.sm,
  } as ViewStyle,
  navigationButton: {
    padding: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  selectorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderColor: colors.background.card,
  } as ViewStyle,
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  } as ViewStyle,
  selectorButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    textTransform: "uppercase",
    flex: 1,
  } as TextStyle,
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay.dark50,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  modalContent: {
    backgroundColor: colors.background.card,
    borderRadius: 8,
    maxHeight: "60%",
    width: "80%",
    paddingVertical: spacing.sm,
  } as ViewStyle,
  groupOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.background.dark,
  } as ViewStyle,
  groupOptionActive: {
    backgroundColor: colors.brand.green,
  } as ViewStyle,
  groupOptionText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    textTransform: "uppercase",
  } as TextStyle,
  groupOptionTextActive: {
    fontWeight: fontWeight.bold,
  } as TextStyle,
});
