import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { PlayerTransferInfo, getFormattedDate } from 'open-football-project-core';
import Logo from '../../general/logo/Logo';
import NoData from '../../general/no-data/NoData';
import { TransferArrowIcon } from '../../../icons/Icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, breakpoints } from '../../../theme';
import { Routes, RootStackParamList } from '../../../navigation/RootNavigator';

interface PlayerTransfersProps {
  transfers: PlayerTransferInfo[];
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PlayerTransfers = ({ transfers }: PlayerTransfersProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop && width < breakpoints.tv;

  const dateTextFontSize = isTV ? fontSize.base : isLargeScreen ? fontSize.sm : fontSize.sm;
  const teamNameFontSize = isTV ? fontSize.lg : isLargeScreen ? fontSize.base : fontSize.base;
  const arrowFontSize = isTV ? fontSize.xxl : isLargeScreen ? fontSize.xl : fontSize.lg;
  const containerPadding = isTV ? spacing.lg : isLargeScreen ? spacing.md : spacing.sm;
  const gapSize = isTV ? spacing.lg : isLargeScreen ? spacing.md : spacing.sm;
  const logoSize = isTV ? 48 : isLargeScreen ? 40 : 32;

  const sortedTransfers = useMemo(() => {
    return [...transfers].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [transfers]);

  const handleTeamPress = useCallback(
    (teamId?: number) => {
      if (teamId) {
        navigation.navigate(Routes.TEAM_DETAILS, { teamId: String(teamId) });
      }
    },
    [navigation]
  );

  if (!sortedTransfers.length) {
    return <NoData message={t('nodata.notransfers')} />;
  }

  const renderTransferItem = ({ item: transfer, index }: { item: PlayerTransferInfo; index: number }) => (
    <View
      style={[
        styles.transferCard,
        {
          padding: containerPadding,
          marginBottom: gapSize,
          width: '100%',
          alignSelf: 'stretch',
        },
      ]}
      testID={`transfer-card-${index}`}
    >
      <Text
        style={[
          styles.dateText,
          {
            fontSize: dateTextFontSize,
            color: colors.text.secondary,
          },
        ]}
      >
        {transfer.date ? getFormattedDate(transfer.date, 'dd MMM yyyy') : 'Unknown Date'}
      </Text>
      <View style={[styles.transferDetails, { gap: gapSize }]}> 

        {transfer.fromTeamId != null && (
          <Pressable
            onPress={() => handleTeamPress(transfer.fromTeamId!)}
            style={({ pressed }) => [
              styles.teamSection,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            testID={`from-team-${transfer.fromTeamId}`}
          >
            <Logo src={transfer.fromTeamLogo ?? undefined} size={logoSize} />
            <Text
              style={[
                styles.teamName,
                {
                  fontSize: teamNameFontSize,
                  color: colors.text.secondary,
                  marginLeft: spacing.xs,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {transfer.fromTeamName}
            </Text>
          </Pressable>
        )}

        <View style={styles.arrowContainer}>
          <TransferArrowIcon
            size={arrowFontSize}
            color={colors.brand.success}
            testID="transfer-arrow"
          />
        </View>
        {/* TO TEAM */}
        {transfer.toTeamId != null && (
          <Pressable
            onPress={() => handleTeamPress(transfer.toTeamId!)}
            style={({ pressed }) => [
              styles.teamSection,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            testID={`to-team-${transfer.toTeamId}`}
          >
            <Logo src={transfer.toTeamLogo ?? undefined} size={logoSize} />
            <Text
              style={[
                styles.teamName,
                {
                  fontSize: teamNameFontSize,
                  color: colors.text.secondary,
                  marginLeft: spacing.xs,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {transfer.toTeamName}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      data={sortedTransfers}
      renderItem={renderTransferItem}
      keyExtractor={(_, index) => `transfer-${index}`}
      scrollEnabled={false}
      contentContainerStyle={styles.listContent}
      testID="player-transfers-container"
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    width: '100%',
  },
  transferCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: borders.thin,
    borderColor: colors.background.navbar,
    width: '100%',
    alignSelf: 'stretch',
  },
  dateText: {
    fontWeight: fontWeight.semibold,
    textAlign: 'left',
    marginBottom: spacing.xs,
  },
  transferDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.sm,
  },
  teamSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 0,
  },
  teamName: {
    fontWeight: fontWeight.semibold,
    textAlign: 'left',
    flexShrink: 1,
    marginLeft: spacing.xs,
  },
  arrowContainer: {
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlayerTransfers;
