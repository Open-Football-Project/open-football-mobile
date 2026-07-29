import React from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Team } from 'open-football-project-core';
import Logo from '../../../../general/logo/Logo';
import { colors, spacing, fontSize, fontWeight, breakpoints } from '../../../../../theme';
import type { RootStackParamList } from '../../../../../navigation/RootNavigator';
import { Routes } from '../../../../../navigation/RootNavigator';

interface TeamDetailsInfoProps {
  team: Team;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TeamDetailsInfo({ team }: TeamDetailsInfoProps) {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width >= breakpoints.desktop;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;

  const handleTeamPress = () => {
    if (team?.id) {
      navigation.navigate(Routes.TEAM_DETAILS, { teamId: String(team.id) });
    }
  };

  const teamNameFontSize = isLargeScreen ? fontSize.lg : isTablet ? fontSize.base : fontSize.sm;
  const containerGap = isLargeScreen ? spacing.lg : spacing.md;

  return (
    <View
      style={styles.container}
      testID={`team-details-container-${team.id}`}
    >
      <View style={styles.logoWrapper}>
        <Logo src={team.logo} />
      </View>
      
      <Pressable
        onPress={handleTeamPress}
        disabled={!team?.id}
        style={({ pressed }) => [
          styles.teamLink,
          { gap: containerGap },
          pressed && styles.teamLinkPressed,
        ]}
        testID={`${team.id}-team-link`}
      >
        <Text
          style={[
            styles.teamName,
            { fontSize: teamNameFontSize },
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {team.name}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamLink: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamLinkPressed: {
    opacity: 0.7,
  },
  teamName: {
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
