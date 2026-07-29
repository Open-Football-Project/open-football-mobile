import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  PlayerMainInfo,
  translateCountry,
  translatePlayerPosition,
} from '@matchinsights/core';
import { useTranslation } from 'react-i18next';
import Logo from '../../general/logo/Logo';
import { PersonIcon, InjuredIcon } from '../../../icons/Icons';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders, breakpoints } from '../../../theme';
import { RootStackParamList, Routes } from '../../../navigation/RootNavigator';

interface PlayerHistoryHeaderProps {
  player: PlayerMainInfo;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PlayerHistoryHeader = ({ player }: PlayerHistoryHeaderProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const isTV = width >= breakpoints.tv;
  const isLargeScreen = width >= breakpoints.desktop && width < breakpoints.tv;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const photoSize = isTV ? 120 : isLargeScreen ? 100 : isTablet ? 80 : 60;
  const teamLogoSize = isTV ? 100 : isLargeScreen ? 80 : isTablet ? 60 : 50;
  const gridGap = isTV ? spacing.xl : isLargeScreen ? spacing.lg : isTablet ? spacing.md : spacing.sm;
  const nameFontSize = isTV ? fontSize.xl : isLargeScreen ? fontSize.lg : isTablet ? fontSize.sm : fontSize.sm;
  const labelFontSize = isTV ? fontSize.sm : isLargeScreen ? fontSize.xs : isTablet ? fontSize.xs : fontSize.xs;
  const valueFontSize = isTV ? fontSize.sm : isLargeScreen ? fontSize.xs : isTablet ? fontSize.xs : fontSize.xs;
  const containerPadding = isTV ? spacing.xl : isLargeScreen ? spacing.lg : isTablet ? spacing.md : spacing.md;

  const handleTeamPress = () => {
    if (player.teamId != null && player.teamId > 0) {
      navigation.navigate(Routes.TEAM_DETAILS, { teamId: String(player.teamId) });
    }
  };

  return (
    <View style={[styles.container, { padding: containerPadding }]} testID="player-history-header">
      <View style={[styles.gridContainer, { gap: gridGap }]}>
        
        <View style={styles.leftColumn}>
          {player.photo ? (
            <Image
              source={{ uri: player.photo }}
              style={[
                styles.playerPhoto,
                {
                  width: photoSize,
                  height: photoSize,
                },
              ]}
              testID="player-photo"
              accessibilityLabel={`${player.name} photo`}
            />
          ) : (
            <View
              style={[
                styles.playerPhotoPlaceholder,
                {
                  width: photoSize,
                  height: photoSize,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
              testID="player-photo-placeholder"
              accessibilityLabel={`${player.name} placeholder`}
            >
              <PersonIcon 
                size={photoSize * 0.6} 
                color={colors.text.secondary} 
                testID="player-placeholder-icon"
              />
            </View>
          )}

          <View>
            <Text
              style={[
                styles.playerName,
                {
                  fontSize: nameFontSize,
                  color: colors.brand.success,
                },
              ]}
              numberOfLines={1}
              accessibilityRole="header"
            >
              {player.name}
            </Text>

            {player.nationality && player.nationality !== 'Unknown' && (
              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontSize: labelFontSize,
                      color: colors.brand.rose,
                    },
                  ]}
                >
                  {t('player.nationality')}:
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      fontSize: valueFontSize,
                      color: colors.brand.dona,
                    },
                  ]}
                >
                  {translateCountry(player.nationality, t)}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.middleColumn}>
          {player.age > 0 && (
            <View style={styles.statRow}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: labelFontSize,
                    color: colors.brand.rose,
                  },
                ]}
              >
                {t('player.age')}:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    fontSize: valueFontSize,
                    color: colors.brand.dona,
                  },
                ]}
              >
                {player.age}
              </Text>
            </View>
          )}

          {player.position && player.position !== 'Unknown' && (
            <View style={styles.statRow}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: labelFontSize,
                    color: colors.brand.rose,
                  },
                ]}
              >
                {t('player.position')}:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    fontSize: valueFontSize,
                    color: colors.brand.dona,
                  },
                ]}
              >
                {translatePlayerPosition(player.position, t)}
              </Text>
            </View>
          )}

          {player.height && player.height !== 'Unknown' && (
            <View style={styles.statRow}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: labelFontSize,
                    color: colors.brand.rose,
                  },
                ]}
              >
                {t('player.height')}:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    fontSize: valueFontSize,
                    color: colors.brand.dona,
                  },
                ]}
              >
                {player.height} cm
              </Text>
            </View>
          )}

          {player.weight && player.weight !== 'Unknown' && (
            <View style={styles.statRow}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: labelFontSize,
                    color: colors.brand.rose,
                  },
                ]}
              >
                {t('player.weight')}:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    fontSize: valueFontSize,
                    color: colors.brand.dona,
                  },
                ]}
              >
                {player.weight} kg
              </Text>
            </View>
          )}

          {player.injured === true && (
            <View style={styles.statRow} testID="injury-status">
              <InjuredIcon 
                size={labelFontSize} 
                color={colors.brand.red} 
                testID="injured-icon"
              />
              <Text
                style={[
                  styles.value,
                  {
                    fontSize: valueFontSize,
                    color: colors.brand.red,
                    marginLeft: spacing.xs,
                  },
                ]}
              >
                {t('player.injured')}
              </Text>
            </View>
          )}
        </View>

        {player.teamId != null && player.teamId > 0 && player.teamName !== 'Unknown' && (
          <Pressable
            onPress={handleTeamPress}
            style={({ pressed }) => [
              styles.teamColumn,
              {
                opacity: pressed ? 0.7 : 1,
                gap: spacing.sm,
              },
            ]}
            testID="team-section"
          >
            <Logo src={player.teamLogo ?? undefined} size={teamLogoSize} />
            <Text
              style={[
                styles.teamName,
                {
                  fontSize: valueFontSize,
                  color: colors.brand.yellow,
                },
              ]}
              numberOfLines={2}
            >
              {player.teamName}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    width: '100%',
    borderWidth: borders.thin,
    borderColor: colors.brand.dona,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftColumn: {
  flex: 1,
  minWidth: 0,
  alignItems: 'center',
  gap: spacing.sm,
  },
  playerPhoto: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.dark,
  },
  playerPhotoPlaceholder: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.dark,
  },
  playerName: {
  fontWeight: fontWeight.bold,
  textTransform: 'uppercase',
  flexShrink: 1,
  },
  infoRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: spacing.xs,
  },
  middleColumn: {
  flex: 1,
  minWidth: 0,
  alignItems: 'center',
  gap: spacing.sm,
  },
  statRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.xs,
  },
  label: {
    fontWeight: fontWeight.medium,
  },
  value: {
    fontWeight: fontWeight.normal,
  },
  teamColumn: {
  flex: 1,
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'flex-start',
  },
  teamName: {
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
});

export default PlayerHistoryHeader;
