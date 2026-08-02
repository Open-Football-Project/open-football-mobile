import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { navigationData } from "./navigationData";
import { Routes, RootStackParamList } from "./RootNavigator";
import { CloseIcon, ChevronUpIcon, ChevronDownIcon } from "../icons/Icons";
import { colors } from "../theme/colors";
import { spacing, borderRadius } from "../theme/layout";
import { fontSize, fontWeight } from "../theme/typography";
import { cleanLeagueName, leagueTranslationKey, MobileRoutes } from "open-football-project-core";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SideMenu = ({ visible, onClose }: Props) => {
  const [openLiga, setOpenLiga] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const toggleLiga = (liga: string) => {
    setOpenLiga(openLiga === liga ? null : liga);
  };

  const handleNavigate = (route: MobileRoutes, params?: Record<string, string>) => {
    navigation.navigate({
      name: route as any,
      params: params as any,
      merge: true,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <ScrollView style={styles.container}>       
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
          testID="close-menu-button"
          accessibilityLabel={t('accessibility.close_menu')}
          accessibilityRole="button"
        >
          <CloseIcon size={fontSize.xl} testID="side-menu-close-icon" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.supportUsButton}
          onPress={() => handleNavigate(MobileRoutes.SUPPORT_US)}
          activeOpacity={0.7}
          testID="support-us-nav-button"
          accessibilityLabel={t('navbar.support_us')}
          accessibilityRole="button"
        >
          <Text style={styles.supportUsText}>{t('navbar.support_us')}</Text>
        </TouchableOpacity>

      {navigationData.map((section) => {
        const isOpen = openLiga === section.name;

        return (
          <View key={section.name}>

            <TouchableOpacity
              testID={`section-button-${section.name}`}
              style={styles.sectionButton}
              onPress={() => toggleLiga(section.name)}
              activeOpacity={0.7}
              accessibilityLabel={t(section.name)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
            >
              <View style={styles.sectionLeft}>
                {section.icon && (
                  <Image source={section.icon} style={styles.icon} />
                )}
                <Text style={styles.sectionText}>
                  {t(section.name)}
                </Text>
              </View>

              <Text style={styles.arrow}>
                {isOpen ? <ChevronUpIcon testID={`arrow-up-${section.name}`} /> : <ChevronDownIcon testID={`arrow-down-${section.name}`} />}
              </Text>
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.linksContainer}>
                {section.navLinks.map((link) => {
                  const linkLabel = link.isTranslated
                    ? t(link.title)
                    : cleanLeagueName(
                        t(`league.${leagueTranslationKey(link.title)}`, {
                          defaultValue: link.title,
                        })
                      );

                  return (
                    <TouchableOpacity
                      key={link.title}
                      testID={`link-button-${link.title}`}
                      style={styles.linkButton}
                      onPress={() => handleNavigate(link.route, link.params)}
                      activeOpacity={0.7}
                      accessibilityLabel={linkLabel}
                      accessibilityRole="button"
                    >
                      <Text style={styles.linkText}>{linkLabel}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
      </ScrollView>
    </Modal>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  supportUsButton: {
    backgroundColor: colors.brand.orange,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    borderRadius: borderRadius.xs,
    alignItems: 'center',
  },
  supportUsText: {
    color: colors.text.darker,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
  },
  sectionButton: {
    backgroundColor: colors.overlay.royalblueMid25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
    borderRadius: borderRadius.xs,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  icon: {
    width: spacing.lg,
    height: spacing.lg,
    resizeMode: "contain",
  },
  sectionText: {
    color: colors.text.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
  },
  arrow: {
    color: colors.text.secondary,
    fontSize: fontSize.xs,
  },
  linksContainer: {
    marginLeft: spacing.xl,
    marginTop: spacing.xs,
  },
  linkButton: {
    backgroundColor: colors.overlay.white03,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    borderRadius: borderRadius.xs,
    borderLeftWidth: 2,
    borderLeftColor: colors.brand.royalblue,
  },
  linkText: {
    color: colors.text.secondary,
    fontSize: fontSize.xs,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
});