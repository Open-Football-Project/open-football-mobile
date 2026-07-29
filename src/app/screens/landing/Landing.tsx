import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  useTodayMatches,
  ApiService,
  MobileRoutes,
} from "open-football-project-core";
import { leagueWeights } from "./landing-data";
import { RootStackParamList, Routes } from "../../navigation/RootNavigator";
import {
  colors,
  spacing,
  borderRadius,
  borders,
  shadows,
  textStyles,
  fontSize,
  breakpoints,
} from "../../theme";
import {
  LiveIcon,
  FootballIcon,
  ChartIcon,
  CalendarIcon,
  PlayerIcon,
} from "../../icons/Icons";
import NoData from "../../components/general/no-data/NoData";
import MatchesGrid from "../../components/match/matches-grid/MatchesGrid";

interface LandingProps {
  apiService: ApiService;
}

type Nav = NativeStackNavigationProp<RootStackParamList, MobileRoutes.LANDING>;

const Landing = ({ apiService }: LandingProps) => {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const { loadingMatches, leagueMatches, isLeagueMatchesAvailable } =
    useTodayMatches(apiService, leagueWeights);

  const isTv = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isMobile = width < breakpoints.tablet;

  const containerPadding = isTv
    ? spacing.xxxl
    : isLargeScreen
    ? spacing.xl
    : isTablet
    ? spacing.lg
    : spacing.md;

  const iconSize = isTv
    ? fontSize.xxxl
    : isLargeScreen
    ? fontSize.xxl
    : fontSize.xl;

  const buttonContainerStyle = isMobile
    ? styles.ctaContainerVertical
    : styles.ctaContainerHorizontal;

  const listHeader = (
    <>
      <View style={[styles.heroSection, { paddingHorizontal: containerPadding }]}>
        
        <Text
          style={[textStyles.h1, styles.title, isTv && styles.titleTv]}
          accessibilityRole="header"
        >
          {t("home.mainhead")}
        </Text>
        <Text
          style={[textStyles.body, styles.subtitle, isTv && styles.subtitleTv]}
        >
          {t("home.headtext")}
        </Text>


        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.todayPlayersBtn,
            !isMobile && styles.todayPlayersBtnWide,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate(Routes.TODAY_PLAYERS, {})}
          accessibilityRole="button"
          accessibilityLabel={t("home.todayplayerscta")}
          testID="today-players-cta"
        >
          <View style={styles.buttonContent}>
            <PlayerIcon size={iconSize} color={colors.text.darker} />
            <Text
              style={[
                styles.buttonText,
                styles.todayPlayersBtnText,
                isTv && styles.buttonTextTv,
              ]}
            >
              {t("home.todayplayerscta")}
            </Text>
          </View>
        </Pressable>
 
        <View style={[styles.ctaContainer, buttonContainerStyle]}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.liveBtn,
              !isMobile && styles.buttonFlex,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate(Routes.LIVE)}
            accessibilityRole="button"
            accessibilityLabel={t("home.livebtn")}
            testID="live-button"
          >
            <View style={styles.buttonContent}>
              <LiveIcon size={iconSize} />
              <Text style={[styles.buttonText, isTv && styles.buttonTextTv]}>
                {t("home.livebtn")}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.leaguesBtn,
              !isMobile && styles.buttonFlex,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate(Routes.ALL_LEAGUES)}
            accessibilityRole="button"
            accessibilityLabel={t("home.leaguesbtn")}
            testID="leagues-button"
          >
            <View style={styles.buttonContent}>
              <FootballIcon size={iconSize} />
              <Text style={[styles.buttonText, isTv && styles.buttonTextTv]}>
                {t("home.leaguesbtn")}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.chartsBtn,
              !isMobile && styles.buttonFlex,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate(Routes.CHARTS, {})}
            accessibilityRole="button"
            accessibilityLabel={t("home.chartsbtn")}
            testID="charts-button"
          >
            <View style={styles.buttonContent}>
              <ChartIcon size={iconSize} />
              <Text style={[styles.buttonText, isTv && styles.buttonTextTv]}>
                {t("home.chartsbtn")}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View
        style={[styles.matchesSection, { paddingHorizontal: containerPadding }]}
        testID="today-matches-section"
      >
        <Text
          style={[
            textStyles.h2,
            styles.sectionTitle,
            isTv && styles.sectionTitleTv,
          ]}
          accessibilityRole="header"
        >
          {t("home.todaymatches")}
        </Text>

        {loadingMatches && <NoData loading={true} />}
        {!loadingMatches && !isLeagueMatchesAvailable && (
          <NoData message={t("matches.nodatamsg")} isBigMessage />
        )}
      </View>
    </>
  );

  const listFooter = (
    <View
      style={[
        styles.bottomCtaSection,
        { paddingHorizontal: containerPadding },
      ]}
    >
      <Text
        style={[
          textStyles.h2,
          styles.bottomTitle,
          isTv && styles.bottomTitleTv,
        ]}
        accessibilityRole="header"
      >
        {t("home.bottomhead")}
      </Text>
      <Text
        style={[
          textStyles.body,
          styles.bottomSubtitle,
          isTv && styles.bottomSubtitleTv,
        ]}
      >
        {t("home.bottomtext")}
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.matchesBtn,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => navigation.navigate(Routes.MATCHES)}
        accessibilityRole="button"
        accessibilityLabel={t("home.matchesbtn")}
        testID="matches-button"
      >
        <View style={styles.buttonContent}>
          <CalendarIcon size={iconSize} />
          <Text style={[styles.buttonText, isTv && styles.buttonTextTv]}>
            {t("home.matchesbtn")}
          </Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      testID="landing-screen"
      style={styles.container}
        contentContainerStyle={{
       paddingVertical: containerPadding,
       backgroundColor: colors.overlay.royalblueo,
      }}
      accessibilityLabel={t("home.mainhead")}
      data={!loadingMatches && isLeagueMatchesAvailable ? leagueMatches : []}
      keyExtractor={(item) => item.leagueId.toString()}
      renderItem={({ item }) => <MatchesGrid league={item} apiService={apiService} />}
      ListHeaderComponent={listHeader}
      ListFooterComponent={listFooter}
      initialNumToRender={3}
      maxToRenderPerBatch={5}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  heroSection: {
    paddingVertical: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  titleTv: {
    fontSize: 48,
    lineHeight: 56,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: spacing.lg,
    color: colors.text.secondary,
    maxWidth: 600,
  },
  subtitleTv: {
    fontSize: 24,
    lineHeight: 32,
    maxWidth: 900,
  },
  ctaContainer: {
    width: "100%",
    maxWidth: 1200,
  },
  ctaContainerVertical: {
    flexDirection: "column",
    gap: spacing.md,
  },
  ctaContainerHorizontal: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  buttonFlex: {
    flex: 1,
    maxWidth: 300,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  liveBtn: {
    backgroundColor: colors.brand.green,
  },
  leaguesBtn: {
    backgroundColor: colors.brand.royalblue,
  },
  chartsBtn: {
    backgroundColor: colors.brand.roseint,
  },
  matchesBtn: {
    backgroundColor: colors.brand.orange,
    minWidth: 200,
  },
  todayPlayersBtn: {
  backgroundColor: colors.brand.yellow,
  width: "100%",
  marginBottom: spacing.md,
  },
  todayPlayersBtnWide: {
    maxWidth: 480,
  },
  todayPlayersBtnText: {
    color: colors.text.darker,
  },
  buttonText: {
    ...textStyles.bodyBold,
    color: colors.white,
  },
  buttonTextTv: {
    fontSize: 24,
  },
  matchesSection: {
    paddingVertical: spacing.xl,
  },
  sectionTitle: {
    textAlign: "center",
    marginBottom: spacing.lg,
    color: colors.brand.cream,
  },
  sectionTitleTv: {
    fontSize: 36,
    lineHeight: 44,
    marginBottom: spacing.xl,
  },
  bottomCtaSection: {
  paddingVertical: spacing.xxl,
  alignItems: "center",
  justifyContent: "center",

  backgroundColor: colors.background.dark,

  borderWidth: borders.thin,
  borderColor: colors.brand.dona,

  borderRadius: borderRadius.lg,

  marginHorizontal: spacing.xs,
  marginBottom: spacing.lg,

  ...shadows.md,
 },
  bottomTitle: {
    textAlign: "center",
    marginBottom: spacing.md,
    color: colors.brand.cream,
  },
  bottomTitleTv: {
    fontSize: 36,
    lineHeight: 44,
  },
  bottomSubtitle: {
    textAlign: "center",
    marginBottom: spacing.lg,
    color: colors.text.secondary,
    maxWidth: 500,
    paddingHorizontal: spacing.md,
  },
  bottomSubtitleTv: {
    fontSize: 22,
    maxWidth: 800,
  },
});

export default Landing;
