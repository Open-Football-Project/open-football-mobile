import React, { useMemo } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import SubHeader from "../../../components/general/sub-header/SubHeader";
import NoData from "../../../components/general/no-data/NoData";
import LeagueGroupCard from "../../../components/league/groups/grp-card/LeagueGroupCard";
import {
  ScreenTabs,
  TabItem,
} from "../../../components/general/screen-tabs/ScreenTabs";
import {
  useLeaguePage,
  ApiService,
  cleanLeagueName,
  leagueTranslationKey,
  leagueLinksToMobileRoutes,
  leagueGroupTranslation,
} from "@matchinsights/core";
import { colors, spacing, borderRadius, breakpoints } from "../../../theme";

interface LeagueGroupsPageProps {
  apiService: ApiService;
}

const LeagueGroupsPage = ({ apiService }: LeagueGroupsPageProps) => {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop;
  const isTabletOrLarger = width >= breakpoints.tablet;

  const getContainerPadding = () => {
    if (isTV) return spacing.xl;
    if (isLargeScreen) return spacing.lg;
    if (isTabletOrLarger) return spacing.md;
    return spacing.sm;
  };

  const getContentMaxWidth = () => {
    if (isTV) return 1200;
    if (isLargeScreen) return 900;
    if (isTabletOrLarger) return width * 0.95;
    return width;
  };

  const leagueId = (route.params as any)?.leagueId;
  const parsedLeagueId = Number(leagueId);

  const { leagueInfo, leagueLinks, hasMultipleGroups, loadingLeagueInfo } =
    useLeaguePage(apiService, parsedLeagueId, t);

  const leagueHeader = (): string => {
    if (!leagueInfo?.name || leagueInfo?.name === "Unknown League") {
      return t("lggroups.header");
    }
    return t(`league.${leagueTranslationKey(leagueInfo?.name)}`, {
      defaultValue: leagueInfo.name,
    });
  };

  const groupTabs: TabItem[] = useMemo(() => {
    if (!leagueInfo?.group || leagueInfo.group.length === 0) {
      return [];
    }
    return leagueInfo.group.map((group, index) => ({
      component: (
        <View key={`group-tab-${index}`} style={styles.tabContent}>
          <LeagueGroupCard group={group} />
        </View>
      ),
      titleTranslationKey: leagueGroupTranslation(
        group.label ?? "",
        i18n.language,
      ),
      testID: `league-group-tab-${index}`,
    }));
  }, [leagueInfo?.group, i18n.language]);

  const renderSubHeader = () => (
    <SubHeader
      title={cleanLeagueName(leagueHeader())}
      logoUrl={leagueInfo?.logo ?? ""}
      subTitle={
        leagueInfo?.country
          ? t(`country.${leagueInfo?.country?.toLowerCase()}`, {
              defaultValue: leagueInfo?.country,
            })
          : ""
      }
      optionalLinks={leagueLinksToMobileRoutes(leagueLinks ?? [])}
    />
  );

  if (!leagueId || Number.isNaN(parsedLeagueId)) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="league-groups-screen"
      >
        <View
          style={[
            styles.contentWrapper,
            { maxWidth: getContentMaxWidth(), padding: getContainerPadding() },
          ]}
        >
          {renderSubHeader()}
          <NoData />
        </View>
      </ScrollView>
    );
  }

  if (loadingLeagueInfo) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="league-groups-screen-loading"
      >
        <View
          style={[
            styles.contentWrapper,
            { maxWidth: getContentMaxWidth(), padding: getContainerPadding() },
          ]}
        >
          {renderSubHeader()}
          <View style={styles.loadingContainer}>
            <NoData loading />
          </View>
        </View>
      </ScrollView>
    );
  }

  if (!leagueInfo || !hasMultipleGroups || groupTabs.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="league-groups-screen-nogroups"
      >
        <View
          style={[
            styles.contentWrapper,
            { maxWidth: getContentMaxWidth(), padding: getContainerPadding() },
          ]}
        >
          {renderSubHeader()}
          <NoData />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      testID="league-groups-screen"
    >
      <View
        style={[
          styles.contentWrapper,
          { maxWidth: getContentMaxWidth(), padding: getContainerPadding() },
        ]}
      >
        {renderSubHeader()}

        <View style={styles.tabsSection}>
          <ScreenTabs tabs={groupTabs} testIDPrefix="league-groups-tabs" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: colors.overlay.royalblueo,
  },
  contentWrapper: {
    width: "100%",
    alignSelf: "center",
  },
  tabsSection: {
    marginTop: spacing.lg,
    width: "100%",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.brand.dona,
  },
  tabContent: {
    width: "100%",
    paddingVertical: 0,
  },
  loadingContainer: {
    marginVertical: spacing.lg,
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    width: "100%",
  },
});

export default LeagueGroupsPage;
